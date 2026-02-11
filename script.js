// Typing effect for hero headline
const typedHeadline = ["Online Voting Made Easy & Secure", "Receipt-Free, Verifiable Voting", "Vote Anywhere, Anytime!"];
let thIndex = 0, thChar = 0;
function typeHero() {
  const el = document.getElementById("typed-headline");
  if (!el) return;
  if (thChar < typedHeadline[thIndex].length) {
    el.textContent += typedHeadline[thIndex][thChar++];
    setTimeout(typeHero, 60);
  } else {
    setTimeout(() => {
      el.textContent = "";
      thChar = 0;
      thIndex = (thIndex + 1) % typedHeadline.length;
      typeHero();
    }, 1800);
  }
}
typeHero();

// Animated counters for stats
function animateCounter(id, end, duration=1200) {
  const el = document.getElementById(id);
  if (!el) return;
  let start = 0, step = Math.ceil(end / (duration/30));
  function update() {
    start += step;
    if (start >= end) { el.textContent = end; return; }
    el.textContent = start;
    setTimeout(update, 30);
  }
  update();
}
animateCounter("votersCount", 10000);
animateCounter("votesCast", 8500);
animateCounter("turnout", 85);

// Chart.js for results
const ctx = document.getElementById('resultsChart').getContext('2d');
new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ['Candidate A', 'Candidate B', 'Candidate C'],
    datasets: [{ data: [4200, 3200, 1100], backgroundColor: ['#2051d8','#20bfa9','#ffe066'] }]
  },
  options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
});

// Ripple effect for buttons
function addRipple(e) {
  const btn = e.currentTarget;
  const circle = document.createElement('span');
  circle.className = 'ripple';
  circle.style.left = e.offsetX + 'px';
  circle.style.top = e.offsetY + 'px';
  btn.appendChild(circle);
  setTimeout(() => circle.remove(), 600);
}
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', addRipple);
});

// Hamburger menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});

// Dark mode toggle
const darkToggle = document.getElementById('darkModeToggle');
darkToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});
if(localStorage.getItem('darkMode') === 'true') document.body.classList.add('dark-mode');

// Form validation
const loginForm = document.getElementById('loginForm');
if(loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    loginForm.querySelectorAll('input').forEach(input => {
      if(!input.value) {
        input.style.borderColor = 'red';
        valid = false;
      } else {
        input.style.borderColor = '';
      }
    });
    if(valid) showToast('Login successful!');
    else showToast('Please fill all fields.');
  });
}
const contactForm = document.getElementById('contactForm');
if(contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    contactForm.querySelectorAll('input,textarea').forEach(input => {
      if(!input.value) {
        input.style.borderColor = 'red';
        valid = false;
      } else {
        input.style.borderColor = '';
      }
    });
    if(valid) showToast('Message sent!');
    else showToast('Please fill all fields.');
  });
}

// Toast notification
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

// Scroll reveal (fade/slide in)
const revealEls = document.querySelectorAll('.card, .stat-card, .timeline li');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting) entry.target.style.opacity = 1;
  });
},{ threshold: 0.2 });
revealEls.forEach(el => observer.observe(el));

// Confetti animation (on successful vote)
function confetti() {
  for(let i=0;i<30;i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = Math.random()*100+'vw';
    c.style.background = `hsl(${Math.random()*360},80%,60%)`;
    c.style.animationDuration = (Math.random()*1+1)+'s';
    document.body.appendChild(c);
    setTimeout(()=>c.remove(),2000);
  }
}
// Example: call confetti() after successful vote
// showToast('Vote recorded!'); confetti();

// Smooth scroll for nav links
const navs = document.querySelectorAll('.nav-links a');
navs.forEach(link => {
  link.addEventListener('click', function(e) {
    const href = link.getAttribute('href');
    if(href && href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
      navLinks.classList.remove('show');
    }
  });
});

// Spinner (show/hide)
function showSpinner() {
  document.getElementById('spinner').style.display = 'block';
}
function hideSpinner() {
  document.getElementById('spinner').style.display = 'none';
}

// Modal (login/register)
const modal = document.getElementById('modal');
function showModal(content) {
  modal.innerHTML = content;
  modal.classList.add('show');
}
function hideModal() {
  modal.classList.remove('show');
}
// Example: document.querySelector('.login-btn').onclick = () => showModal('<h2>Login/Register</h2>');

// Ripple effect CSS
const style = document.createElement('style');
style.innerHTML = `.ripple { position:absolute; border-radius:50%; background:rgba(32,191,169,0.3); transform:scale(0); animation:ripple 0.6s linear; pointer-events:none; width:60px; height:60px; left:0; top:0; }
@keyframes ripple { to { transform:scale(2); opacity:0; } }
.confetti { position:fixed; top:-20px; width:12px; height:12px; border-radius:50%; opacity:0.8; animation:confetti-fall linear forwards; }
@keyframes confetti-fall { to { top:100vh; opacity:0; } }`;
document.head.appendChild(style);
