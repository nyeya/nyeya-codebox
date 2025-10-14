"use client"

import type { FileNode } from "@/types/file-system"

export interface ProjectTemplate {
  id: string
  name: string
  description: string
  icon: string
  files: FileNode[]
}

export const templates: ProjectTemplate[] = [
  {
    id: "landing-page",
    name: "Landing Page",
    description: "Modern landing page with hero section",
    icon: "🚀",
    files: [
      {
        id: "1",
        name: "index.html",
        type: "file",
        path: "/index.html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Modern Landing Page</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <nav class="navbar">
    <div class="container">
      <div class="logo">MyBrand</div>
      <ul class="nav-links">
        <li><a href="#features">Features</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </div>
  </nav>

  <section class="hero">
    <div class="container">
      <h1>Build Something Amazing</h1>
      <p>Create beautiful websites with modern design and clean code</p>
      <button class="cta-button">Get Started</button>
    </div>
  </section>

  <section id="features" class="features">
    <div class="container">
      <h2>Features</h2>
      <div class="feature-grid">
        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <h3>Fast</h3>
          <p>Lightning fast performance</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🎨</div>
          <h3>Beautiful</h3>
          <p>Stunning modern design</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📱</div>
          <h3>Responsive</h3>
          <p>Works on all devices</p>
        </div>
      </div>
    </div>
  </section>

  <footer class="footer">
    <div class="container">
      <p>&copy; 2025 MyBrand. All rights reserved.</p>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>`,
      },
      {
        id: "2",
        name: "style.css",
        type: "file",
        path: "/style.css",
        content: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  color: #333;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Navbar */
.navbar {
  background: #fff;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #6366f1;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-links a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: #6366f1;
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 8rem 0;
  text-align: center;
}

.hero h1 {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.hero p {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.cta-button {
  background: white;
  color: #667eea;
  border: none;
  padding: 1rem 3rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

/* Features Section */
.features {
  padding: 6rem 0;
  background: #f8f9fa;
}

.features h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #333;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.feature-card p {
  color: #666;
}

/* Footer */
.footer {
  background: #333;
  color: white;
  text-align: center;
  padding: 2rem 0;
}

/* Responsive */
@media (max-width: 768px) {
  .hero h1 {
    font-size: 2.5rem;
  }
  
  .hero p {
    font-size: 1.2rem;
  }
  
  .nav-links {
    gap: 1rem;
  }
}`,
      },
      {
        id: "3",
        name: "script.js",
        type: "file",
        path: "/script.js",
        content: `// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// CTA button click handler
document.querySelector('.cta-button').addEventListener('click', () => {
  alert('Welcome! Start building your amazing project!');
  console.log('CTA button clicked');
});

// Add animation on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.feature-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'opacity 0.6s, transform 0.6s';
  observer.observe(card);
});

console.log('Landing page initialized!');`,
      },
    ],
  },
  {
    id: "portfolio",
    name: "Portfolio",
    description: "Personal portfolio website",
    icon: "💼",
    files: [
      {
        id: "1",
        name: "index.html",
        type: "file",
        path: "/index.html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Portfolio</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="header">
    <div class="container">
      <h1>John Doe</h1>
      <p class="subtitle">Web Developer & Designer</p>
    </div>
  </header>

  <section class="about">
    <div class="container">
      <h2>About Me</h2>
      <p>I'm a passionate web developer with expertise in creating beautiful and functional websites. I love turning ideas into reality through code.</p>
    </div>
  </section>

  <section class="projects">
    <div class="container">
      <h2>My Projects</h2>
      <div class="project-grid">
        <div class="project-card">
          <h3>Project One</h3>
          <p>A modern e-commerce platform</p>
          <button class="project-btn">View Details</button>
        </div>
        <div class="project-card">
          <h3>Project Two</h3>
          <p>Social media dashboard</p>
          <button class="project-btn">View Details</button>
        </div>
        <div class="project-card">
          <h3>Project Three</h3>
          <p>Portfolio website template</p>
          <button class="project-btn">View Details</button>
        </div>
      </div>
    </div>
  </section>

  <section class="contact">
    <div class="container">
      <h2>Get In Touch</h2>
      <form class="contact-form">
        <input type="text" placeholder="Your Name" required>
        <input type="email" placeholder="Your Email" required>
        <textarea placeholder="Your Message" rows="5" required></textarea>
        <button type="submit">Send Message</button>
      </form>
    </div>
  </section>

  <footer class="footer">
    <div class="container">
      <p>&copy; 2025 John Doe. All rights reserved.</p>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>`,
      },
      {
        id: "2",
        name: "style.css",
        type: "file",
        path: "/style.css",
        content: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background: #f5f5f5;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Header */
.header {
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  color: white;
  text-align: center;
  padding: 6rem 0;
}

.header h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.3rem;
  opacity: 0.9;
}

/* Sections */
section {
  padding: 4rem 0;
}

section h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #2c3e50;
}

/* About */
.about {
  background: white;
}

.about p {
  text-align: center;
  font-size: 1.2rem;
  max-width: 700px;
  margin: 0 auto;
  color: #666;
}

/* Projects */
.projects {
  background: #f5f5f5;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.project-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  text-align: center;
  transition: transform 0.3s;
}

.project-card:hover {
  transform: translateY(-5px);
}

.project-card h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.project-card p {
  color: #666;
  margin-bottom: 1.5rem;
}

.project-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
}

.project-btn:hover {
  background: #2980b9;
}

/* Contact */
.contact {
  background: white;
}

.contact-form {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-form input,
.contact-form textarea {
  padding: 1rem;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  font-family: inherit;
}

.contact-form input:focus,
.contact-form textarea:focus {
  outline: none;
  border-color: #3498db;
}

.contact-form button {
  background: #2c3e50;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 5px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.contact-form button:hover {
  background: #34495e;
}

/* Footer */
.footer {
  background: #2c3e50;
  color: white;
  text-align: center;
  padding: 2rem 0;
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 2rem;
  }
  
  section h2 {
    font-size: 2rem;
  }
}`,
      },
      {
        id: "3",
        name: "script.js",
        type: "file",
        path: "/script.js",
        content: `// Handle form submission
document.querySelector('.contact-form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const name = e.target.querySelector('input[type="text"]').value;
  const email = e.target.querySelector('input[type="email"]').value;
  const message = e.target.querySelector('textarea').value;
  
  console.log('Form submitted:', { name, email, message });
  alert('Thank you for your message! I will get back to you soon.');
  
  e.target.reset();
});

// Handle project button clicks
document.querySelectorAll('.project-btn').forEach((btn, index) => {
  btn.addEventListener('click', () => {
    console.log(\`Project \${index + 1} clicked\`);
    alert(\`Project \${index + 1} details would be shown here!\`);
  });
});

// Smooth scroll animation
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.project-card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });
  
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s, transform 0.6s';
    observer.observe(card);
  });
});

console.log('Portfolio initialized!');`,
      },
    ],
  },
  {
    id: "blank",
    name: "Blank Project",
    description: "Start from scratch",
    icon: "📄",
    files: [
      {
        id: "1",
        name: "index.html",
        type: "file",
        path: "/index.html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Project</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <h1>Hello World!</h1>
    <p>Start building your project here.</p>
  </div>
  <script src="script.js"></script>
</body>
</html>`,
      },
      {
        id: "2",
        name: "style.css",
        type: "file",
        path: "/style.css",
        content: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  color: #333;
  background: #f5f5f5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

p {
  font-size: 1.2rem;
  color: #666;
}`,
      },
      {
        id: "3",
        name: "script.js",
        type: "file",
        path: "/script.js",
        content: `// Your JavaScript code here
console.log('Project initialized!');

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded');
});`,
      },
    ],
  },
]

export function getTemplateById(id: string): ProjectTemplate | undefined {
  return templates.find((t) => t.id === id)
}
