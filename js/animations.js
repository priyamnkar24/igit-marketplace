document.addEventListener('DOMContentLoaded', () => {
  // Bottom navbar animation for applicable pages
  const navbar = document.querySelector('.bottom-navbar');
  if (navbar) {
    gsap.from(navbar, {
      y: 100,
      duration: 1,
      ease: 'power2.out',
      onComplete: () => navbar.style.opacity = '1' // Ensure visibility after animation
    });
    gsap.from('.bottom-navbar li', {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      delay: 0.5,
    });
  }

  

  // Landing page content animation
  if (document.querySelector('.landing')) {
    gsap.from('.content', { opacity: 0, y: 50, duration: 1, delay: 0.5, ease: 'power2.out' });
  }

  // Circle animations
  const circles = document.querySelectorAll('.circle');
  circles.forEach((circle, index) => {
    gsap.to(circle, {
      y: '-=20',
      duration: 5 + index,
      yoyo: true,
      repeat: -1,
      ease: 'power1.inOut',
    });
  });

  // Typing animation
  const typedText = document.getElementById('typed-text');
  const cursor = document.getElementById('cursor');
  if (typedText && cursor) {
    const phrases = ['Buy', 'Sell', 'Hire', 'Connect'];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      if (!isDeleting && charIndex <= phrases[phraseIndex].length) {
        typedText.textContent = phrases[phraseIndex].slice(0, charIndex);
        charIndex++;
        gsap.to(cursor, { opacity: 0, duration: 0.5, repeat: -1, yoyo: true });
      }
      if (isDeleting && charIndex >= 0) {
        typedText.textContent = phrases[phraseIndex].slice(0, charIndex);
        charIndex--;
        gsap.to(cursor, { opacity: 0, duration: 0.5, repeat: -1, yoyo: true });
      }
      if (charIndex === phrases[phraseIndex].length + 1) {
        isDeleting = true;
        gsap.to(cursor, { opacity: 0, duration: 0.5, repeat: -1, yoyo: true });
      }
      if (charIndex === 0 && isDeleting) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
      const speed = isDeleting ? 50 : 150;
      gsap.delayedCall(speed / 1000, type);
    }
    type();
  }

  // Button hover animation
  const buttons = document.querySelectorAll('button, .continue-btn');
  buttons.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      gsap.to(btn, { scale: 1.1, duration: 0.3 });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { scale: 1, duration: 0.3 });
    });
  });

  // Card hover animation
  const cards = document.querySelectorAll('.listing-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { y: -10, duration: 0.3 });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { y: 0, duration: 0.3 });
    });
  });

  // Modal animation
  const modal = document.getElementById('item-modal');
  if (modal) {
    modal.addEventListener('transitionend', () => {
      if (modal.style.display === 'block') {
        gsap.from('.modal-content', { scale: 0.8, opacity: 0, duration: 0.5, ease: 'back.out(1.7)' });
      }
    });
  }
});