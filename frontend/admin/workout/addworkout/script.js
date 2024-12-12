function addWorkout() {
    const container = document.getElementById('workoutContainer');
    const workoutEntry = document.createElement('div');
    workoutEntry.className = 'workout-entry';
    workoutEntry.innerHTML = `
        <input type="text" placeholder="Exercise name" class="workout-name" required>
        <input type="number" placeholder="Sets" class="workout-sets" required>
        <input type="number" placeholder="Reps" class="workout-reps" required>
        <input type="number" placeholder="Calories" class="workout-calories" required>
        <button type="button" class="remove-btn" onclick="removeWorkout(this)">×</button>
    `;
    container.appendChild(workoutEntry);
}

function addDiet() {
    const container = document.getElementById('dietContainer');
    const dietEntry = document.createElement('div');
    dietEntry.className = 'diet-entry';
    dietEntry.innerHTML = `
        <select class="diet-type" required>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Snack">Snack</option>
            <option value="Dinner">Dinner</option>
        </select>
        <input type="text" placeholder="Description" class="diet-description" required>
        <input type="number" placeholder="Calories" class="diet-calories" required>
        <button type="button" class="remove-btn" onclick="removeDiet(this)">×</button>
    `;
    container.appendChild(dietEntry);
}

function removeWorkout(button) {
    button.parentElement.remove();
}

function removeDiet(button) {
    button.parentElement.remove();
}

function collectFormData() {
    const formData = {
        title: document.getElementById('title').value,
        level: document.getElementById('level').value,
        goal: document.getElementById('goal').value,
        type: document.getElementById('type').value,
        workout: [],
        diet: []
    };

    // Collect workout data
    document.querySelectorAll('.workout-entry').forEach(entry => {
        formData.workout.push({
            name: entry.querySelector('.workout-name').value,
            sets: parseInt(entry.querySelector('.workout-sets').value),
            reps: parseInt(entry.querySelector('.workout-reps').value),
            caloriesBurned: parseInt(entry.querySelector('.workout-calories').value)
        });
    });

    // Collect diet data
    document.querySelectorAll('.diet-entry').forEach(entry => {
        formData.diet.push({
            type: entry.querySelector('.diet-type').value,
            description: entry.querySelector('.diet-description').value,
            calories: parseInt(entry.querySelector('.diet-calories').value)
        });
    });

    return formData;
}

document.getElementById('workoutForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = collectFormData();
    const userToken = localStorage.getItem('user');

    if (!userToken) {
        alert('User token not found. Please log in.');
        return;
    }

    try {
        // Make the POST request
        const response = await fetch('http://localhost:3000/admin/addworkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}` // Add the token to the Authorization header
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`Failed to submit form: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Form submission successful:', result);

        // Redirect to the workout page
        window.location.href = '../viewworkout/index.html';
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Error submitting form. Please try again.');
    }
});
