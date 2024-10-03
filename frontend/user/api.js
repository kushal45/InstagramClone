// api.js

const API_BASE_URL = "http://localhost:3000"; // Replace with the actual backend URL

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
