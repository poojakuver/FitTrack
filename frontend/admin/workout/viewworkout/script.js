async function fetchWorkoutPlans() {
    try {
      const token = localStorage.getItem('user');
      if (!token) {
        throw new Error('User is not logged in.');
      }
  
      const response = await fetch('http://localhost:3000/admin/workouts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch workouts: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching workout plans:', error);
      return [];
    }
  }
  
  function createPlanCard(plan) {
    const card = document.createElement('div');
    card.className = 'plan-card';
  
    card.innerHTML = `
      <div class="plan-header">
        <h2 class="plan-title">${plan.title}</h2>
        <div class="plan-meta">
          <span class="tag">${plan.level}</span>
          <span class="tag">${plan.goal}</span>
          <span class="tag">${plan.type}</span>
        </div>
      </div>
      
      <div class="workout-section">
        <h3 class="section-title">Workout Plan</h3>
        <ul class="workout-list">
          ${plan.workout
            .map(
              (exercise) => `
            <li class="workout-item">
              ${exercise.name} - ${exercise.sets} sets × ${exercise.reps} reps
              <div class="calories">${exercise.caloriesBurned} calories</div>
            </li>`
            )
            .join('')}
        </ul>
      </div>
  
      <div class="diet-section">
        <h3 class="section-title">Diet Plan</h3>
        <ul class="diet-list">
          ${plan.diet
            .map(
              (meal) => `
            <li class="diet-item">
              <strong>${meal.type}:</strong> ${meal.description}
              <div class="calories">${meal.calories} calories</div>
            </li>`
            )
            .join('')}
        </ul>
      </div>
    `;
  
    return card;
  }
  
  async function initializePage() {
    const container = document.getElementById('plans-container');
    const result = await fetchWorkoutPlans();
  
    if (result.length === 0) {
      container.innerHTML = '<p>No workout plans available.</p>';
      return;
    }
  
    const plans = result.plans;
    plans.forEach((plan) => {
      container.appendChild(createPlanCard(plan));
    });
  }
  
  // Handle back button click
    document.getElementById('backButton').addEventListener('click', () => {
        window.location.href = "../../dashboard/index.html";
    });

  document.addEventListener('DOMContentLoaded', initializePage);