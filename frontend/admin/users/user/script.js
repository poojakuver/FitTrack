// DOM Elements
const userNameElement = document.getElementById('userName');
const userEmailElement = document.getElementById('userEmail');
const activityTitleElement = document.getElementById('activityTitle');
const levelTagElement = document.getElementById('levelTag');
const goalTagElement = document.getElementById('goalTag');
const typeTagElement = document.getElementById('typeTag');
const workoutList = document.getElementById('workoutList');
const dietList = document.getElementById('dietList');
const backBtn = document.getElementById('backButton');
const deleteBtn = document.getElementById('deleteButton');

const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('id');

// Fetch user data from backend
async function fetchUserData() {
    const token = localStorage.getItem('user'); // Retrieve token from localStorage
    if (!token) {
        console.error('Token not found in localStorage');
        return;
    }

    if (!userId) {
        console.error('User ID not found in URL');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/admin/user/${userId}`, {
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
        displayUserData(data.user);
    } catch (error) {
        console.error('Failed to fetch user data:', error);
    }
}

// Display user data on the page
function displayUserData(user) {
    const activity = user.currentActivity;

    // Set user information
    userNameElement.textContent = user.name;
    userEmailElement.textContent = user.email;

    // Set activity information
    activityTitleElement.textContent = activity.title;
    levelTagElement.textContent = activity.level;
    goalTagElement.textContent = activity.goal;
    typeTagElement.textContent = activity.type;

    // Calculate total calories
    const totalWorkoutCalories = activity.workout.reduce((acc, curr) => acc + curr.caloriesBurned, 0);
    const totalDietCalories = activity.diet.reduce((acc, curr) => acc + curr.calories, 0);

    // Render workout list
    workoutList.innerHTML = '';
    activity.workout.forEach(workout => {
        const workoutElement = document.createElement('div');
        workoutElement.className = 'workout-item';
        workoutElement.innerHTML = `
            <div class="workout-details">
                <span class="workout-name">${workout.name}</span>
                <span class="workout-meta">${workout.sets} sets × ${workout.reps} reps</span>
            </div>
            <span class="calories">${workout.caloriesBurned} cal</span>
        `;
        workoutList.appendChild(workoutElement);
    });

    // Render diet list
    dietList.innerHTML = '';
    activity.diet.forEach(meal => {
        const dietElement = document.createElement('div');
        dietElement.className = 'diet-item';
        dietElement.innerHTML = `
            <div class="diet-details">
                <span class="diet-type">${meal.type}</span>
                <span class="diet-meta">${meal.description}</span>
            </div>
            <span class="calories">${meal.calories} cal</span>
        `;
        dietList.appendChild(dietElement);
    });
}

backBtn.addEventListener('click', () => {
    window.location.href = "../userlist/index.html";
});

deleteBtn.addEventListener('click', async () => {
    try {
        const userToken = localStorage.getItem('user'); // Retrieve user token from localStorage

        if (!userToken) {
            alert('User token is missing. Please log in again.');
            return;
        }

        const response = await fetch(`http://localhost:3000/admin/user/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userToken}`, // Add token to Authorization header
            },
        });

        if (response.ok) {
            alert('User deleted successfully!');
            window.location.href = "../userlist/index.html"; // Redirect to blog list page
        } else {
            const errorData = await response.json();
            console.error('Failed to delete user:', errorData);
            alert(`Error: ${errorData.message || 'Failed to delete the user.'}`);
        }
    } catch (error) {
        console.error('Error during user deletion:', error);
        alert('An error occurred. Please try again.');
    }
});

// Initialize the app
document.addEventListener('DOMContentLoaded', fetchUserData);
