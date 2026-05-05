let projects = [
    {
        name: "Weeks of Madness",
        link: "https://weeksofmadness.com",
        imgSrc: "./public/womImg.png",
        imgAlt: "Weeks of Madness Thumbnail",
        description: "Project for a family friend to play March Madness in a fun way.",
        skills: ["Next.js + Tailwind CSS (frontend)", "Node.js + Express (backend)", "MySQL + Sequelize (database)"]
        
    },
    {
        name: "PySonic (BLV code editor)",
        link: "https://github.com/carson-hellman/PySonic",
        imgSrc: "./public/PySonicImg.png",
        imgAlt: "PySonic Thumbnail",
        description: "University group project where we built a web-based code editor for BLV (blind and low-vision) beginner programmers.",
        skills: ["React", "Node.js"],
    },
    {
        name: "AI Car",
        link: "https://github.com/carson-hellman/AI_car",
        imgSrc: "./public/preview_thumbnail.png",
        imgAlt: "AI Car Thumbnail",
        description: "I wanted to learn a little about AI, so I built a neural network capable of driving a car around a track.",
        skills: ["Python", "Numpy", "Pandas", "Pygame"],            
    },
    {
        name: "Shut The Box",
        link: "https://github.com/carson-hellman/ShutTheBox",
        imgSrc: "./public/ShutTheBoxImg.png",
        imgAlt: "Shut The Box Thumbnail",
        description: "A classic board game implemented as a web application.",
        skills: ["Unity", "C#"],            
    },
    {
        name: "WebGL Toon Shading",
        link: "./webglPproject.html",
        imgSrc: "./public/toonImg.png",
        imgAlt: "WebGL Toon Shading Thumbnail",
        description: "A web application demonstrating toon shading techniques using WebGL.",
        skills: ["WebGL"],            
    },
];

function loadProjects() {
    document.getElementById("projectsGrid").innerHTML = projects.map(project => `
        <div class="gridItem">
          <!-- default --->
          <a href="${project.link}"></a>
          <h3 class="projectHeader">${project.name}</h3>
          <img alt="Car Preview Img" src="${project.imgSrc}">

          <!-- hover --->
          <div class="gridItemPopUp">
            <h3 class="projectHeader">${project.name}</h3>
            <p style="padding: 1vw;">${project.description}</p>
            <strong><u>Skills</u></strong>
            <p style="margin: 0;">${project.skills.map(skill => `${skill}<br/>`).join("")}</p>
          </div>
        </div>
    `).join("");
}

loadProjects();
