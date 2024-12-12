document.getElementById('signinForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Make the POST request
        const response = await fetch('http://localhost:3000/admin/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        // Handle the response
        if (!response.ok) {
            throw new Error(`Failed to sign in: ${response.statusText}`);
        }

        const result = await response.json();
        const token = result.token;

        localStorage.setItem("user", token)
        // Log success (optional for debugging)
        console.log('Sign-in successful:', result);

        // Redirect to admin dashboard
        window.location.href = '../dashboard/index.html';
    } catch (error) {
        console.error('Error during sign-in:', error);
        alert('Sign-in failed. Please check your credentials and try again.');
    } finally {
        // Clear form
        this.reset();
    }
});
