async function handleSubmit(event) {
    event.preventDefault();
    
    const formData = {
        title: document.getElementById('title').value.trim(),
        content: document.getElementById('content').value.trim()
    };

    // Log the form data to console
    console.log('Blog Post Data:', formData);
    
    // Get user token from localStorage
    const userToken = localStorage.getItem('user');

    if (!userToken) {
        alert('User token is missing. Please log in again.');
        return;
    }
    try {
        // Make POST request to create a new blog post
        const response = await fetch('http://localhost:3000/admin/blog', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}` // Include token in Authorization header
            },
            body: JSON.stringify(formData) // Send the form data as JSON
        })
        
        if (response.ok) {
            // Blog post created successfully
            alert('Blog post created successfully!');
            window.location.href = "../viewblogs/bloglist/index.html"; // Redirect to blog list page
        } else {
            // Handle error in blog post creation
            alert(`Error: ${data.message || 'Failed to create blog post.'}`);
        }
    }catch(error) {
        console.error('Error during blog creation:', error);
        alert('An error occurred while creating the blog post. Please try again.');
    }
}

// Handle back button click
document.getElementById('backButton').addEventListener('click', () => {
    window.location.href = "../../dashboard/index.html";
});
