export const scrollToContact = () => {
  // Navigate to home page with hash
  if (window.location.pathname !== '/') {
    window.location.href = '/#contact';
  } else {
    // If already on home page, scroll to contact section
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    // Update URL without page reload
    window.history.pushState({}, '', '/#contact');
  }
};
