/* ==========================================
   CLOUD PORTFOLIO SCRIPT
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================
        Navbar Scroll Effect
    ========================== */

    const navbar = document.querySelector(".navbar");

    window.addEventListener("scroll", () => {

        if (window.scrollY > 50) {

            navbar.style.background = "rgba(5,8,22,.92)";
            navbar.style.backdropFilter = "blur(20px)";
            navbar.style.boxShadow = "0 10px 35px rgba(0,0,0,.25)";

        } else {

            navbar.style.background = "rgba(5,8,22,.55)";
            navbar.style.boxShadow = "none";

        }

    });

    /* ==========================
        Smooth Scrolling
    ========================== */

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", function(e) {

            const target = document.querySelector(this.getAttribute("href"));

            if (!target) return;

            e.preventDefault();

            target.scrollIntoView({

                behavior: "smooth"

            });

        });

    });

    /* ==========================
        Active Navigation
    ========================== */

    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");

    window.addEventListener("scroll", () => {

        let current = "";

        sections.forEach(section => {

            const top = section.offsetTop - 120;
            const height = section.offsetHeight;

            if (pageYOffset >= top) {

                current = section.getAttribute("id");

            }

        });

        navLinks.forEach(link => {

            link.classList.remove("active");

            if (link.getAttribute("href") === "#" + current) {

                link.classList.add("active");

            }

        });

    });

    /* ==========================
        Reveal on Scroll
    ========================== */

    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);

            }

        });

    }, {

        threshold: 0.15

    });

    document.querySelectorAll(`
    .skill-card,
    .project-card,
    .dashboard-card,
    .glass-card,
    .timeline-item,
    .input-group,
    .service-chip,
    .send-btn
`).forEach((element, index) => {

    element.style.opacity = "0";
    element.style.transform = "translateY(40px)";
    element.style.transition = `all .7s ease ${index * 70}ms`;

    observer.observe(element);

});

    /* ==========================
        Hero Stats Counter
    ========================== */

    const counters = document.querySelectorAll(".hero-stats h3");

    counters.forEach(counter => {

        const target = counter.innerText;
        const number = parseInt(target);

        if (isNaN(number)) return;

        let value = 0;

        const update = () => {

            value += Math.ceil(number / 40);

            if (value >= number) {

                counter.innerText = target;

            } else {

                counter.innerText = value + "+";

                requestAnimationFrame(update);

            }

        };

        update();

    });

});

/* ==========================
    Scroll To Top Button
========================== */

const topButton = document.createElement("button");

topButton.innerHTML = "↑";

topButton.style.position = "fixed";
topButton.style.bottom = "30px";
topButton.style.right = "30px";
topButton.style.width = "50px";
topButton.style.height = "50px";
topButton.style.border = "none";
topButton.style.borderRadius = "50%";
topButton.style.background = "#4F8CFF";
topButton.style.color = "#fff";
topButton.style.fontSize = "22px";
topButton.style.cursor = "pointer";
topButton.style.display = "none";
topButton.style.zIndex = "999";
topButton.style.boxShadow = "0 10px 30px rgba(79,140,255,.35)";
topButton.style.transition = ".3s";

document.body.appendChild(topButton);

window.addEventListener("scroll", () => {

    if (window.scrollY > 500) {

        topButton.style.display = "block";

    } else {

        topButton.style.display = "none";

    }

});

topButton.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});

const wrapper = document.getElementById("parallax-wrapper");

if (wrapper) {

    window.addEventListener("scroll", () => {

        const y = window.scrollY;

        wrapper.style.transform = `translateY(${y * -0.05}px)`;

    });

}

const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

if (sendBtn) {

    sendBtn.addEventListener("click", sendMessage);

    userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    });

}

async function sendMessage() {

    const message = userInput.value.trim();

    if (!message) return;

    // Show user message
    chatBox.innerHTML += `
        <div class="user-message">
            ${message}
        </div>
    `;

    userInput.value = "";

    // Show loading animation
    const loadingId = Date.now();

    chatBox.innerHTML += `
        <div class="bot-message loading-message" id="${loadingId}">
            <div class="typing-loader">
                <span></span>
                <span></span>
                <span></span>
            </div>

            <div class="thinking-text">
                Aarya AI is thinking...
            </div>
        </div>
    `;

    chatBox.scrollTop = chatBox.scrollHeight;

    try {

        console.log("Sending:", message);

        const response = await fetch("http://localhost:3000/api/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message
            })

        });

        console.log("Status:", response.status);

        if (!response.ok) {

            throw new Error(`HTTP ${response.status}`);

        }

        const data = await response.json();

        console.log("Response:", data);

        const loadingMessage = document.getElementById(String(loadingId));

        if (!loadingMessage) return;

        loadingMessage.innerHTML = `
            <div class="bot-message-content"></div>
        `;

        typeMessage(

            loadingMessage.querySelector(".bot-message-content"),

            data.reply || "No response received."

        );

    }

    catch (err) {

        console.error(err);

        const loadingMessage = document.getElementById(String(loadingId));

        if (loadingMessage) {

            loadingMessage.innerHTML = `
                <div class="bot-message">
                    ⚠️ ${err.message}
                </div>
            `;

        }

    }

    chatBox.scrollTop = chatBox.scrollHeight;

}

