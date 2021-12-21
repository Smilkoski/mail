document.addEventListener('DOMContentLoaded', function () {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');

  document.querySelector(".btn.btn-primary").addEventListener('click', send_email)

  return false
});

function unarchive_email(element) {
  fetch('/emails/' + element, {
    method: 'PUT',
    body: JSON.stringify({
      archived: false
    })
  })
  load_mailbox('inbox');
}

function archive_email(element) {
  fetch('/emails/' + element, {
    method: 'PUT',
    body: JSON.stringify({
      archived: true
    })
  })
  load_mailbox('inbox');
}

function show_email(element) {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  fetch('/emails/' + element)
    .then(response => response.json())
    .then(email => {
      let e
      if (document.querySelector('#email-data') === null) {
        e = document.createElement('div')
        e.id = 'email-data';
      } else {
        e = document.querySelector('#email-data')
        e.style.display = 'block'
      }

      e.innerHTML = `<h6><b>From: </b>${email.sender}</h6>
                   <h6><b>To: </b>${email.recipients}</h6>
                   <h6><b>Subject: </b>${email.subject}</h6>
                   <h6><b>Timestamp: </b>${email.timestamp}</h6>
                   <input type="button" class="btn btn-sm btn-outline-primary" value="Reply">
                   <hr>
                   <p>${email.body}</p>`

      document.querySelector('.container').append(e);
    })

  fetch('/emails/' + element, {
    method: 'PUT',
    body: JSON.stringify({
      read: true
    })
  })

}

function send_email() {
  let recipients_data = document.querySelector('#compose-recipients').value;
  let subject_data = document.querySelector('#compose-subject').value;
  let body_data = document.querySelector('#compose-body').value;

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients_data,
      subject: subject_data,
      body: body_data
    })
  });

  load_mailbox('sent')
}

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {

  fetch('/emails/' + mailbox)
    .then(response => response.json())
    .then(emails => {
      // Print emails

      let text = ''
      for (let i = 0; i < emails.length; i++) {
        let read = emails[i].read
        text +=
          `<div  class="email-row ${read}">
            <div onclick="show_email(${emails[i].id})" class="email-content">
              <b>${emails[i].sender}</b>   
              <p>${emails[i].subject}</p>
              <span>${emails[i].timestamp}</span>
            </div>`
        if (mailbox === 'inbox') {
          text += `<button onclick="archive_email(${emails[i].id})" class="archive">                 
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-archive" viewBox="0 0 16 16">
                          <path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1V2zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5H2zm13-3H1v2h14V2zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
                    </svg>
                    </button>`
        }
        if (mailbox === 'archive') {
          text += `<button onclick="unarchive_email(${emails[i].id})" class="archive">                 
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-archive" viewBox="0 0 16 16">
                            <path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1V2zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5H2zm13-3H1v2h14V2zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
                      </svg>
                    </button>`
        }
        text += `</div>`
      }
      document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`
      document.querySelector('#emails-view').innerHTML += text;
    });

  // Show the mailbox and hide other views
  if (document.querySelector('#email-data') !== null) {
    document.querySelector('#email-data').style.display = 'none';
  }
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'block';

}