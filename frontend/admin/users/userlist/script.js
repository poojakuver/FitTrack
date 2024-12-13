// DOM Elements
const usersContainer = document.getElementById('usersContainer');
const modal = document.getElementById('modal');
const closeButton = document.querySelector('.close-button');
const backBtn = document.getElementById('backButton');

// Fetch users from backend and display user cards
async function fetchAndDisplayUsers() {
    const token = localStorage.getItem('user'); // Retrieve token from localStorage
    if (!token) {
        console.error('Token not found in localStorage');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/admin/users', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        displayUserCards(data.users);
    } catch (error) {
        console.error('Failed to fetch user data:', error);
    }
}

// Create and display user cards
function displayUserCards(users) {
    users.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        userCard.innerHTML = `
            <h3 class="user-name">${user.name}</h3>
            <p class="user-email">${user.email}</p>
        `;

        // Redirect to user page with user ID
        userCard.addEventListener('click', () => {
            window.location.href = `../user/index.html?id=${user._id}`;
        });

        usersContainer.appendChild(userCard);
    });
}

// Event listeners
closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

backBtn.addEventListener('click', () => {
    window.location.href = "../../dashboard/index.html";
});

// Initialize the app
document.addEventListener('DOMContentLoaded', fetchAndDisplayUsers);
