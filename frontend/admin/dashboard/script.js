const logoutBtn = document.getElementById("logoutBtn");
const addWorkoutBtn = document.getElementById("addWorkoutBtn");
const viewWorkoutBtn = document.getElementById("viewWorkoutBtn");
const addBlogBtn = document.getElementById("addBlogBtn");
const viewBlogBtn = document.getElementById("viewBlogBtn");

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('user');
    window.location.href = '../signin/index.html';
});

addWorkoutBtn.addEventListener('click', () => {
    window.location.href = '../workout/addworkout/index.html';
});

viewWorkoutBtn.addEventListener('click', () => {
    window.location.href = '../workout/viewworkout/index.html';
});

addBlogBtn.addEventListener('click', () => {
    window.location.href = '../blogs/addblogs/index.html'
});

viewBlogBtn.addEventListener('click', () => {
    window.location.href = '../blogs/viewblogs/bloglist/index.html'
})
