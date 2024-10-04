// api.js

const API_BASE_URL = "http://localhost:3000"; 
const USER_API ="http://localhost:3000/user";
const FOLLOWER_API = "http://localhost:3000/users";

export async function registerUser(username, password, email) {
    try {
        const response = await fetch(`${API_BASE_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, email }),
        });
        return await response.json();
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
}

export async function loginUser(username, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        return {status:response.status,body: await response.json()};
    } catch (error) {
        console.error('Error logging in user:', error);
        throw error;
    }
}

export async function updateUserProfile(newUsername, profilePictureFile, token) {
    const formData = new FormData();
    formData.append('username', newUsername);
    if (profilePictureFile) {
        formData.append('profilePicture', profilePictureFile);  // Add profile picture to form data
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users/update-profile`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`, // Token-based authentication
            },
            body: formData,
        });
        return await response.json();
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
}

export async function fetchUserProfile(username) {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${USER_API}/${encodeURIComponent(username)}/userProfile`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`, // Add Bearer token
            'Content-Type': 'application/json' // Optional: Set content type if needed
        }
    });
    if (response.ok) {
        return await response.json();
    }
    return null;
}

export async function followUser(userId) {
    try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${FOLLOWER_API}/${userId}/follow`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, // Add Bearer token
                'Content-Type': 'application/json'
            }
        });
        console.error('response',response);
        if(response.ok) {
            return await response.json();
        }
        return {
            status: response.status,
            message: response.statusText
        };
    } catch (error) {
        console.error('Error in Followe User api:', error);
    }
}