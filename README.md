# EcoHub - Empowering Communities for a Greener Tomorrow

**EcoHub** is a community-driven web platform designed to inspire and connect people around environmental conservation. Whether you want to join a local clean-up drive, plant trees, attend recycling workshops, or donate to green initiatives — EcoHub makes it easy and rewarding to take meaningful action for the planet.

---

## What It Does

A seamless experience designed to connect eco-conscious individuals with real-world environmental opportunities.

1. **Browse Events** – Discover nearby environmental events like clean-up drives, tree planting, and recycling workshops in your community.
2. **Volunteer** – Sign up to volunteer for events and track your participation history.
3. **Organize Events** – Create and manage your own environmental initiatives and invite others to join.
4. **Donate** – Support environmental causes directly through the platform's built-in donation system.
5. **Read & Write Blogs** – Share eco-tips, stories, and updates through a community blog section.
6. **User Profiles** – Manage your profile, view your event history, and track your environmental contributions.
7. **Authentication** – Secure sign-up and login with Google OAuth integration.

---

## Why It Matters

Environmental challenges require collective action. Many people want to contribute but don't know where to start or how to find opportunities near them.

EcoHub bridges that gap — making it simple for individuals, student groups, and local organizations to discover, organize, and participate in green initiatives. By combining community engagement, volunteering, and donations in one place, EcoHub fosters a shared sense of responsibility and empowers everyday people to make a real difference.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML, CSS, JavaScript |
| **Backend** | Node.js + Express |
| **Database** | MongoDB + Mongoose ODM |
| **Templating** | Handlebars (HBS) |
| **Authentication** | Google OAuth 2.0 |
| **Validation** | Custom validators (`/validators`) |

---

## Project Structure

```
EcoHub/
├── config/         # Environment and database configuration
├── models/         # Mongoose schemas and models (users, events, blogs, etc.)
├── public/         # Static assets (CSS, JS, images)
├── routes/         # Express route handlers
├── tasks/          # Database seeding scripts
├── validators/     # Input validation logic
├── views/          # Handlebars templates
├── app.js          # Main application entry point
└── package.json    # Project dependencies
```

---

## Use Case

* Individuals looking to get involved in local environmental efforts
* Student groups or clubs organizing green campus events
* NGOs and nonprofits seeking a platform to manage volunteers and donations
* Anyone passionate about sustainability wanting to connect with like-minded people

---

## Potential Enhancements

* Map view for discovering events by location
* Impact dashboard showing total trees planted, waste collected, donations raised
* Badges and rewards system for active volunteers
* Mobile app version for on-the-go event management
* Email/SMS notifications for upcoming events

---

## Instructions to Run the Project

### 1. Clone the Repository

```bash
git clone https://github.com/Angelina1225/EcoHub.git
cd EcoHub
```

### 2. Install Dependencies

Ensure you have **Node.js (LTS)** and **MongoDB** installed (Mongoose is included as an npm dependency).
- [Download Node.js](https://nodejs.org/en)
- [Download MongoDB](https://www.mongodb.com/try/download/community)

Then run:

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root of the project and add the following:

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

You can obtain these credentials by setting up a project in the [Google Developer Console](https://console.developers.google.com/).

### 4. Seed the Database

Populate the database with initial data by running:

```bash
node ./tasks/seedBlogs.js
```

### 5. Start the Application

```bash
npm start
```

The application will be running at `http://localhost:3000`

---

## Built By

* [Angelina Mande](https://github.com/Angelina1225)
* [Dhanvin Patel](https://github.com/dhanvinpatel)
