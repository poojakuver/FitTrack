// Initialize dashboard data
let dashboardData = { currentActivity: { workout: [], diet: [] } };
let workoutIds = [];
let dietIds = [];

// DOM Elements
const workoutList = document.getElementById('workoutList');
const dietList = document.getElementById('dietList');
const workoutTitle = document.getElementById('workoutTitle');
const totalWorkoutCalories = document.getElementById('totalWorkoutCalories');
const totalDietCalories = document.getElementById('totalDietCalories');
const saveButton = document.getElementById('saveButton');
const logoutBtn = document.getElementById('logoutBtn');

// Nav bar buttons
const newWorkout = document.getElementById("newWorkoutBtn");
const allBlogs = document.getElementById("allblogsBtn");

// Fetch dashboard data
async function fetchDashboardData() {
    try {
        const token = localStorage.getItem('user');
        const response = await fetch('http://localhost:3000/user/current-activity', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch dashboard data');
        }

        const data = await response.json();
        dashboardData = data;
        initializeDashboard();
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
    }
}

// Initialize dashboard
function initializeDashboard() {
    workoutTitle.textContent = dashboardData.currentActivity.currentActivity.title;
    workoutIds = dashboardData.currentActivity.currentActivity.workout
        .filter(w => w.done)
        .map(w => w._id);
    dietIds = dashboardData.currentActivity.currentActivity.diet
        .filter(d => d.done)
        .map(d => d._id);
    renderWorkouts();
    renderDiet();
    updateCalories();
}

// Render workout items
function renderWorkouts() {
    workoutList.innerHTML = dashboardData.currentActivity.currentActivity.workout.map(workout => `
        <div class="activity-item ${workout.done ? 'completed' : ''}">
            <div class="activity-info">
                <h4>${workout.name}</h4>
                <p>Sets: ${workout.sets} | Reps: ${workout.reps} | Calories: ${workout.caloriesBurned}</p>
            </div>
            <div class="checkbox-wrapper">
                <input type="checkbox" 
                       id="workout-${workout._id}" 
                       ${workout.done ? 'checked' : ''}
                       onchange="handleWorkoutToggle('${workout._id}')">
            </div>
        </div>
    `).join('');
}

// Render diet items
function renderDiet() {
    dietList.innerHTML = dashboardData.currentActivity.currentActivity.diet.map(diet => `
        <div class="activity-item ${diet.done ? 'completed' : ''}">
            <div class="activity-info">
                <h4>${diet.type}</h4>
                <p>${diet.description} | Calories: ${diet.calories}</p>
            </div>
            <div class="checkbox-wrapper">
                <input type="checkbox" 
                       id="diet-${diet._id}" 
                       ${diet.done ? 'checked' : ''}
                       onchange="handleDietToggle('${diet._id}')">
            </div>
        </div>
    `).join('');
}

// Update total calories
function updateCalories() {
    const workoutCalories = dashboardData.currentActivity.currentActivity.workout
        .reduce((total, item) => total + (item.done ? item.caloriesBurned : 0), 0);
    const dietCalories = dashboardData.currentActivity.currentActivity.diet
        .reduce((total, item) => total + (item.done ? item.calories : 0), 0);

    totalWorkoutCalories.textContent = workoutCalories;
    totalDietCalories.textContent = dietCalories;
}

// Handle workout checkbox toggle
window.handleWorkoutToggle = (id) => {
    const workout = dashboardData.currentActivity.currentActivity.workout.find(w => w._id === id);
    workout.done = !workout.done;

    // Update the IDs array with the `done` state
    const index = workoutIds.findIndex(item => item.id === id);
    if (index >= 0) {
        workoutIds.splice(index, 1); // Remove if it exists
    }
    workoutIds.push({ id, done: workout.done });

    renderWorkouts();
    updateCalories();
};

// Handle diet checkbox toggle
window.handleDietToggle = (id) => {
    const diet = dashboardData.currentActivity.currentActivity.diet.find(d => d._id === id);
    diet.done = !diet.done;

    // Update the IDs array with the `done` state
    const index = dietIds.findIndex(item => item.id === id);
    if (index >= 0) {
        dietIds.splice(index, 1); // Remove if it exists
    }
    dietIds.push({ id, done: diet.done });

    renderDiet();
    updateCalories();
};

// Save progress
saveButton.addEventListener('click', async () => {
    try {
        const token = localStorage.getItem('user');
        const response = await fetch('http://localhost:3000/user/update-status', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ 
                    workoutIds: workoutIds.map(w => ({ id: w.id, done: w.done })),
                    dietIds: dietIds.map(d => ({ id: d.id, done: d.done }))
                })
        });

        console.log(response);

        if (!response.ok) {
            throw new Error('Failed to save progress');
        }

        alert('Progress saved successfully!');
    } catch (error) {
        console.error('Error saving progress:', error);
        alert('Failed to save progress.');
    }
});

// Handle logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('user');
    window.location.href = '../userauth/signin/index.html';
});

newWorkout.addEventListener("click", function () {
    window.location.href = "../workoutplans/index.html";
});

allBlogs.addEventListener("click", function () {
    window.location.href = "../blogs/bloglist/index.html";
});

// Fetch and initialize the dashboard
fetchDashboardData();
