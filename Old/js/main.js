// 1. SHARED HEADER LOADING
document.addEventListener("DOMContentLoaded", () => {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        fetch('assets/includes/header.html')
            .then(response => {
                if (!response.ok) throw new Error("Could not load header");
                return response.text();
            })
            .then(data => {
                headerPlaceholder.innerHTML = data;
                initHamburger();
            })
            .catch(error => console.error("Error loading header:", error));
    }
});

function initHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('toggle');
        });
    }
}

// 2. PROJECT MODAL LOGIC (Wrapped in check to prevent crashes)
document.addEventListener("DOMContentLoaded", () => {
    const pModal = document.getElementById("project-modal");
    const pCloseBtn = document.querySelector(".close-modal");

    if (pModal) {
        document.querySelectorAll(".project-card").forEach(card => {
            card.addEventListener("click", () => {
                const title = card.querySelector("h3").innerText;
                const img = card.querySelector("img").src;
                const description = card.querySelector(".full-desc").innerText;
                const githubLink = card.querySelector(".project-links").getAttribute("data-github");

                document.getElementById("modal-title").innerText = title;
                document.getElementById("modal-img").src = img;
                document.getElementById("modal-desc").innerText = description;
                document.getElementById("modal-github").href = githubLink;

                pModal.style.display = "block";
                document.body.style.overflow = "hidden";
            });
        });

        const closePModal = () => {
            pModal.style.display = "none";
            document.body.style.overflow = "auto";
        };

        if (pCloseBtn) pCloseBtn.onclick = closePModal;
        window.addEventListener("click", (e) => { if (e.target == pModal) closePModal(); });
    }
});

// 3. BADGE MODAL LOGIC (Optimized with Flex centering)
document.addEventListener("DOMContentLoaded", () => {
    const bModal = document.getElementById("badge-modal");
    const bCloseBtn = document.querySelector(".close-badge-modal");
    
    // Select the modal internal elements once to save performance
    const modalTitle = document.getElementById("badge-modal-title");
    const modalDesc = document.getElementById("badge-modal-desc");
    const modalImg = document.getElementById("badge-modal-img");
    const modalVerify = document.getElementById("badge-modal-verify");

    if (bModal) {
        document.querySelectorAll(".badge-item").forEach(badge => {
            badge.addEventListener("click", function() {
                // Extract data from the clicked item
                const title = this.getAttribute("data-title");
                const desc = this.getAttribute("data-desc");
                const img = this.getAttribute("data-img");
                const verifyLink = this.getAttribute("data-verify");

                // Update modal content
                if(modalTitle) modalTitle.textContent = title;
                if(modalDesc) modalDesc.textContent = desc;
                if(modalImg) modalImg.src = img;
                if(modalVerify) modalVerify.href = verifyLink;

                // Show modal
                bModal.style.display = "flex";
                document.body.style.overflow = "hidden";
            });
        });

        const closeBModal = () => {
            bModal.style.display = "none";
            document.body.style.overflow = "auto";
        };

        if (bCloseBtn) bCloseBtn.onclick = closeBModal;
        
        // Close if clicking the backdrop
        window.addEventListener("click", (e) => { 
            if (e.target === bModal) closeBModal(); 
        });
    }
});


// 4. PROJECT FILTERING
function applyProjectFilter() {
    const params = new URLSearchParams(window.location.search);
    const filterTag = params.get('filter');
    if (filterTag) {
        const projects = document.querySelectorAll('.project-card');
        projects.forEach(card => {
            const tags = (card.getAttribute('data-tags') || "").toLowerCase();
            card.style.display = tags.includes(filterTag.toLowerCase()) ? 'flex' : 'none';
        });
    }
}

document.addEventListener('DOMContentLoaded', applyProjectFilter);
window.addEventListener('popstate', applyProjectFilter);

// Certificates Category
function filterCerts(category, element) {
    // Toggle active class for tabs
    document.querySelectorAll('.tab-item').forEach(tab => tab.classList.remove('active'));
    element.classList.add('active');

    // Filter logic for cert cards
    const cards = document.querySelectorAll('.cert-card');
    cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (category === 'all' || cat === category) {
            card.style.display = 'flex';
            card.style.opacity = '1';
        } else {
            card.style.display = 'none';
            card.style.opacity = '0';
        }
    });
}

// Google Contact Form - Send Email

document.getElementById('contact-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const form = e.target;
    const status = document.getElementById('form-status');
    const btn = form.querySelector('button');
    
    btn.innerText = "SENDING...";
    status.style.display = "block";
    status.innerText = "Processing secure transmission...";

    // Google Script URL
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxX7Rf1dCF27eA2-nb7hmF3Dzbt9DlbWeaa1IDwfj9Lgn_IvLY1xmmnt9qcESPdgcqA/exec';

    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
        .then(response => {
            btn.innerText = "SEND_MESSAGE";
            status.innerText = "Message transmitted successfully. All systems operational.";
            status.style.color = "#4caf50";
            form.reset();
        })
        .catch(error => {
            btn.innerText = "SEND_MESSAGE";
            status.innerText = "Transmission failed. Check console for details.";
            status.style.color = "#ff4c4c";
            console.error('Error!', error.message);
        });
});

// Email Copy
function copyEmail() {
    navigator.clipboard.writeText('codingwithme7@gmail.com');
    alert('Email copied to clipboard!');
}