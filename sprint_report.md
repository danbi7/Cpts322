# Sprint 1 Report
Video Link: https://youtu.be/62aeviQ9x58?si=DQetRnuZLm1d5l2o

## What's New (User Facing)
* Frontend setup with React (signup, login, reset password forms).
* User registration with email verification.
* User login with secure password hashing.
* Password reset feature (email with token link).

## Work Summary (Developer Facing)
In Sprint 1, our team set up the basic user system. One member worked on the frontend React app, adding forms for signup, login, and reset password. Another member built the backend for registration and login, including database calls, password hashing, and email verification tokens. The third member added password reset (token generation, email sending, password update).  
We had some blockers with GitHub merge conflicts and MySQL/SMTP setup but fixed them together. We learned how to better split tasks and use a Kanban board.

## Unfinished Work
* Some frontend form validation are missing.
* Full end-to-end tests between frontend and backend are not done yet.

## Completed Issues/User Stories
* Frontend setup & integration.  
* User registration & login.  
* Forgot password (reset flow).  

## Incomplete Issues/User Stories
* None fully blocked, but testing + frontend polish will move to Sprint 2.

## Code Files for Review
* `UserService.java`  
* `UserController.java`  
* `EmailService.java`  
* `UserMapper.java`  
* `src/front/App.js`

## Retrospective Summary
**What went well:**  
* Team split work clearly.  
* Email verification + reset worked.  
* First backend/frontend connection.  

**What we want to improve:**  
* GitHub merging caused issues.  
* Setup took longer than expected.  
* Need better communication.  

**Next Sprint (Sprint 2):**  
* Add user profile (basic info + edit option).  
* Start study group feature (create/join groups).  
* Add frontend form validation + better error handling.  
* Begin adding automated tests.  

