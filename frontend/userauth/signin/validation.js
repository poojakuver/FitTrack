const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    return password.length >= 8;
};

const showError = (inputElement, errorMessage) => {
    inputElement.classList.add('error');
    const errorElement = document.querySelector(`[data-error="${inputElement.name}"]`);
    if (errorElement) {
        errorElement.textContent = errorMessage;
    }
};

const clearError = (inputElement) => {
    inputElement.classList.remove('error');
    const errorElement = document.querySelector(`[data-error="${inputElement.name}"]`);
    if (errorElement) {
        errorElement.textContent = '';
    }
};