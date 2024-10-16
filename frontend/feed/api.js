// api.js

const API_BASE_URL = "http://localhost:3000"; // Replace with your actual API base URL

/**
 * Fetch posts from the backend API.
 * @returns {Promise<Array>} An array of posts.
 */
export async function fetchPosts() {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(`${API_BASE_URL}/feeds`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Add Bearer token
        "Content-Type": "application/json", // Optional: Set content type if needed
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await { status: response.status, body: await response.json() }; // Assuming the API returns an object with a posts property
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
    const response = await fetch(`${API_BASE_URL}/posts`, {
      // Replace with your actual endpoint
      method: "POST",
      body: postData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

/**
 *
 * @param {*} query query string sent from the search input
 * @returns response json object
 */
export async function fetchSearchResults(query) {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      `${API_BASE_URL}/user/search?q=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Add Bearer token
          "Content-Type": "application/json", // Optional: Set content type if needed
        },
      }
    );
    if (response.ok) {
      return await response.json();
    } else {
      console.error("Error fetching search results:", response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
}

export function fetchUserDetailsFrmToken() {
  const token = localStorage.getItem("authToken");
  if (token) {
    // decode the token to get the user id
    const tokenParts = token.split(".");
    console.log("Token parts", tokenParts);
    const encodedPayload = tokenParts[1];
    const rawPayload = atob(encodedPayload);
    const payload = JSON.parse(rawPayload);
    return payload;
  }
  return null;
}

export async function performLike(postId){
  const token = localStorage.getItem("authToken");
   // Send POST request to the like endpoint
  const like= await fetch(`${API_BASE_URL}/like`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`, // Add Bearer token
      "Content-Type": "application/json", // Optional: Set content type if needed
    },
    body: JSON.stringify({ postId }),
  })
  return like.json(); 
}

export async function performShare(postId){
  const token = localStorage.getItem("authToken");
  // Send POST request to the share endpoint
  const share= await fetch(`${API_BASE_URL}/feeds/share`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`, // Add Bearer token
      "Content-Type": "application/json", // Optional: Set content type if needed
    },
    body: JSON.stringify({ postId }),
  });
  return share.json();
}

export async function performComment({
  postId,
  text,
  userId,
}){
  const token = localStorage.getItem("authToken");
  // Send POST request to the comment endpoint
  await fetch(`${API_BASE_URL}/comments`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`, // Add Bearer token
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ postId, userId, text }),
  })
}
