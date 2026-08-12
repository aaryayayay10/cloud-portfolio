/* =========================================================
   CORE EXPERTISE — SCROLL ANIMATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    // Make sure GSAP + ScrollTrigger are available
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
        console.error("GSAP or ScrollTrigger is not loaded.");
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    /* -----------------------------------------------------
       CORE REFERENCES
    ----------------------------------------------------- */

    const scene = document.querySelector(".expertise-scene");
    const core = document.querySelector(".expertise-scene .core");
    const nodes = gsap.utils.toArray(".expertise-scene .skill-node");
    const particles = gsap.utils.toArray(".expertise-scene .particles span");

    if (!scene || !core || !nodes.length) {
        console.warn("Core Expertise elements not found.");
        return;
    }

    /* -----------------------------------------------------
       INITIAL STATE
       Nodes start close to the center and invisible.
    ----------------------------------------------------- */

    gsap.set(nodes, {
        opacity: 0,
        scale: 0.35,
        x: 0,
        y: 0
    });

    gsap.set(core, {
        scale: 0.75,
        opacity: 0
    });

    gsap.set(particles, {
        opacity: 0,
        scale: 0
    });

    /* -----------------------------------------------------
       PARTICLE FLOATING
    ----------------------------------------------------- */

    particles.forEach((particle, index) => {

        gsap.to(particle, {

            x: gsap.utils.random(-20, 20),

            y: gsap.utils.random(-20, 20),

            duration: gsap.utils.random(2.5, 4.5),

            repeat: -1,

            yoyo: true,

            ease: "sine.inOut",

            delay: index * 0.12

        });

    });

    /* -----------------------------------------------------
       MAIN SCROLL TIMELINE
    ----------------------------------------------------- */

    const timeline = gsap.timeline({

        scrollTrigger: {

            trigger: scene,

            start: "top 70%",

            end: "bottom 45%",

            scrub: 1,

            once: true

        }

    });

    /* -----------------------------------------------------
       CORE APPEARS
    ----------------------------------------------------- */

    timeline.to(core, {

        opacity: 1,

        scale: 1,

        duration: 0.8,

        ease: "back.out(1.7)"

    });


    /* -----------------------------------------------------
       PARTICLES APPEAR
    ----------------------------------------------------- */

    timeline.to(particles, {

        opacity: 0.65,

        scale: 1,

        duration: 0.5,

        stagger: 0.03,

        ease: "power2.out"

    }, "-=0.35");


    /* -----------------------------------------------------
       SKILL NODES EXPAND
    ----------------------------------------------------- */

    timeline.to(nodes, {

        opacity: 1,

        scale: 1,

        duration: 1.1,

        stagger: {

            each: 0.12,

            from: "center"

        },

        ease: "back.out(1.5)"

    }, "-=0.25");


    /* -----------------------------------------------------
       CORE PULSE AFTER EXPANSION
    ----------------------------------------------------- */

    timeline.to(core, {

        scale: 1.06,

        duration: 0.35,

        ease: "power2.out"

    });

    timeline.to(core, {

        scale: 1,

        duration: 0.45,

        ease: "power2.inOut"

    });


    /* -----------------------------------------------------
       NODE HOVER EFFECT
    ----------------------------------------------------- */

    nodes.forEach(node => {

        node.addEventListener("mouseenter", () => {

            gsap.to(node, {

                y: -8,

                scale: 1.025,

                duration: 0.3,

                ease: "power2.out",

                overwrite: true

            });

        });


        node.addEventListener("mouseleave", () => {

            gsap.to(node, {

                y: 0,

                scale: 1,

                duration: 0.35,

                ease: "power2.out",

                overwrite: true

            });

        });

    });


    /* -----------------------------------------------------
       CORE SUBTLE FLOAT
    ----------------------------------------------------- */

    gsap.to(core, {

        y: -6,

        duration: 2.4,

        repeat: -1,

        yoyo: true,

        ease: "sine.inOut",

        delay: 1.5

    });


    /* -----------------------------------------------------
       REFRESH SCROLLTRIGGER
    ----------------------------------------------------- */

    window.addEventListener("resize", () => {

        ScrollTrigger.refresh();

    });

});