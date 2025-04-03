// Firebase configuration is now in config.js

// DOM Elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const qrSection = document.getElementById('qr-section');
const otpSection = document.getElementById('otp-section');

// Check URL parameters for initial form display
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const formType = urlParams.get('form');
    if (formType === 'signup') {
        toggleForm('signup');
    } else {
        toggleForm('login');
    }
});

// Toggle between login and signup forms
function toggleForm(formType) {
    if (formType === 'login') {
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
        qrSection.classList.add('hidden');
        otpSection.classList.add('hidden');
    } else {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
        qrSection.classList.add('hidden');
        otpSection.classList.add('hidden');
    }
}

// Generate QR Code
function generateQRCode(email) {
    // Get the base URL (works for both local and deployed environments)
    const baseUrl = window.location.origin;
    const otpUrl = `${baseUrl}/otp.html?email=${encodeURIComponent(email)}`;
    const qrcode = new QRCode(document.getElementById("qrcode"), {
        text: otpUrl,
        width: 200,
        height: 200
    });
}

// Generate OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
}

// Handle Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
        showQRCode(email);
    } catch (error) {
        alert('Login Error: ' + error.message);
    }
});

// Handle Signup
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const name = document.getElementById('signupName').value;

    try {
        await firebase.auth().createUserWithEmailAndPassword(email, password);
        await firebase.auth().currentUser.updateProfile({
            displayName: name
        });
        showQRCode(email);
    } catch (error) {
        alert('Signup Error: ' + error.message);
    }
});

// Show QR Code
function showQRCode(email) {
    loginForm.classList.add('hidden');
    signupForm.classList.add('hidden');
    qrSection.classList.remove('hidden');
    document.getElementById('qrcode').innerHTML = '';
    generateQRCode(email);
    
    // Simulate QR code scan (in real app, this would be triggered by actual scan)
    setTimeout(() => {
        const otp = generateOTP();
        // In a real application, send this OTP to user's email using Firebase Cloud Functions
        console.log('OTP:', otp);
        showOTPSection();
    }, 30000); // Simulate 30 second delay for QR scan
}

// Show OTP Section
function showOTPSection() {
    qrSection.classList.add('hidden');
    otpSection.classList.remove('hidden');
}

// Handle OTP Verification
document.getElementById('otpForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const enteredOTP = document.getElementById('otpInput').value;
    const storedOTP = localStorage.getItem('currentOTP');
    
    if (enteredOTP === storedOTP) {
        // Clear the stored OTP
        localStorage.removeItem('currentOTP');
        localStorage.removeItem('otpTimestamp');
        // Redirect to success page
        window.location.href = 'success.html';
    } else {
        alert('Invalid OTP. Please try again.');
    }
});
