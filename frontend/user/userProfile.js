import { fetchUserProfile, followUser } from "./api.js";
document.addEventListener('DOMContentLoaded', async () => {
    console.log("location search",window.location.search);
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    let userId = null;
    if (username) {
        try {
            const userProfileResponse = await fetchUserProfile(username);
            if (userProfileResponse!= null && userProfileResponse.status == "success") {
                console.log("userProfileResponse",userProfileResponse.data);
                displayUserProfile(userProfileResponse.data);
            } else {
                console.error('Error fetching user profile:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    } else {
        console.error('No user ID provided in the URL');
    }

    const followButton = document.getElementById('follow-button');
    followButton.addEventListener('click', async () => {
        userId = document.getElementById('userId').value;
        if (userId) {
            try { 
                const followResponse = await followUser(userId);
                if (followResponse!= null && followResponse.status == "success") {
                    alert(`${followResponse.message}${userId}`);
                    followButton.classList.add('followed');
                    followButton.classList.remove('initialFollow');
                    followButton.disabled = true;
                } else {
                    console.error('Error following user:', response.statusText);
                }
            } catch (error) {
                console.error('Error following user:', error);
            }
        } else {
            console.error('No user ID provided');
        }
    });
});

function displayUserProfile(userProfileData) {
    const userProfile = userProfileData.user;
    document.getElementById('user-name').textContent = userProfile.name;
    document.getElementById('user-email').textContent = userProfile.email;
    document.getElementById('user-bio').textContent = userProfile.bio;
    document.getElementById('userId').value = userProfile.id;
}