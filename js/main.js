// NewsGrid - Basic JavaScript Functionality

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  
  // 1. Smooth Scrolling for navigation links
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href !== '#!') {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // 2. Back to Top Button
  createBackToTopButton();

  // 3. Mobile Menu Toggle
  createMobileMenu();

  // 4. Newsletter Form Validation
  setupNewsletterValidation();

  // 5. Update Copyright Year
  updateCopyrightYear();

  // 6. Add fade-in animation for articles
  addArticleAnimations();

  // 7. Search functionality
  addSearchFeature();
});

// Function to create and handle back to top button
function createBackToTopButton() {
  const backToTopBtn = document.createElement('button');
  backToTopBtn.id = 'backToTop';
  backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  backToTopBtn.title = 'Back to Top';
  document.body.appendChild(backToTopBtn);

  // Show/hide button based on scroll position
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  // Scroll to top on click
  backToTopBtn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Function to create mobile menu toggle
function createMobileMenu() {
  const nav = document.querySelector('#main-nav');
  if (!nav) return;

  const menuToggle = document.createElement('button');
  menuToggle.id = 'mobile-menu-toggle';
  menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
  menuToggle.setAttribute('aria-label', 'Toggle menu');
  
  const container = nav.querySelector('.container');
  if (container) {
    container.insertBefore(menuToggle, container.firstChild);
  }

  const navList = nav.querySelector('ul');
  
  menuToggle.addEventListener('click', function() {
    navList.classList.toggle('show');
    this.classList.toggle('active');
    
    // Change icon
    const icon = this.querySelector('i');
    if (this.classList.contains('active')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
    } else {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  });

  // Close menu when clicking a link
  const menuLinks = navList.querySelectorAll('a');
  menuLinks.forEach(link => {
    link.addEventListener('click', function() {
      navList.classList.remove('show');
      menuToggle.classList.remove('active');
      const icon = menuToggle.querySelector('i');
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    });
  });
}

// Newsletter form validation
function setupNewsletterValidation() {
  const forms = document.querySelectorAll('form[name="contact"]');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      const emailInput = this.querySelector('input[type="email"]');
      const email = emailInput.value.trim();
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (!email) {
        e.preventDefault();
        showMessage(emailInput, 'Please enter your email', 'error');
        return false;
      }
      
      if (!emailRegex.test(email)) {
        e.preventDefault();
        showMessage(emailInput, 'Please enter a valid email', 'error');
        return false;
      }
      
      showMessage(emailInput, 'Thank you for subscribing!', 'success');
    });
  });
}

// Helper function to show validation messages
function showMessage(input, message, type) {
  // Remove existing message if any
  const existingMsg = input.parentElement.querySelector('.form-message');
  if (existingMsg) {
    existingMsg.remove();
  }

  const messageDiv = document.createElement('div');
  messageDiv.className = `form-message ${type}`;
  messageDiv.textContent = message;
  input.parentElement.appendChild(messageDiv);

  // Remove message after 3 seconds
  setTimeout(() => {
    messageDiv.remove();
  }, 3000);
}

// Update copyright year dynamically
function updateCopyrightYear() {
  const copyrightElements = document.querySelectorAll('#main-footer p');
  const currentYear = new Date().getFullYear();
  
  copyrightElements.forEach(element => {
    const text = element.textContent;
    if (text.includes('Copyright')) {
      element.textContent = text.replace(/\d{4}/, currentYear);
    }
  });
}

// Add fade-in animations for articles
function addArticleAnimations() {
  const articles = document.querySelectorAll('.card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  articles.forEach(article => {
    observer.observe(article);
  });
}

// Add simple search feature
function addSearchFeature() {
  const nav = document.querySelector('#main-nav');
  if (!nav) return;

  const searchContainer = document.createElement('div');
  searchContainer.className = 'search-container';
  searchContainer.innerHTML = `
    <input type="text" id="search-input" placeholder="Search articles...">
    <button id="search-btn"><i class="fas fa-search"></i></button>
  `;

  const navList = nav.querySelector('ul');
  if (navList && navList.parentElement) {
    navList.parentElement.insertBefore(searchContainer, navList);
  }

  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');

  function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (!searchTerm) return;

    const articles = document.querySelectorAll('.card h3 a, .card p');
    let found = false;
    let firstMatch = null;

    articles.forEach(element => {
      const text = element.textContent.toLowerCase();
      if (text.includes(searchTerm)) {
        element.closest('.card').style.border = '2px solid #ffbc00';
        
        // Track first match for scrolling
        if (!firstMatch) {
          firstMatch = element.closest('.card');
        }
        found = true;
      } else {
        const card = element.closest('.card');
        if (card.style.border) {
          card.style.border = '';
        }
      }
    });

    if (found && firstMatch) {
      firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (!found) {
      alert('No articles found matching your search.');
    }
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', performSearch);
  }

  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
  }
}
