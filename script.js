
const subheadings = [
    "Student",
    "College Graduate",
    "Web Developer",
    "UI/UX Designer",
    "Tech Enthusiast",
    "Problem Solver",
    "Learner",
];

let currentIndex = 0;
const targetElement = document.getElementById("rotating-text");

function changeSubheading() {
  targetElement.classList.remove("slide-fade-animation");
  
  void targetElement.offsetWidth;

  currentIndex = (currentIndex + 1) % subheadings.length;
  targetElement.textContent = subheadings[currentIndex];
  
  targetElement.classList.add("slide-fade-animation");
}

setInterval(changeSubheading, 3000);

targetElement.classList.add("slide-fade-animation");