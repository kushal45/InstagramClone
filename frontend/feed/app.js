import { fetchPosts, createPost } from "./api.js"; // Import API functions

document.addEventListener("DOMContentLoaded", function () {
  const postForm = document.getElementById("post-form");
  const feedContainer = document.getElementById("feed");
  const token = localStorage.getItem("authToken");
  // Function to display posts in the feed
  function displayPosts(posts) {
    
    feedContainer.innerHTML = ""; // Clear existing posts
    posts.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.className = "post";

      postElement.innerHTML = `
                <div class="post-header">
                    <img src="${post.userProfilePic}" alt="User" class="post-user-pic">
                    <span class="post-username">${post.username}</span>
                </div>
                <div class="post-image">
                    <img src="${post.imageUrl}" alt="Post Image">
                </div>
                <div class="post-text">${post.text}</div>
                <div class="post-actions">
                    <button class="like-button" data-id="${post.id}">Like (${post.likes})</button>
                    <button class="share-button" data-id="${post.id}">Share</button>
                    <button class="comment-button" data-id="${post.id}">Comment</button>
                </div>
                <div class="comments-section">
                    <div class="comments" data-id="${post.id}"></div>
                    <input type="text" class="comment-input" placeholder="Add a comment..." data-id="${post.id}">
                </div>
            `;

      // Attach event listeners for the buttons
      postElement
        .querySelector(".like-button")
        .addEventListener("click", function () {
          handleLike(post.id);
        });
      postElement
        .querySelector(".share-button")
        .addEventListener("click", function () {
          handleShare(post.id);
        });
      postElement
        .querySelector(".comment-input")
        .addEventListener("keypress", function (event) {
          if (event.key === "Enter") {
            const commentText = event.target.value;
            handleComment(post.id, commentText);
            event.target.value = ""; // Clear input field
          }
        });

      feedContainer.appendChild(postElement);
    });
  }
 
  console.log("Token:", token);
  // Fetch posts when the page loads
  fetchPosts(token)
    .then((posts) => {
      console.log("Posts:", posts);
      if (posts.status == 200) {
        displayPosts(posts.body.data.data);
      } else {
        alert("Failed to fetch posts");
      }
    })
    .catch((error) => console.error("Failed to load posts:", error));

  // Handle form submission to create a new post
  postForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent page reload
    const postText = document.getElementById("post-text").value;

    // Get the selected file from the input field
    const postImage = document.getElementById("post-image").files[0];
    console.log("postImage", postImage, "postText", postText);
    // Validate if necessary fields are filled
    if (postText == null && postImage== null) {
      alert("Please enter some text or choose an image to share!");
      return;
    }

    const postData={
        text:postText,
    };
    if (postImage) {
        postData.imageUrl=postImage;
    }

    //const text = document.getElementById("post-text").value;
    // const image = document.getElementById("post-image").files[0];

    try {
      await createPost(postData); // Call createPost from API module
      document.getElementById("post-text").value = ""; // Clear textarea
      document.getElementById("post-image").value = ""; // Clear file input
      fetchPosts().then((posts) => displayPosts(posts)); // Refresh posts after new post
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  });
});
