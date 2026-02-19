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

    if (bModal) {
        document.querySelectorAll(".badge-item").forEach(badge => {
            badge.addEventListener("click", function() {
                const title = this.getAttribute("data-title");
                const desc = this.getAttribute("data-desc");
                const img = this.getAttribute("data-img");
                const verifyLink = this.getAttribute("data-verify");

                document.getElementById("badge-modal-title").innerText = title;
                document.getElementById("badge-modal-desc").innerText = desc;
                document.getElementById("badge-modal-img").src = img;
                document.getElementById("badge-modal-verify").href = verifyLink;

                bModal.style.display = "flex";
                document.body.style.overflow = "hidden";
            });
        });

        const closeBModal = () => {
            bModal.style.display = "none";
            document.body.style.overflow = "auto";
        };

        if (bCloseBtn) bCloseBtn.onclick = closeBModal;
        window.addEventListener("click", (e) => { if (e.target === bModal) closeBModal(); });
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
