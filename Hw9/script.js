/* ============================================================
   Lab 8 — Data-Driven Portfolio
   Project cards are now rendered from a JSON-backed array
   instead of hard-coded HTML. Supports add, remove, filter,
   and persistence through localStorage.
   ============================================================ */

// ---------- Escaping helper ----------
// Prevents raw/unescaped user input from being injected as HTML
// when we use insertAdjacentHTML (see "Before You Submit" checklist).
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ---------- Project Data & Persistence ----------
const STORAGE_KEY = 'portfolio-projects';

const defaultProjects = [
    { id: 1, title: "DNS Analysis", description: "Simulated and analyzed Domain Name System traffic logs to inspect query-response patterns.", category: "networking", image: "Lab1.jpg" },
    { id: 2, title: "Strawberry Cupid Layout", description: "A coquette-themed aesthetic e-commerce interface designed with strict visual hierarchy principles.", category: "design", image: "Lab1.jpg" },
    { id: 3, title: "Security Campaign", description: "Simulated social engineering assessment and corresponding defense framework presentation.", category: "security", image: "Lab1.jpg" },
    { id: 4, title: "Streamer Widgets", description: "Interactive dashboard components focused entirely on live audience engagement metrics.", category: "design", image: "Lab1.jpg" },
    { id: 5, title: "Economic CO₂ Trends", description: "Comparative analysis studying the correlation between GDP per capita and global emissions (2012–2022).", category: "networking", image: "Lab1.jpg" },
    { id: 6, title: "Rococo Room Model", description: "Stylized low-poly interior scenes created in Blender using intricate historical decorative motives.", category: "design", image: "Lab1.jpg" }
];

function loadProjects() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : defaultProjects;
    } catch (err) {
        // JSON.parse throws on invalid/corrupted data — fall back safely
        console.error('Could not parse saved projects, using defaults:', err);
        return defaultProjects;
    }
}

function saveProjects(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

let projects = loadProjects();
console.table(projects);
console.log("script.js loaded — theme toggle, character counter, project filter, and data-driven grid are wired up.");

// ---------- Theme Toggle ----------
const themeToggle = document.querySelector('#theme-toggle');
let isDark = false;

themeToggle.addEventListener('click', () => {
    isDark = !isDark;
    document.body.classList.toggle('dark-theme', isDark);
    themeToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
    updateFilterButtonTheme();
    console.log('Theme toggled:', isDark);
});

// ---------- Filtering ----------
const filterButtons = document.querySelectorAll('.filter-btn');
let currentFilter = 'all';

function updateFilterButtonTheme() {
    // Re-applies "active" styling to whichever filter button is
    // currently selected, respecting light/dark mode.
    const darkMode = document.body.classList.contains('dark-theme');
    filterButtons.forEach(b => {
        const isActive = b.getAttribute('data-filter') === currentFilter;
        b.classList.remove('btn-dark', 'btn-outline-dark', 'btn-light', 'btn-outline-light');
        if (darkMode) {
            b.classList.add(isActive ? 'btn-light' : 'btn-outline-light');
        } else {
            b.classList.add(isActive ? 'btn-dark' : 'btn-outline-dark');
        }
    });
}

function applyFilter(filterValue) {
    currentFilter = filterValue;
    document.querySelectorAll('.project-item').forEach(item => {
        const match = filterValue === 'all' || item.getAttribute('data-category') === filterValue;
        item.style.display = match ? 'block' : 'none';
    });
    updateFilterButtonTheme();
}

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const filterValue = btn.getAttribute('data-filter');
        console.log('Filtering by:', filterValue);
        applyFilter(filterValue);
    });
});

// ---------- Rendering Projects From Data ----------
const grid = document.querySelector('#projects-grid');

function renderProjects() {
    grid.innerHTML = ''; // clear before re-render

    projects.forEach(p => {
        const col = document.createElement('div');
        col.className = 'col project-item';
        col.setAttribute('data-category', p.category);

        const card = document.createElement('div');
        card.className = 'card h-100 border-0 shadow-sm';

        card.insertAdjacentHTML('beforeend', `
            <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}" class="card-img-top" style="height: 180px; object-fit: cover;">
            <div class="card-body d-flex flex-column">
                <div><span class="badge bg-secondary mb-2 text-uppercase">${escapeHtml(p.category)}</span></div>
                <h5 class="card-title text-dark fw-bold">${escapeHtml(p.title)}</h5>
                <p class="card-text text-muted small">${escapeHtml(p.description)}</p>
                <button type="button" class="btn btn-sm btn-outline-danger mt-auto remove-btn">Remove</button>
            </div>
        `);

        card.querySelector('.remove-btn').addEventListener('click', () => {
            projects = projects.filter(item => item.id !== p.id);
            saveProjects(projects);
            renderProjects();
            console.log('Removed project', p.id);
        });

        col.append(card);
        grid.append(col);
    });

    applyFilter(currentFilter);
    console.log('Rendered', projects.length, 'projects');
}

renderProjects();

// ---------- Add Project Form ----------
const addForm = document.querySelector('#add-project-form');
const titleInput = document.querySelector('#project-title');
const descInput = document.querySelector('#project-desc');
const categoryInput = document.querySelector('#project-category');

addForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!addForm.checkValidity()) {
        addForm.reportValidity();
        return;
    }

    const newProject = {
        id: Date.now(),
        title: titleInput.value.trim(),
        description: descInput.value.trim(),
        category: categoryInput.value,
        image: "Lab1.jpg"
    };

    projects.push(newProject);
    saveProjects(projects);
    renderProjects();
    addForm.reset();
    console.log('Added project:', newProject);
});

// ---------- Live "Last Updated" Timestamp ----------
// A single setInterval — never re-created — ticks once per second.
const lastUpdatedEl = document.querySelector('#last-updated');
setInterval(() => {
    lastUpdatedEl.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
}, 1000);

// ---------- Contact Form (unchanged from Lab 7) ----------
const messageInput = document.querySelector('#message');
const charCounter = document.querySelector('#char-counter');
const maxLength = 1000;

messageInput.addEventListener('input', () => {
    const len = messageInput.value.length;
    const remaining = maxLength - len;
    charCounter.textContent = `${remaining} characters left`;
    console.log('Char count:', len);
});

const form = document.querySelector('#contact-form');
const submitBtn = document.querySelector('#submit-btn');
const btnSpinner = document.querySelector('#btn-spinner');
const btnText = document.querySelector('#btn-text');

form.addEventListener('submit', e => {
    e.preventDefault();
    clearErrors(form);

    if (form.checkValidity()) {
        submitSuccess();
    } else {
        showErrors(form);
    }
});

function showErrors(form) {
    let firstInvalidEl = null;
    form.querySelectorAll(':invalid').forEach(el => {
        if (!firstInvalidEl) firstInvalidEl = el;
        const id = el.id + '-error';
        const errorSpan = document.getElementById(id);
        if (errorSpan) errorSpan.removeAttribute('hidden');
        el.setAttribute('aria-invalid', 'true');
    });
    if (firstInvalidEl) firstInvalidEl.focus();
}

function clearErrors(form) {
    form.querySelectorAll('[aria-invalid]').forEach(el => {
        el.setAttribute('aria-invalid', 'false');
        const id = el.id + '-error';
        const errorSpan = document.getElementById(id);
        if (errorSpan) errorSpan.setAttribute('hidden', '');
    });
}

function submitSuccess() {
    btnSpinner.removeAttribute('hidden');
    submitBtn.setAttribute('disabled', 'true');
    btnText.textContent = 'Sending...';

    setTimeout(() => {
        alert('Form submitted successfully!');
        form.reset();
        charCounter.textContent = '1000 characters left';
        btnSpinner.setAttribute('hidden', '');
        submitBtn.removeAttribute('disabled');
        btnText.textContent = 'Send Message';
        clearErrors(form);
    }, 2000);
}

/* ============================================================
   Lab 9 — HTTP Headers, Cookies & Web Security Basics
   Remembers a returning visitor via a cookie, logs response
   headers from a fetch call, and renders user text safely.
   ============================================================ */

// ---------- Visitor Cookie ----------
const COOKIE_NAME = 'visitorName';

function setVisitorCookie(name) {
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(name)}; max-age=2592000; path=/`;
}

function getVisitorCookie() {
    const match = document.cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
    return match ? decodeURIComponent(match[1]) : null;
}

function greetReturningVisitor() {
    const banner = document.querySelector('#greeting');
    const name = getVisitorCookie();

    if (name) {
        banner.textContent = `Welcome back, ${name}! 👋`;
    } else {
        const input = prompt("First time here — what's your name?");
        if (input && input.trim()) {
            setVisitorCookie(input.trim());
            banner.textContent = `Nice to meet you, ${input.trim()}!`;
        } else {
            banner.textContent = 'Welcome to the portfolio!';
        }
    }

    console.log('Visitor cookie:', getVisitorCookie()); // debug checkpoint
}

// ---------- Response Header Inspection ----------
async function logResponseHeaders(url) {
    try {
        const res = await fetch(url);
        console.log('Content-Type:', res.headers.get('Content-Type'));
        console.log('Cache-Control:', res.headers.get('Cache-Control'));
    } catch (err) {
        // Fetching a local file:// path fails without a dev server —
        // that's expected if this page isn't being served over HTTP.
        console.error('Could not fetch', url, err);
    }
}

// ---------- Safe Rendering (closes the XSS hole) ----------
// Same escaping technique as escapeHtml() above, kept as its own
// named function per the lab spec: any raw user text is passed
// through this before it ever reaches innerHTML / insertAdjacentHTML.
function safeRender(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML; // tags become literal text — safe
}

// ---------- Comment Form ----------
const commentForm = document.querySelector('#comment-form');
const commentInput = document.querySelector('#comment-input');
const commentList = document.querySelector('#comment-list');

function addComment(text) {
    const p = document.createElement('p');
    p.className = 'comment-item mb-0';
    p.insertAdjacentHTML('beforeend',
        `${safeRender(text)}<span class="comment-time">${escapeHtml(new Date().toLocaleTimeString())}</span>`);
    commentList.prepend(p);
    console.log('Rendered comment safely'); // debug checkpoint
}

commentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = commentInput.value.trim();
    if (!text) return;
    addComment(text);
    commentForm.reset();
});

// ---------- Init ----------
// script.js is loaded with `defer`, so the DOM is already parsed and
// DOMContentLoaded hasn't fired yet — safe to hook it here.
window.addEventListener('DOMContentLoaded', () => {
    greetReturningVisitor();
    logResponseHeaders('data/projects.json'); // logs Content-Type & Cache-Control
});
