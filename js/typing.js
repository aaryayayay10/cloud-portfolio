/* ==========================================
   TYPING EFFECT
========================================== */

const typingElement = document.getElementById("typing");

const words = [

    "Cloud Engineer",

    "AWS Certified",

    "Full-Stack Developer",

    "AI Solutions Builder",

    "Technical & Creative Writer"

];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {

    const currentWord = words[wordIndex];

    if (!isDeleting) {

        typingElement.textContent =
            currentWord.substring(0, charIndex + 1);

        charIndex++;

        if (charIndex === currentWord.length) {

            isDeleting = true;

            setTimeout(typeEffect, 1800);

            return;

        }

    } else {

        typingElement.textContent =
            currentWord.substring(0, charIndex - 1);

        charIndex--;

        if (charIndex === 0) {

            isDeleting = false;

            wordIndex++;

            if (wordIndex >= words.length) {

                wordIndex = 0;

            }

        }

    }

    setTimeout(typeEffect, isDeleting ? 60 : 120);

}

document.addEventListener("DOMContentLoaded", () => {

    if (typingElement) {

        typeEffect();

    }

});
