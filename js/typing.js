const words = [
    "Cloud Engineer",
    "AWS Enthusiast",
    "Linux Explorer",
    "DevOps Learner",
    "Software Engineer"
];

let wordIndex = 0;
let charIndex = 0;
let deleting = false;

const typing = document.getElementById("typing");

function type() {

    const current = words[wordIndex];

    if (!deleting) {

        typing.textContent = current.substring(0, charIndex++);
    } else {

        typing.textContent = current.substring(0, charIndex--);
    }

    let speed = deleting ? 50 : 100;

    if (!deleting && charIndex === current.length + 1) {

        deleting = true;
        speed = 1500;

    } else if (deleting && charIndex === 0) {

        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
    }

    setTimeout(type, speed);

}

type();