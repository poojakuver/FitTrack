// Get the query parameter from the URL
const urlParams = new URLSearchParams(window.location.search);
const blogId = urlParams.get('blogId');

// Function to format content into paragraphs
function formatContent(content) {
  return content.split('\n').map(paragraph => {
    const p = document.createElement('p');
    p.textContent = paragraph;
    return p.outerHTML;
  }).join('');
}

// Function to fetch blog data from the backend
async function fetchBlogData(blogId) {
  try {
    // Retrieve token from localStorage
    const token = localStorage.getItem('user');
    if (!token) {
      console.error('No token found in localStorage.');
      return;
    }

    // Define the API URL
    const apiUrl = `http://localhost:3000/admin/blog/${blogId}`;

    // Make the GET request with the Authorization header
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`Failed to fetch blog data: ${response.statusText}`);
    }

    // Parse the JSON response
    const result = await response.json();
    const blogData = result.blog;
    console.log(blogData);

    // Populate the blog content
    document.getElementById('blogTitle').textContent = blogData.title;
    document.getElementById('blogDate').textContent = `Posted on ${blogData.createdAt}`;
    document.getElementById('blogContent').innerHTML = formatContent(blogData.content);
  } catch (error) {
    console.error('Error fetching blog data:', error);
    document.getElementById('blogContent').textContent = 'Error loading blog content. Please try again later.';
  }
}

// Handle back button click
document.getElementById('backButton').addEventListener('click', () => {
  window.location.href = "../bloglist/index.html";
});

document.getElementById('deleteButton').addEventListener('click', async () => {
    try {
        const userToken = localStorage.getItem('user'); // Retrieve user token from localStorage

        if (!userToken) {
            alert('User token is missing. Please log in again.');
            return;
        }

        const response = await fetch(`http://localhost:3000/admin/blog/${blogId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userToken}`, // Add token to Authorization header
            },
        });

        if (response.ok) {
            alert('Blog deleted successfully!');
            window.location.href = "../bloglist/index.html"; // Redirect to blog list page
        } else {
            const errorData = await response.json();
            console.error('Failed to delete blog:', errorData);
            alert(`Error: ${errorData.message || 'Failed to delete the blog.'}`);
        }
    } catch (error) {
        console.error('Error during blog deletion:', error);
        alert('An error occurred. Please try again.');
    }
});


// Fetch the blog details if blogId is available
if (blogId) {
  fetchBlogData(blogId);
} else {
  console.error('No Blog ID found in the URL.');
  document.getElementById('blogContent').textContent = 'Invalid blog ID. Please check the URL.';
}
