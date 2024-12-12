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
    const apiUrl = `http://localhost:3000/user/blog/${blogId}`;

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

// Fetch the blog details if blogId is available
if (blogId) {
  fetchBlogData(blogId);
} else {
  console.error('No Blog ID found in the URL.');
  document.getElementById('blogContent').textContent = 'Invalid blog ID. Please check the URL.';
}