/* ==========================
        Typewriter Effect
========================== */

function typeMessage(element, text) {

    element.innerHTML = "";

    let index = 0;

    const speed = 12;

    const timer = setInterval(() => {

        if (index >= text.length) {

            clearInterval(timer);
            return;

        }

        element.innerHTML += text.charAt(index);

        chatBox.scrollTop = chatBox.scrollHeight;

        index++;

    }, speed);

}


/* ==========================
   Suggested Question Buttons
========================== */
document.querySelectorAll(".suggestion-btn").forEach(button => {

    button.addEventListener("click", () => {

        const question = button.textContent
            .replace(/[^\w\s?]/g, "")
            .trim();

        userInput.value = question;

        sendMessage();

    });

});

/* ==========================
   Projects Section Animations (GSAP)
========================== */

// Initialize GSAP ScrollTrigger for project cards
if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    
    gsap.registerPlugin(ScrollTrigger);

    const projectCards = document.querySelectorAll(".project-card");
    
    if (projectCards.length) {
        
        // Staggered entrance animation
        gsap.fromTo(
            projectCards,
            {
                opacity: 0,
                y: 60,
                rotation: -2
            },
            {
                opacity: 1,
                y: 0,
                rotation: 0,
                duration: 0.8,
                stagger: {
                    amount: 0.4,
                    from: "start"
                },
                ease: "back.out(1.2)",
                scrollTrigger: {
                    trigger: ".projects-grid",
                    start: "top 70%",
                    end: "top 30%",
                    toggleActions: "play none none reverse",
                    markers: false
                }
            }
        );

        // Individual card hover animations
        projectCards.forEach((card) => {
            
            card.addEventListener("mouseenter", () => {
                gsap.to(card, {
                    y: -20,
                    duration: 0.4,
                    ease: "power2.out"
                });
            });

            card.addEventListener("mouseleave", () => {
                gsap.to(card, {
                    y: 0,
                    duration: 0.4,
                    ease: "power2.out"
                });
            });

            // Animate icon on hover
            const icon = card.querySelector(".project-icon");
            if (icon) {
                card.addEventListener("mouseenter", () => {
                    gsap.to(icon, {
                        scale: 1.2,
                        duration: 0.4,
                        ease: "back.out(1.5)"
                    });
                });

                card.addEventListener("mouseleave", () => {
                    gsap.to(icon, {
                        scale: 1,
                        duration: 0.4,
                        ease: "back.out(1.5)"
                    });
                });
            }
        });

        // Animate tech badges on card hover
        projectCards.forEach((card) => {
            const badges = card.querySelectorAll(".tech-badge");
            
            card.addEventListener("mouseenter", () => {
                badges.forEach((badge, index) => {
                    gsap.to(badge, {
                        y: -4,
                        duration: 0.3,
                        delay: index * 0.05,
                        ease: "power2.out"
                    });
                });
            });

            card.addEventListener("mouseleave", () => {
                badges.forEach((badge) => {
                    gsap.to(badge, {
                        y: 0,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                });
            });
        });
    }
}

/* ==========================
   Contact Section Animations (GSAP)
========================== */

if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    
    gsap.registerPlugin(ScrollTrigger);

    // Main contact card animation
    const contactPrimary = document.querySelector(".contact-primary");
    if (contactPrimary) {
        gsap.fromTo(
            contactPrimary,
            {
                opacity: 0,
                y: 80,
                scale: 0.95
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1,
                ease: "back.out(1.2)",
                scrollTrigger: {
                    trigger: ".contact-main",
                    start: "top 80%",
                    end: "top 40%",
                    toggleActions: "play none none reverse",
                    markers: false
                }
            }
        );
    }

    // Social links animation
    const socialLinks = document.querySelectorAll(".social-link-elegant");
    if (socialLinks.length) {
        gsap.fromTo(
            socialLinks,
            {
                opacity: 0,
                y: 40
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: {
                    amount: 0.2,
                    from: "start"
                },
                ease: "back.out(1.2)",
                delay: 0.2,
                scrollTrigger: {
                    trigger: ".contact-secondary",
                    start: "top 80%",
                    end: "top 40%",
                    toggleActions: "play none none reverse",
                    markers: false
                }
            }
        );

        // Hover animations for social links
        socialLinks.forEach((link) => {
            link.addEventListener("mouseenter", () => {
                gsap.to(link, {
                    y: -8,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            link.addEventListener("mouseleave", () => {
                gsap.to(link, {
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
    }
}
