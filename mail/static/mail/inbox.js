let currentEmailId = null;
let currentMailbox = 'inbox';

document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').addEventListener('submit', compose_submit);
  document.querySelector('#unarchive').addEventListener('click', function(){ 
    if (currentEmailId !== null) unarchive_mail(currentEmailId);
  });
  document.querySelector('#archive').addEventListener('click', function() {
    if (currentEmailId !== null) archive_mail(currentEmailId);
  });
  
  // By default, load the inbox
  load_mailbox('inbox');
});

// Function to show the compose email view
function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-details').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}


// Function to load a specific mailbox
function load_mailbox(mailbox) {
  currentMailbox = mailbox; 
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-details').style.display = 'none';

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
            email_element.className = 'email-item w-100 my-1 btn alert alert-dark border border-dark justify-content-between align-items-center';
          } else {
            email_element.className = 'email-item w-100 my-1 btn alert border border-dark justify-content-between align-items-center';
          }
          
          email_element.innerHTML = `
              <span class="float-left"> 
              <strong>${mail.sender}</strong> - ${mail.subject}
              </span>
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
  currentEmailId = id;
  document.querySelector('#view-email').innerHTML ='';

  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-details').style.display = 'block';

  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
    console.log(email);

  if (currentMailbox !== "sent") {
        if (email.archived) {
          document.querySelector('#archive').style.display = 'none';
          document.querySelector('#unarchive').style.display = 'block';
        } else {
          document.querySelector('#archive').style.display = 'block';
          document.querySelector('#unarchive').style.display = 'none';
        }
  } else {
        document.querySelector('#archive').style.display = 'none';
        document.querySelector('#unarchive').style.display = 'none';
  }

  const emailview = document.createElement('div')
  emailview.className = 'mail-details'
  emailview.innerHTML = `
          <p><strong>From: </strong>${email.sender}</p>
          <p><strong>To: </strong>${email.recipients}</p>
          <p><strong>Subject: </strong>${email.subject}</p>
          <p><strong>Timestamp: </strong>${email.timestamp}</p>
          <button class="btn btn-sm btn-outline-primary" id="reply">Reply</button>
          <hr>
          <p class="mb-3">${email.body}</p>
          `;
  document.querySelector('#view-email').append(emailview);
    
  });

  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true })
  });
}


function archive_mail(id) {
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: true })
  })
  .then(() => {
    console.log('Archived successfully');
    load_mailbox('inbox');
})
}

function unarchive_mail(id) {
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: false })
  })
  .then(() => {
    console.log('Unarchived successfully');
    load_mailbox('inbox');
})
}