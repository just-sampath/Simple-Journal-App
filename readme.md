# Journal App

The Journal App is a web-based application that allows users to maintain a digital journal, where they can record their thoughts, ideas, and experiences. The app is built using Node.js, MongoDB, HTML, CSS, and JavaScript with the Express.js framework. Additionally, there are plans to incorporate React in the future to enhance the user experience.

# Table of Contents

<u> Features </u>
<u>Installation </u>
<u>Usage </u>
<u>Technologies Used </u>
<u>Future Enhancements </u>

# Features

- User registration and authentication system.
- Create, update, and delete journal entries.
- View a list of previous journal entries.
- Simple and intuitive user interface.
- Responsive design for use on different devices.

# Installation

1. Ensure you have Node.js and MongoDB installed on your system.

2. Clone this repository to your local machine using:

`git clone https://github.com/just-sampath/Simple-Journal-App.git`

3. Navigate to the project directory:

`cd journal-app`

4.Install the required npm packages:

`npm install`

# Usage

1. Start the MongoDB server.

2. Run the application:

`npm start`

3. Open your web browser and go to http://localhost:4000 to access the Journal App.

4. Register an account or log in with your existing credentials to start using the app.

5. Create and configure the "config.env" file.

6. Configuration

| Variable       | Description                           |
|----------------|---------------------------------------|
| NODE_ENV       | Environment                           |
| DATABASE       | Database Address                      |
| PORT           | Which port to run on                  |
| DB_PASS        | DB Password                           |
| DB_USER        | DB USERNAME                           |
| JWT_SECRET     | Secret key for encoding our JWT       |
| JWT_EXPIRES_IN | Expiry time for JWT                   |
| EMAIL_HOST     | Email host                            |
| EMAIL_PORT     | Port                                  |
| EMAIL_NAME     | Email username                        |
| EMAIL_PASS     | Email password                        |

# Technologies Used

- Node.js - Backend JavaScript runtime
- MongoDB - NoSQL database for data storage
- HTML - Markup for creating the user interface
- CSS - Styling the user interface
- JavaScript - Frontend logic and interactions
- Express.js - Web application framework for Node.js
- React (Planned) - Enhancing the user interface and user experience

# Future Enhancements

- Integration of React for a more dynamic and interactive user interface.
- Ability to add images and multimedia to journal entries.
- Search functionality to easily find past journal entries.
- Export and import features to back up and restore journal data.
- Social media sharing options for specific journal entries.
