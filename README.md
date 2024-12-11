# EcoHub - Empowering Communities for a Greener Tomorrow

EcoHub is an engaging, community-driven platform designed to inspire and involve people in environmental conservation efforts. Users can participate in and organize activities like clean-up drives, tree planting, and recycling workshops. With features like volunteer opportunities and a donation system, EcoHub fosters a collective sense of responsibility, making it easy and rewarding for individuals and groups to positively impact the planet.

## Installation

Get started with EcoHub.
1. Clone the repository

    ```bash
    git clone https://github.com/dhanvinpatel/EcoHub.git
    cd EcoHub
    ```

2. Install dependencies
Ensure that you have Node.js (LTS) and MongoDB installed. If not, download and install them from [Node.js](https://nodejs.org/en) and [MongoDB](https://www.mongodb.com/try/download/community).

    Then, run the following command:
    ```bash
    npm install
    ```

3. Set up environment variables
Create a .env file in the root of the project and configure the necessary environment variables (GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET).

4. Seed the database
Before starting the server, populate the database with initial data.
    Run the following command in the terminal:
    ```bash
    node .\tasks\seedBlogs.js
    ```

5. Start the development server
Once the database is seeded, run the following command in the terminal to start the server:
    ```bash
    npm start
    ```

    The application should now be running locally on `http://localhost:3000`.