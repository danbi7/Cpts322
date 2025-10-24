# Sprint 1 Backlog

## User Stories / Issues

### US-01: Frontend Setup & Integration
- **Description:** As a user, I want a functional frontend so I can access the app’s login, registration, and reset password screens.  
- **Priority:** High  
- **Assigned To:** Kenneth Son  
- **Effort Estimate:** 5 story points  
- **Acceptance Criteria:**  
  - React app runs locally with `npm start`.  
  - Login, signup, and reset password forms exist with proper fields.  
  - Frontend communicates with backend endpoints (`/signup`, `/login`, `/reset-password-request`, `/reset-password`).  

---

### US-02: User Registration (Backend)
- **Description:** As a user, I want to register so I can create an account and get access after email verification. 
- **Priority:** High  
- **Assigned To:** Danbi Kim
- **Effort Estimate:** 5 story points  
- **Acceptance Criteria:**  
  - New user is saved in the database with a hashed password.
  - A verification email is sent with a unique token.
  - The account remains disabled until the email is verified.
  - Unit tests confirm successful DB write and email sending logic.

### US-03: User Login (Backend)
- **Description:** As a user, I want to log in so I can securely access my account after verifying my email.
- **Priority:** High  
- **Assigned To:** Danbi Kim
- **Effort Estimate:** 3 story points  
- **Acceptance Criteria:**  
  - Login checks that the email exists and password is correct (hashed comparison).
  - Login is only successful if the account is verified.
  - Invalid credentials are rejected with appropriate error messages.
  - Unit tests confirm DB read and validation logic.

---

### US-04: Forgot Password (Reset Flow)
- **Description:** As a user, I want to reset my password when I forget it so I can regain access to my account.  
- **Priority:** Medium  
- **Assigned To:** Guneet Kaur
- **Effort Estimate:** 4 story points  
- **Acceptance Criteria:**  
  - User requests reset by providing email.  
  - Reset token is generated with 1-hour expiry and emailed.  
  - User clicks reset link → provides new password.  
  - Old password is replaced with new hashed password in DB.  
  - Token invalid after use or after expiry.  
 
