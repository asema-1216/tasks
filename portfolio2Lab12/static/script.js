function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function safeRender(text) {
    return escapeHtml(text);
}

const STORAGE_KEY = 'portfolio-projects';
const API_URL = '/api/projects'; 
const TIMEOUT_MS = 5000; 

const defaultProjects = [
    { id: 1, title: "DNS Analysis", description: "Simulated and analyzed Domain Name System traffic logs to inspect query-response patterns.", category: "networking" },
    { id: 2, title: "Strawberry Cupid Layout", description: "A coquette-themed aesthetic e-commerce interface designed with strict visual hierarchy principles.", category: "design" },
    { id: 3, title: "Security Campaign", description: "Simulated social engineering assessment and corresponding defense framework presentation.", category: "security" },
    { id: 4, title: "Streamer Widgets", description: "Interactive dashboard components focused entirely on live audience engagement metrics.", category: "design" },
    { id: 5, title: "Economic CO₂ Trends", description: "Comparative analysis studying the correlation between GDP per capita and global emissions (2012–2022).", category: "networking" },
    { id: 6, title: "Rococo Room Model", description: "Stylized low-poly interior scenes created in Blender using intricate historical decorative motives.", category: "design" }
];

async function fetchWithTimeout(url, options = {}, timeout = TIMEOUT_MS) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
}

async function loadProjects() {
    try {
        console.log('Fetching projects from Python Flask Server API...');
        const response = await fetchWithTimeout(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const projects = await response.json();

        if (projects.length === 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProjects));
            return defaultProjects;
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
        return projects;

    } catch (error) {
        console.warn('Network request failed. Falling back to cache...', error.message);
        const cachedData = localStorage.getItem(STORAGE_KEY);
        if (cachedData) {
            return JSON.parse(cachedData);
        }
        return defaultProjects;
    }
}

function renderProjects(projects) {
    const projectsGrid = document.querySelector('#projects-grid');
    if (!projectsGrid) return;
    
    projectsGrid.innerHTML = '';
    
    projects.forEach(project => {
        const col = document.createElement('div');
        col.className = 'col project-item';
        col.setAttribute('data-category', project.category);
        
        col.innerHTML = `
            <div class="card h-100 border-0 shadow-sm">
                <div class="card-body d-flex flex-column">
                    <div><span class="badge bg-secondary mb-2 text-uppercase">${safeRender(project.category)}</span></div>
                    <h5 class="card-title text-dark fw-bold">${safeRender(project.title)}</h5>
                    <p class="card-text text-muted small flex-grow-1">${safeRender(project.description)}</p>
                    
                    <!-- ПРАВКА 2: Кнопка открывает серверную страницу конкретного проекта (SSR) -->
                    <a href="/projects/${project.id}" class="btn btn-sm btn-outline-dark mt-3 w-100 fw-bold">View Details</a>
                </div>
            </div>
        `;
        projectsGrid.appendChild(col);
    });
}

function setVisitorCookie(name) {
    document.cookie = `visitorName=${encodeURIComponent(name)}; max-age=31536000; path=/; SameSite=Lax`;
}

function getVisitorCookie() {
    const matches = document.cookie.match(new RegExp(
        "(?:^|; )" + "visitorName".replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function handleGreeting() {
    const name = getVisitorCookie();
    const banner = document.querySelector('#greeting');
    if (!banner) return;
    
    if (name) {
        banner.textContent = `Welcome back, ${name}!`;
        banner.style.display = 'block';
    } else {
        const input = prompt("First time here — what's your name?");
        if (input && input.trim() !== "") {
            setVisitorCookie(input.trim());
            banner.textContent = `Nice to meet you, ${input.trim()}!`;
            banner.style.display = 'block';
        } else {
            banner.textContent = 'Welcome to the portfolio!';
            banner.style.display = 'block';
        }
    }
}

const themeToggle = document.querySelector('#theme-toggle');
let isDark = false;

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        isDark = !isDark;
        document.body.classList.toggle('dark-theme', isDark);
        themeToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
    });
}

const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const currentDarkState = document.body.classList.contains('dark-theme');
        
        filterButtons.forEach(b => {
            b.className = currentDarkState ? 'btn btn-outline-light filter-btn' : 'btn btn-outline-dark filter-btn';
        });
        btn.className = currentDarkState ? 'btn btn-light filter-btn' : 'btn btn-dark filter-btn';

        const filterValue = btn.getAttribute('data-filter');

        const projectItems = document.querySelectorAll('.project-item');
        projectItems.forEach(item => {
            const cat = item.getAttribute('data-category');
            if (filterValue === 'all' || cat === filterValue) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

const messageInput = document.querySelector('#message');
const charCounter = document.querySelector('#char-counter');

if (messageInput && charCounter) {
    messageInput.addEventListener('input', () => {
        const len = messageInput.value.length;
        const remaining = 1000 - len;
        charCounter.textContent = `${remaining} characters left`;
    });
}

window.addEventListener('DOMContentLoaded', async () => {
    handleGreeting();
    
    const projects = await loadProjects();
    renderProjects(projects);
});

window.addEventListener('offline', () => {
    const errorEl = document.querySelector('#error-message');
    if (errorEl) {
        errorEl.textContent = 'You are offline — showing cached data.';
        errorEl.removeAttribute('hidden');
    }
});

window.addEventListener('online', () => {
    const errorEl = document.querySelector('#error-message');
    if (errorEl) {
        errorEl.setAttribute('hidden', '');
    }
});