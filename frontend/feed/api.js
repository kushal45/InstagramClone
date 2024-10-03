// api.js

const API_BASE_URL = "http://localhost:3000"; // Replace with your actual API base URL

/**
 * Fetch posts from the backend API.
 * @returns {Promise<Array>} An array of posts.
 */
export async function fetchPosts(token) {
    try {
        const response = await fetch(`${API_BASE_URL}/feeds`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Add Bearer token
                'Content-Type': 'application/json' // Optional: Set content type if needed
            }
    });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await {status:response.status,body: await response.json()}; // Assuming the API returns an object with a posts property
    } catch (error) {
        console.error("Error fetching posts:", error);
        throw error; // Rethrow the error for handling in the caller function
    }
}

/**
 * Create a new post by sending text and image to the backend API.
 * @param {FormData} formData - The form data containing the post details.
 * @returns {Promise<Object>} The created post object.
 */
export async function createPost(postData) {
    try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${API_BASE_URL}/posts`, { // Replace with your actual endpoint
            method: "POST",
            body: JSON.stringify(postData),
            headers: {
                'Authorization': `Bearer ${token}`, // Add Bearer token
                'Content-Type': 'application/json' // Optional: Set content type if needed
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json(); // Assuming the API returns the created post
    } catch (error) {
        console.error("Error creating post:", error);
        throw error; // Rethrow the error for handling in the caller function
    }
}
