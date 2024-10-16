import { fetchPosts, createPost, fetchSearchResults, fetchUserDetailsFrmToken, performLike, performShare, performComment } from "./api.js"; // Import API functions

const feedContainer = document.getElementById("feed");
document.addEventListener("DOMContentLoaded", function () {
  integrateSearchFunctionality();
  const postForm = document.getElementById("post-form");
  // Function to display posts in the feed
  // Fetch posts when the page loads
  fetchPosts()
    .then((posts) => {
      console.log("Posts:", posts);
      fetchAndValidatePostsToDisplay(posts);
    })
    .catch((error) => console.error("Failed to load posts:", error));

  // Handle form submission to create a new post
  postForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent page reload
    const postText = document.getElementById("post-text").value;

    // Get the selected file from the input field
    const postImage = document.getElementById("post-image").files[0];
    //console.log("postImage", postImage, "postText", postText);
    const formData = new FormData();
    if(postImage!=null){
      formData.append("imageUrl", postImage);
    }
    formData.append("text", postText);
    console.log("postImage", postImage, "postText", postText);
    console.log("formData", formData);
    // Validate if necessary fields are filled
    if (postText == null && postImage == null) {
      alert("Please enter some text or choose an image to share!");
      return;
    }

    //const text = document.getElementById("post-text").value;
    // const image = document.getElementById("post-image").files[0];

    try {
      await createPost(formData); // Call createPost from API module
      document.getElementById("post-text").value = ""; // Clear textarea
      document.getElementById("post-image").value = ""; // Clear file input
      fetchPosts().then((posts) => fetchAndValidatePostsToDisplay(posts)); // Refresh posts after new post
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  });

  webSocketConnectionInit();
});

function fetchAndValidatePostsToDisplay(posts) {
  if (posts.status == 200) {
    displayPosts(posts.body.data.data);
  } else {
    alert("Failed to fetch posts");
  }
}

function displayPosts(posts) {
  console.log("Posts:", posts);
  feedContainer.innerHTML = ""; // Clear existing posts
  posts.forEach((post) => {
    const asset = post.asset;
    const postElement = document.createElement("div");
    postElement.className = "post";

    postElement.innerHTML = `
              <div class="post-header">
                  <img src="${asset.userProfilePic}" alt="User" class="post-user-pic">
                  <span class="post-username">${post.userId}</span>
              </div>
              <div class="post-image">
                  <img src="${asset.imageUrl}" alt="Post Image">
              </div>
              <div class="post-text">${asset.text}</div>
              <div class="post-actions">
                  <button class="like-button" data-id="${post.id}">Like (${post?.likes?.count || 0})</button>
                  <button class="share-button" data-id="${post.id}">Share</button>
                  <button class="comment-button" data-id="${post.id}">Comment</button>
              </div>
              <div class="comments-section">
                  <div class="comments" data-id="${post.id}"></div>
                  <input type="text" class="comment-input" placeholder="Add a comment..." data-id="${asset.id}">
              </div>
          `;

    // Attach event listeners for the buttons
    postElement
      .querySelector(".like-button")
      .addEventListener("click",
        handleLikeButtonClick
      );
    postElement
      .querySelector(".share-button")
      .addEventListener("click", 
        handleShare);
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

function handleLikeButtonClick(event) {
  const button = event.target;
  const postId = button.getAttribute('data-id');

  // Send POST request to the like endpoint
   performLike(postId)
  .then(data => {
    console.log('Like response:', data);
    // Update the like count in the button text
    button.textContent = `Like (${data.count})`;
  })
  .catch(error => {
    console.error('Error liking post:', error);
  });
}

function handleShare(event) {
  const button = event.target;
  const postId = button.getAttribute('data-id');

  performShare(postId)
  .then(data => {
    console.log('Share response:', data);
  })
  .catch(error => {
    console.error('Error sharing post:', error);
  });
}

function handleComment(postId, commentText) {
    performComment({ postId, text: commentText })
    .then(data => {
      console.log('Comment response:', data);
      // Fetch the updated comments and display them
      fetchPosts().then((posts) => fetchAndValidatePostsToDisplay(posts));
    })
    .catch(error => {
      console.error('Error commenting on post:', error);
    });
}

function webSocketConnectionInit(){
  const userDetails=fetchUserDetailsFrmToken();
  const userId=userDetails?.id;
  connectToWebSocket(userId);
}
function connectToWebSocket(userId){
  if(userId == null){
    console.error("User id not found");
    return;
  }
  const socket = new WebSocket("ws://localhost:3000");
  socket.onopen = function () {
    console.log("WebSocket connection established");
    const registrationMessage = {
      type: 'register',
      userId: userId
    };
    socket.send(JSON.stringify(registrationMessage));
  };
  socket.onmessage = function (event) {
    console.log("Message received:", event.data);
    const data = JSON.parse(event.data);
    console.log("Message parsed:", data);
    alert(data.message);
  }

  socket.onclose = function () {
    console.log("WebSocket connection closed");
  };
  socket.onerror = function (error) {
    console.error("WebSocket error:", error);
  };
}

function integrateSearchFunctionality() {
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");

  const debouncedSearch = debounce(async () => {
    const query = searchInput.value.trim();
    if (query.length > 0) {
      const results = await fetchSearchResults(query);

      if (results.status == "success") {
        displaySearchResults(results.data, searchResults, searchInput);
      }
    } else {
      searchResults.style.display = "none";
    }
  }, 300); // Adjust the delay as needed (300ms in this example)

  searchInput.addEventListener("input", debouncedSearch);
}

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

function displaySearchResults(results, searchResults, searchInput) {
  searchResults.innerHTML = "";
  if (results.length > 0) {
    results.forEach((result) => {
      const userResult = result._source;
      console.log("search result", result);
      const item = document.createElement("div");
      item.classList.add("result-item");
      item.textContent = userResult.name; // Adjust based on your API response structure
      item.addEventListener("click", () => {
        //searchInput.value = userResult.name; // Adjust based on your API response structure
        // searchResults.style.display = 'none';
        window.location.href = `/userProfile.html?username=${userResult.username}`;
      });
      searchResults.appendChild(item);
    });
    searchResults.style.display = "block";
  } else {
    searchResults.style.display = "none";
  }
}
