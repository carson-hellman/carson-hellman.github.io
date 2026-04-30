let projects = [
    {
        name: "Weeks of Madness",
        link: "./weeksofmadness.html",
        imgSrc: "./womImg.png",
        imgAlt: "Weeks of Madness Thumbnail",
        description: "Project for a family friend to play March Madness in a fun way.",
        skills: ["Next.js + Tailwind CSS (frontend)", "Node.js + Express (backend)", "MySQL + Sequelize (database)"]
        
    },
    {
        name: "PySonic (BLV code editor)",
        link: "https://github.com/carson-hellman/PySonic",
        imgSrc: "./PySonicImg.png",
        imgAlt: "PySonic Thumbnail",
        description: "University group project where we built a web-based code editor for BLV (blind and low-vision) beginner programmers.",
        skills: ["React", "Node.js"],
    },
    {
        name: "AI Car",
        link: "https://github.com/carson-hellman/AI_car",
        imgSrc: "./preview_thumbnail.png",
        imgAlt: "AI Car Thumbnail",
        description: "I wanted to learn a little about AI, so I built a neural network capable of driving a car around a track.",
        skills: ["Python", "Numpy", "Pandas", "Pygame"],            
    },
    {
        name: "Shut The Box",
        link: "https://github.com/carson-hellman/ShutTheBox",
        imgSrc: "./ShutTheBoxImg.png",
        imgAlt: "Shut The Box Thumbnail",
        description: "A classic board game implemented as a web application.",
        skills: ["Unity", "C#"],            
    },
    {
        name: "WebGL Toon Shading",
        link: "./webglPproject.html",
        imgSrc: "./toonImg.png",
        imgAlt: "WebGL Toon Shading Thumbnail",
        description: "A web application demonstrating toon shading techniques using WebGL.",
        skills: ["WebGL"],            
    },
];

function loadProjects() {
    document.getElementById("projectsGrid").innerHTML = projects.map(project => `
        <div class="gridItem" style="background-image: url(${project.imgSrc}); background-size: cover; background-position: center;">
            <a href="${project.link}">${project.name}</a>
            
            <div class="gridItemPopUp">
                <p>${project.description}</p>
                <div><strong><u>Skills</u></strong>
                    <ul>${project.skills.map(skill => `<li>${skill}</li>`).join("")}</ul>
                </div>
            </div>
        </div>
    `).join("");
}

loadProjects();