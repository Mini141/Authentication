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
        // Update URL without refreshing
        const newUrl = window.location.pathname;
        window.history.pushState({}, '', newUrl);
    } else if (formType === 'signup') {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
        qrSection.classList.add('hidden');
        otpSection.classList.add('hidden');
        // Update URL without refreshing
        const newUrl = window.location.pathname + '?form=signup';
        window.history.pushState({}, '', newUrl);
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
        // Attempt to sign in directly
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        console.log('User logged in:', userCredential.user.email);
        localStorage.setItem('userEmail', email);
        showQRCode(email);
    } catch (error) {
        console.error('Login Error:', error);
        if (error.code === 'auth/user-not-found') {
            // User doesn't exist, redirect to signup
            alert('Account not found. Please sign up first.');
            toggleForm('signup');
            // Pre-fill the signup email field
            document.getElementById('signupEmail').value = email;
        } else if (error.code === 'auth/wrong-password') {
            alert('Incorrect password. Please try again.');
        } else {
            alert('Login Error: ' + error.message);
        }
    }
});

// Handle Signup
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const name = document.getElementById('signupName').value;

    try {
        // Create the user account
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        console.log('User signed up:', userCredential.user.email);
        
        // Update profile
        await userCredential.user.updateProfile({
            displayName: name
        });
        
        // Store email and show QR code directly
        localStorage.setItem('userEmail', email);
        showQRCode(email);
        
        // Show success message
        alert('Account created successfully! You are now logged in.');
        
    } catch (error) {
        console.error('Signup Error:', error);
        alert('Signup Error: ' + error.message);
    }
});

// Show QR Code
function showQRCode(email) {
    loginForm.classList.add('hidden');
    signupForm.classList.add('hidden');
    qrSection.classList.remove('hidden');
    otpSection.classList.add('hidden');
    
    // Clear previous QR code
    const qrContainer = document.getElementById('qrcode');
    qrContainer.innerHTML = '';
    
    // Store email in localStorage for OTP verification
    localStorage.setItem('userEmail', email);
    
    // Generate QR code with email parameter - use absolute path
    const baseUrl = window.location.origin;
    const otpUrl = `${baseUrl}/otp.html?email=${encodeURIComponent(email)}`;
    
    console.log('Generated QR URL:', otpUrl);
    
    // Create QR code with better visibility
    new QRCode(qrContainer, {
        text: otpUrl,
        width: 256,
        height: 256,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
    
    // Add instructions for scanning
    const qrInstructions = document.createElement('p');
    qrInstructions.style.marginTop = '20px';
    qrInstructions.style.color = '#666';
    qrInstructions.innerHTML = `
        <i class="fas fa-info-circle"></i> 
        Scan this QR code with your mobile device to receive the OTP.
        When scanned, you'll see a link to the OTP page.
    `;
    qrContainer.parentNode.appendChild(qrInstructions);
    
    // Remove the automatic redirect for mobile devices
    // Instead, show a message for all devices
    const scanMessage = document.createElement('p');
    scanMessage.style.marginTop = '15px';
    scanMessage.style.color = '#6366f1';
    scanMessage.style.fontSize = '14px';
    scanMessage.style.fontWeight = '500';
    scanMessage.innerHTML = `
        <i class="fas fa-mobile-alt"></i> 
        Scan this QR code with your mobile device to continue.
    `;
    qrContainer.parentNode.appendChild(scanMessage);
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