// app.js

import { registerUser, loginUser, updateUserProfile } from './api.js';

// DOM Elements
const registerSection = document.getElementById('registerSection');
const loginSection = document.getElementById('loginSection');
const updateProfileSection = document.getElementById('updateProfileSection');

// Buttons for showing different sections
const showRegisterBtn = document.getElementById('showRegister');
const showLoginBtn = document.getElementById('showLogin');
const showUpdateProfileBtn = document.getElementById('showUpdateProfile');

// Function to switch between sections
function showSection(section) {
    // Hide all sections
    registerSection.classList.remove('active');
    loginSection.classList.remove('active');
    updateProfileSection.classList.remove('active');
    
    // Show the selected section
    section.classList.add('active');
}

// Add event listeners for navigation buttons
showRegisterBtn.addEventListener('click', () => showSection(registerSection));
showLoginBtn.addEventListener('click', () => showSection(loginSection));
showUpdateProfileBtn.addEventListener('click', () => showSection(updateProfileSection));

// Initially show the login form
showSection(loginSection);

// Register form handler
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const email = document.getElementById('registerEmail').value;

    try {
        const result = await registerUser(username, password, email);
        alert('Registration successful: ' + JSON.stringify(result));
        showSection(loginSection); // Automatically switch to login after registration
    } catch (error) {
        alert('Registration failed');
    }
});

// Login form handler
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const result = await loginUser(username, password);
        if(result.status == 200){
            const token = result.body.token;
            console.log("Token: ", token);
            localStorage.setItem('authToken', token); 
            //const tokenfetched = localStorage.getItem('authToken');
            //console.log("Token fetched: ", tokenfetched);
            location.href="../feed";
       }else{
           alert('Login failed with status: ' + result.status);
       }
        // Store the token for future requests
      // alert('Login successful: ' + JSON.stringify(result));
      
        
        //showSection(updateProfileSection); // Automatically switch to profile after login
    } catch (error) {
        alert('Login failed with error');
        console.log(error);
    }
});

// Update profile form handler
document.getElementById('updateProfileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const newUsername = document.getElementById('newUsername').value;
    const profilePicture = document.getElementById('profilePicture').files[0];

    try {
        const result = await updateUserProfile(newUsername, profilePicture);
        alert('Profile updated: ' + JSON.stringify(result));
    } catch (error) {
        alert('Profile update failed');
    }
});
