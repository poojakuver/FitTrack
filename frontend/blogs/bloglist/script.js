// Fetch Blogs API and Render
const API_URL = "http://localhost:3000/user/blogs";

// Utility functions
function formatDate(dateString) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateString));
}

function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readingTime} min${readingTime === 1 ? '' : 's'} read`;
}

function truncateContent(content, wordLimit = 30) {
  return content.split(' ').slice(0, wordLimit).join(' ') + '...';
}

// Blog Card Component
class BlogCard {
  constructor(blog, index) {
    this.blog = blog;
    this.index = index;
  }

  render() {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.animationDelay = `${this.index * 0.1}s`;

    card.innerHTML = this.template();
    this.attachEventListeners(card);

    return card;
  }

  template() {
    const { title, content, createdAt } = this.blog;
    const formattedDate = formatDate(createdAt);
    const readingTime = calculateReadingTime(content);

    return `
      <div>
        <h2 class="card-title">${title}</h2>
        <div class="card-content">${truncateContent(content)}</div>
      </div>
      <div class="card-meta">
        <span class="meta-item" title="Published date">📅 ${formattedDate}</span>
        <span class="meta-item" title="Reading time">⏱️ ${readingTime}</span>
      </div>
    `;
  }

  attachEventListeners(card) {
    card.addEventListener('click', () => {
      const blogId = this.blog._id;
      window.location.href = `../blog/index.html?blogId=${blogId}`;
    });
  }
}

// App initialization
class App {
  constructor() {
    this.blogList = document.getElementById('blogList');
  }

  async init() {
    try {
      const result = await this.fetchBlogs();
      const blogs = result.blogs;
      this.renderBlogs(blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  }

  async fetchBlogs() {
    const token = localStorage.getItem('user');
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch blogs');
    }

    return response.json();
  }

  renderBlogs(blogs) {
    blogs.forEach((blog, index) => {
      const blogCard = new BlogCard(blog, index);
      this.blogList.appendChild(blogCard.render());
    });
  }
}

// Start the application
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});

// Handle back button click
document.getElementById('backButton').addEventListener('click', () => {
  window.location.href = "../../dashboard/index.html";
});
