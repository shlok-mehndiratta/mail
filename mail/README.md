# 📬 Full-Stack Email Client – Django + JavaScript

This is a fully functional single-page email client built with **Django**, **JavaScript**, and **Bootstrap**, completed as part of **CS50’s Web Programming with Python and JavaScript** course. The project replicates core features of real-world email systems, with all interactions handled dynamically using frontend JavaScript — no page reloads.

All specified features have been implemented, and additional **CSS enhancements** were made to improve aesthetics, responsiveness, and user experience.

<!-- ---

## 📸 Demo Video https://youtu.be/mZBzNcrIWwc

[![Watch the demo](https://img.youtube.com/vi/mZBzNcrIWwc/0.jpg)](https://www.youtube.com/watch?v=mZBzNcrIWwc) -->

---

## 🧠 Tech Stack

| Layer     | Technologies                            |
|-----------|------------------------------------------|
| Frontend  | JavaScript (vanilla), HTML5, CSS3        |
| Backend   | Django (Python)                          |
| Styling   | Bootstrap 4, Bootstrap Icons, custom CSS |
| Database  | SQLite (default Django setup)            |


--- 

## ✅ Features Implemented

- 🔐 **User Authentication**: Register, login, logout  
- 📨 **Compose & Send Email**: To one or more valid users  
- 📥 **Mailboxes**: Inbox, Sent, and Archive views  
- 📄 **Email Detail View**: Sender, recipients, subject, timestamp, body  
- ✅ **Read Status**: Mark emails as read upon viewing  
- 🗂️ **Archiving**: Archive/unarchive received messages  
- ↩️ **Reply**: Compose reply with pre-filled fields (To, Subject, Quoted Body)  
- ⚡ **SPA Behavior**: All navigation and updates via JavaScript (no reloads)  
- 🎨 **Custom Styling**: Responsive layout, visual feedback for actions, icon buttons  

---

## 💡 Key Functionalities

### 📤 Send Mail
- Composes and sends emails to valid registered users.
- Uses `POST /emails` API endpoint via JavaScript.

### 📬 Mailboxes (Inbox / Sent / Archive)
- Fetches mail dynamically from `GET /emails/<mailbox>`.
- Visually distinguishes read (gray) and unread (white) emails.
- Each email is rendered as a clickable box with minimal clutter.

### 📖 Email Detail View
- Shows sender, recipients, subject, timestamp, and body.
- Automatically marks email as read via `PUT /emails/<id>`.

### 🗂 Archive / Unarchive
- Available only in Inbox and Archive views.
- Toggles archived state with a button under the timestamp.

### ↩️ Reply to Email
- Pre-fills:
  - **To**: sender of the original email
  - **Subject**: prefixed with `Re:` if not already
  - **Body**: quoted original message with timestamp

---

## 🧪 API Endpoints Used

- `GET /emails/<mailbox>` — fetch inbox, sent, or archive  
- `GET /emails/<id>` — fetch single email  
- `POST /emails` — send a new email  
- `PUT /emails/<id>` — update email’s read/archive status  

_All requests handled asynchronously via `fetch()` in `inbox.js`._

---


## 🎨 UI/UX Enhancements

- 🖌 Clean visual structure using Bootstrap 4
- 📱 Mobile responsiveness with flexbox layouts
- ✅ Colored feedback for read/unread status
- ⏱ Timestamp and subject aligned using flex utility classes
- ↩️ "Reply" button replaced with a sleek icon (`<i class="bi bi-reply"></i>`)
- 🧭 Smooth toggling between views with instant DOM updates

---

## 🛠 Project Setup

Clone the repository and run the project locally:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/shlok-mehndiratta/mail.git
   cd mail
   ```

2. **Install Dependencies**
    ```bash
    pip install -r requirements.txt
    ```

3. **Run Migrations**
    ```bash
    python manage.py makemigrations mail
    python manage.py migrate
    ```

4. **Start the Server**
    ```bash
    python manage.py runserver
    ```

5. Visit http://127.0.0.1:8000/ in your browser and register a new user (can use any fake email/password combo).

---

## 🧠 What I Learned

- Built a dynamic single-page interface using vanilla JavaScript and the Fetch API
- Integrated Django views and models to serve and handle structured JSON data
- Used RESTful API methods (GET, POST, PUT) to manage frontend-backend communication
- Managed application state and conditional UI rendering without page reloads
- Applied Bootstrap and custom CSS for layout, responsiveness, and clean design

---

### 🙋‍♂️ About Developer
Shlok Mehndiratta<br>
BS in EECS, IISER Bhopal<br>
[GitHub](https://github.com/shlok-mehndiratta) • [LinkedIn](https://www.linkedin.com/in/shlok-mehndiratta)
