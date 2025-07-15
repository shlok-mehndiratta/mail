let currentEmailId = null;
let currentMailbox = "inbox";

document.addEventListener("DOMContentLoaded", function () {
  // Use buttons to toggle between views
  document
    .querySelector("#inbox")
    .addEventListener("click", () => load_mailbox("inbox"));
  document
    .querySelector("#sent")
    .addEventListener("click", () => load_mailbox("sent"));
  document
    .querySelector("#archived")
    .addEventListener("click", () => load_mailbox("archive"));
  document.querySelector("#compose").addEventListener("click", compose_email);
  document
    .querySelector("#compose-form")
    .addEventListener("submit", compose_submit);

  // By default, load the inbox
  load_mailbox("inbox");
});

// Function to show the compose email view
function compose_email() {
  // Show compose view and hide other views
  document.querySelector("#emails-view").style.display = "none";
  document.querySelector("#compose-view").style.display = "block";
  document.querySelector("#email-details").style.display = "none";

  // Clear out composition fields
  document.querySelector("#compose-recipients").value = "";
  document.querySelector("#compose-subject").value = "";
  document.querySelector("#compose-body").value = "";
}

// Function to load a specific mailbox
function load_mailbox(mailbox) {
  currentMailbox = mailbox;
  // Show the mailbox and hide other views
  document.querySelector("#emails-view").style.display = "block";
  document.querySelector("#compose-view").style.display = "none";
  document.querySelector("#email-details").style.display = "none";

  // Show the mailbox name
  document.querySelector("#emails-view").innerHTML = `<u><h3 class="mailbox-heading">${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3></u>`;

  // Fetch emails from the server
  fetch(`/emails/${mailbox}`)
    .then((response) => response.json())
    .then((email) => {
      // Loop through each email and display it
      email.forEach((mail) => {
        const email_element = document.createElement("div");

        let classes =
          "email-item w-100 my-1 btn alert border border-dark justify-content-between align-items-center";
        if (mail.read) {
          classes += " alert-dark";
        }
        email_element.className = classes;

        email_element.innerHTML = `
              <span class="float-left"> 
              <strong>${mail.sender}</strong> - ${mail.subject}
              </span>
              <span class="text-muted float-right">
                  ${
                    mail.read
                      ? '<span class="badge badge-secondary">Read</span>'
                      : '<span class="badge badge-primary">Unread</span>'
                  }
              ${mail.timestamp}</span>
          `;

        // Add click event to view the email
        email_element.addEventListener("click", () => {
          view_email(mail.id);
        });

        // Append the email element to the mailbox view
        document.querySelector("#emails-view").append(email_element);
      });
    });
}

function compose_submit(event) {
  event.preventDefault();

  const recipients = document.querySelector("#compose-recipients").value;
  const subject = document.querySelector("#compose-subject").value;
  const body = document.querySelector("#compose-body").value;

  // Send the email data to the server
  fetch("/emails", {
    method: "POST",
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body,
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      // Print result
      console.log(result.message);
    });

  // After sending, load the sent mailbox
  load_mailbox("sent");
}

function view_email(id) {
  currentEmailId = id;
  document.querySelector("#view-email").innerHTML = "";

  document.querySelector("#emails-view").style.display = "none";
  document.querySelector("#compose-view").style.display = "none";
  document.querySelector("#email-details").style.display = "block";
  document.querySelector("#reply-view").style.display = "none";

  fetch(`/emails/${id}`)
    .then((response) => response.json())
    .then((email) => {
      console.log(email);

      const emailview = document.createElement("div");
      emailview.className = "mail-details";
      emailview.innerHTML = `
            <div class="d-flex justify-content-between align-items-start" >
            <p class="h4 mb-3"><strong>Subject: </strong>${email.subject}</p>
            <p class="float-right font-weight-light">${email.timestamp}</p>
            </div>
            ${
              currentMailbox !== "sent"
                ? `
              <button id="archive-button"
              class="btn btn-sm float-right ${
                email.archived ? "btn-outline-info" : "btn-outline-secondary"
              } mb-2">
              ${email.archived ? "Unarchive" : "Archive"}
              </button>`
                : ""
            }

            <p class="my-1"><strong>From: </strong>${email.sender}</p>
            <p class="mt-1"><strong>To: </strong>${email.recipients}</p>

            <button class="btn btn-sm btn-outline-primary" id="reply"><i class="bi bi-reply fs-1"></i> Reply</button>
            <hr>
            <p class="mb-3" style="white-space: pre-wrap;">${email.body}</p>
            `;
      document.querySelector("#view-email").append(emailview);

      if (currentMailbox !== "sent") {
        const archivebtn = document.querySelector("#archive-button");
        archivebtn.addEventListener("click", function () {
          fetch(`/emails/${id}`, {
            method: "PUT",
            body: JSON.stringify({
              archived: !email.archived,
            }),
          }).then(() => {
            load_mailbox("inbox");
          });
        });
      }

      if (!email.read) {
        fetch(`/emails/${id}`, {
          method: "PUT",
          body: JSON.stringify({
            read: true,
          }),
        }).then(() => {
          console.log("Marked as Read");
        });
      }

      document.querySelector("#reply").addEventListener("click", () => {
        reply();
      });
    });
}

// Function to handle replying to an email
function reply() {
  document.querySelector("#reply-view").style.display = "block";
  id = currentEmailId;

  fetch(`/emails/${id}`)
    .then((response) => response.json())
    .then((email) => {
      replydiv = document.createElement("div");
      replydiv.innerHTML = `
    <button type="button" class="close p-2" aria-label="Close">×</button>
    <form id="reply-form">
    <div class="form-group"> 
          ↵ <strong>${email.subject.startsWith("Re:") ? `${email.subject}` : `Re: ${email.subject}`}</strong>
    </div>
    <hr>
    <div class="form-group d-flex align-items-center">
        <label class="mr-2">To:</label>
         <input id="reply-recipients" class="form-control py-1" value="${email.sender}">
    </div>
    <textarea class="form-control textarea-reply" id="reply-body" rows="8" autofocus></textarea>
    <input type="submit" class="btn btn-primary my-2" value="Send">
    </form>
    `;

      document.querySelector("#reply-view").innerHTML = "";
      document.querySelector("#reply-view").append(replydiv);

      const quoted = `\n\n\n-------------------------------------------------------------------\nOn ${email.timestamp} ${email.sender} wrote:\n${email.body.split('\n').map(line => '| ' + line).join('\n')}`;
      // Set textarea value: first line empty, quoted message below
      const textarea = document.getElementById("reply-body");
      textarea.value = quoted;

      // Place cursor at the top (start of textarea)
      textarea.selectionStart = 0;
      textarea.selectionEnd = 0;
      textarea.focus();

      document.querySelector(".close").onclick = function () {
        document.querySelector("#reply-view").style.display = "none";
      };

      document.querySelector("#reply-form").onsubmit = function (event) {
        event.preventDefault();
        const replyBody = document.querySelector("#reply-body").value;
        const replyRecipients = document.querySelector("#reply-recipients").value;

        fetch("/emails", {
          method: "POST",
          body: JSON.stringify({
            recipients: replyRecipients,
            subject: email.subject.startsWith("Re:") ? `${email.subject}` : `Re: ${email.subject}`,
            body: replyBody
          })
        })
        .then(() => {
          load_mailbox("sent");
        });
      };
    });
}
