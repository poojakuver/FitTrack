const adminSignin = document.getElementById('admin-sign-up');
const userSignin = document.getElementById('user-sign-in');
const userSignup = document.getElementById('user-sign-up');

adminSignin.addEventListener('click', () => {
    window.location.href = "./admin/signin/index.html";
});

userSignin.addEventListener('click', () => {
    window.location.href = "./userauth/signin/index.html";
});

userSignup.addEventListener('click', () => {
    window.location.href = "./userauth/signup/index.html";
});