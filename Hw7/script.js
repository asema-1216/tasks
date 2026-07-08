const projectData = [
    { name: "DNS Analysis", type: "Networking" },
    { name: "Strawberry Cupid Layout", type: "Design" },
    { name: "Security Campaign", type: "Security" },
    { name: "Streamer Widgets", type: "Design" },
    { name: "Economic CO₂ Trends", type: "Networking" },
    { name: "Rococo Room Model", type: "Design" }
];
console.table(projectData);

const themeToggle = document.querySelector('#theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    if (document.body.classList.contains('dark-theme')) {
        themeToggle.textContent = '☀️ Light Mode';
        themeToggle.classList.remove('btn-outline-dark');
        themeToggle.classList.add('btn-outline-light');
    } else {
        themeToggle.textContent = '🌙 Dark Mode';
        themeToggle.classList.remove('btn-outline-light');
        themeToggle.classList.add('btn-outline-dark');
    }
});

const filterButtons = document.querySelectorAll('.filter-btn');
const projectItems = document.querySelectorAll('.project-item');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-theme');
        
        filterButtons.forEach(b => {
            if (isDark) {
                b.classList.remove('btn-light');
                b.classList.add('btn-outline-light');
            } else {
                b.classList.remove('btn-dark');
                b.classList.add('btn-outline-dark');
            }
        });

        if (isDark) {
            btn.classList.remove('btn-outline-light');
            btn.classList.add('btn-light');
        } else {
            btn.classList.remove('btn-outline-dark');
            btn.classList.add('btn-dark');
        }

        const filterValue = btn.getAttribute('data-filter');

        projectItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

const messageInput = document.querySelector('#message');
const charCounter = document.querySelector('#char-counter');
const maxLength = 1000;

messageInput.addEventListener('input', () => {
    const currentLength = messageInput.value.length;
    const remaining = maxLength - currentLength;
    charCounter.textContent = `${remaining} characters left`;
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
        if (errorSpan) {
            errorSpan.removeAttribute('hidden');
        }
        el.setAttribute('aria-invalid', 'true');
    });

    if (firstInvalidEl) {
        firstInvalidEl.focus();
    }
}

function clearErrors(form) {
    form.querySelectorAll('[aria-invalid]').forEach(el => {
        el.setAttribute('aria-invalid', 'false');
        const id = el.id + '-error';
        const errorSpan = document.getElementById(id);
        if (errorSpan) {
            errorSpan.setAttribute('hidden', '');
        }
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