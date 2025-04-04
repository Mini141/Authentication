# E-Authentication System with QR Code and OTP

A secure multi-factor authentication system featuring QR code scanning and email OTP verification, built with Firebase Authentication.

## Features
- Modern, responsive UI with clean design
- Secure Login/Signup with Firebase
- Dynamic QR Code generation
- Email-based OTP verification
- Mobile-friendly interface
- Multi-factor authentication
- Real-time verification

## How It Works

### 1. User Registration/Login
- User visits the home page
- Chooses to Sign Up or Login
- For new users:
  - Enters full name, email, and password
  - Creates account using Firebase Authentication
- For existing users:
  - Enters email and password
  - Authenticates against Firebase

### 2. QR Code Authentication
- After successful login/signup
- System generates a unique QR code
- QR code contains:
  - User's email
  - Verification endpoint
- User scans QR code using mobile device
- System validates the scan request

### 3. OTP Verification
- Upon successful QR scan
- System generates a 6-digit OTP
- Sends OTP to user's registered email using EmailJS
- User receives email with OTP
- Enters OTP in the verification page
- System validates the entered OTP

### 4. Security Features
- Firebase Authentication for secure credential management
- Email verification for account confirmation
- QR code expiration for security
- OTP timeout mechanism
- Session management
- Encrypted communication

## Setup Instructions

### Prerequisites
1. Firebase Account
2. EmailJS Account
3. Modern web browser
4. Mobile device with QR scanner

### Configuration Steps
1. Firebase Setup:
   ```javascript
   // Add your Firebase configuration in config.js
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-auth-domain",
     projectId: "your-project-id",
     // ... other Firebase config
   };
   ```

2. EmailJS Setup:
   ```javascript
   // Add your EmailJS credentials in otp.html
   - Public Key: "your-public-key"
   - Service ID: "your-service-id"
   - Template ID: "your-template-id"
   ```

3. Email Template Setup:
   - Create template in EmailJS dashboard
   - Add variables: {{to_email}}, {{otp}}
   - Customize email content as needed

### Installation
1. Clone the repository
2. Configure Firebase credentials
3. Set up EmailJS configuration
4. Host the files on a web server
5. Access via web browser

## Technologies Used
- **Frontend:**
  - HTML5
  - CSS3
  - JavaScript
  - Font Awesome Icons
  
- **Authentication:**
  - Firebase Authentication
  - QR Code.js library
  - EmailJS for OTP delivery

- **Security:**
  - Multi-factor authentication
  - Email verification
  - Session management

## Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Mobile Support
- Responsive design
- Touch-friendly interface
- QR code scanner compatibility
- Email client integration

## Contributing
Feel free to fork this project and submit pull requests for improvements.

## License
This project is open source and available under the MIT License.
