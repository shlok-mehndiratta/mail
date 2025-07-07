document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').addEventListener('submit', compose_submit);
  
  // By default, load the inbox
  load_mailbox('inbox');
});

// Function to show the compose email view
function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#view-email').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}


// Function to load a specific mailbox
function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#view-email').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Fetch emails from the server
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(email => {

      // Loop through each email and display it
      email.forEach(mail => {
          const email_element = document.createElement('div');
          if (mail.read){
            email_element.className = 'email-item w-100 btn alert alert-dark border border-dark';
          } else {
            email_element.className = 'email-item w-100 btn alert border border-dark';
          }
          
          email_element.innerHTML = `
              <div class="float-left"> 
              <strong>${mail.sender}</strong> - ${mail.subject}
              </div>
              <span class="text-muted float-right">
                  ${mail.read ? '<span class="badge badge-secondary">Read</span>' : '<span class="badge badge-primary">Unread</span>'}
              ${mail.timestamp}</span>
          `;

          // Add click event to view the email
          email_element.addEventListener('click', () => {
              view_email(mail.id);
          });

          // Append the email element to the mailbox view
          document.querySelector('#emails-view').append(email_element);
      });
  });

}


function compose_submit(event) {
  event.preventDefault();

  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  // Send the email data to the server
  fetch('/emails', {
  method: 'POST',
  body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result.message);
  });

  // After sending, load the sent mailbox
  load_mailbox('sent');
}


function view_email(id) {
  document.querySelector('#view-email').innerHTML ='';

  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#view-email').style.display = 'block';

  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
    console.log(email);

    const emailview = document.createElement('div')
    emailview.className = 'mail-details'
    emailview.innerHTML = `
            <p><strong>From: </strong>${email.sender}</p>
            <p><strong>To: </strong>${email.recipients}</p>
            <p><strong>Subject: </strong>${email.subject}</p>
            <p><strong>Timestamp: </strong>${email.timestamp}</p>
            <button class="btn btn-sm btn-outline-primary" id="reply">Reply</button>
            <hr>
            <p class="mb-5">${email.body}</p>
            `;
    document.querySelector('#view-email').append(emailview);

  })

}