// Get WebGL context 
var canvas = document.getElementById("canvas"); 
var gl = canvas.getContext("webgl2"); 
if (!gl) { 
    alert("Your browser does not support WebGL"); 
} 

// Create program
var program = gl.createProgram();

// Define shaders
const vertexShaderSource = 
    "#version 300 es\n" +
    "in vec3 v_pos;\n" +
    "in vec3 v_normal;\n" +
    "out vec3 normal;\n" +
    "uniform mat4 uModelViewMatrix;\n" +
    "uniform mat4 uProjectionMatrix;\n" +
    "uniform mat3 uNormalMatrix;\n" +
    "void main() {\n" +
    "   normal = uNormalMatrix * v_normal;\n" +
    "   gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(v_pos, 1.0);" +
    "}\n";

const fragmentShaderSource = 
    "#version 300 es\n" +
    "precision mediump float;\n" +
    "in vec3 normal;\n" +
    "out vec4 fragColor;\n" +
    "uniform vec3 uLightDirection;\n" +
    "uniform vec4 uLightColor;\n" +
    "uniform vec4 uAmbientColor;\n" +
    "uniform vec4 uObjectColor;\n" +
    "void main() {\n" +
    "   vec3 norm = normalize(normal);\n" +
    "   float lightIntensity = max(dot(norm, -uLightDirection), 0.0);\n" +
    "   vec4 color = uObjectColor * (uAmbientColor + lightIntensity * uLightColor);\n" +
    "   fragColor = color;\n" +
    "}\n";

// Helper function to compile shaders
function compileShader(gl, source, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

// Compile vertex and fragment shaders
var vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
var fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

// Attach and link shaders to the program
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

gl.useProgram(program);

// Define uniforms
var modelViewMatrix = mat4.create();
mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -5]); // Translate back
mat4.rotateX(modelViewMatrix, modelViewMatrix, Math.PI / 6); // Rotate

var projectionMatrix = mat4.create();
mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 0.1, 100.0);

var normalMatrix = mat3.create();
mat3.normalFromMat4(normalMatrix, modelViewMatrix);

var lightDirection = [1.0, 1.0, 1.0];
var lightColor = [1.0, 1.0, 1.0, 1.0];
var ambientColor = [0.1, 0.1, 0.1, 1.0];
var objectColor = [1.0, 0.0, 0.0, 1.0]; // Set default object color to red

gl.uniformMatrix4fv(gl.getUniformLocation(program, "uModelViewMatrix"), false, modelViewMatrix);
gl.uniformMatrix4fv(gl.getUniformLocation(program, "uProjectionMatrix"), false, projectionMatrix);
gl.uniformMatrix3fv(gl.getUniformLocation(program, "uNormalMatrix"), false, normalMatrix);
gl.uniform3fv(gl.getUniformLocation(program, "uLightDirection"), lightDirection);
gl.uniform4fv(gl.getUniformLocation(program, "uLightColor"), lightColor);
gl.uniform4fv(gl.getUniformLocation(program, "uAmbientColor"), ambientColor);
gl.uniform4fv(gl.getUniformLocation(program, "uObjectColor"), objectColor);

// Create a sphere
function createSolidSphere(radius, latitudeBands, longitudeBands) {
    var vertexData = [];
    var normalData = [];
    var indexData = [];

    for (let latNumber = 0; latNumber <= latitudeBands; latNumber++) {
        let theta = latNumber * Math.PI / latitudeBands;
        let sinTheta = Math.sin(theta);
        let cosTheta = Math.cos(theta);

        for (let longNumber = 0; longNumber <= longitudeBands; longNumber++) {
            let phi = longNumber * 2 * Math.PI / longitudeBands;
            let sinPhi = Math.sin(phi);
            let cosPhi = Math.cos(phi);

            let x = cosPhi * sinTheta;
            let y = cosTheta;
            let z = sinPhi * sinTheta;

            normalData.push(x, y, z);
            vertexData.push(radius * x, radius * y, radius * z);

            if (latNumber < latitudeBands && longNumber < longitudeBands) {
                let first = (latNumber * (longitudeBands + 1)) + longNumber;
                let second = first + longitudeBands + 1;

                indexData.push(first, second, first + 1);
                indexData.push(second, second + 1, first + 1);
            }
        }
    }

    return {
        vertices: new Float32Array(vertexData),
        normals: new Float32Array(normalData),
        indices: new Uint16Array(indexData)
    };
}

var sphereData = createSolidSphere(1, 30, 30);

// Create and bind buffers
var vertexBufferObjectSphere = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObjectSphere);
gl.bufferData(gl.ARRAY_BUFFER, sphereData.vertices, gl.STATIC_DRAW);

var positionAttribLocation = gl.getAttribLocation(program, 'v_pos');
gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, gl.FALSE, 0, 0);
gl.enableVertexAttribArray(positionAttribLocation);

var normalBufferObjectSphere = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, normalBufferObjectSphere);
gl.bufferData(gl.ARRAY_BUFFER, sphereData.normals, gl.STATIC_DRAW);

var normalAttribLocation = gl.getAttribLocation(program, 'v_normal');
gl.vertexAttribPointer(normalAttribLocation, 3, gl.FLOAT, gl.FALSE, 0, 0);
gl.enableVertexAttribArray(normalAttribLocation);

var indexBufferObjectSphere = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferObjectSphere);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, sphereData.indices, gl.STATIC_DRAW);

// Enable depth testing
gl.enable(gl.DEPTH_TEST);

// Clear the color and depth buffers
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

// Draw the sphere using indexed drawing
gl.drawElements(gl.TRIANGLES, sphereData.indices.length, gl.UNSIGNED_SHORT, 0);

// Handle mouse movement to update light direction
function updateLightDirection(x, y) {
    // Map mouse position to a light direction vector
    var ndcX = (x / canvas.width) * 2 - 1;
    var ndcY = 1 - (y / canvas.height) * 2;
    var scale = 3.0; // Sensitivity
    var lightDirection = [ndcX * scale, ndcY * scale, -1.0];
    var length = Math.sqrt(lightDirection[0] ** 2 + lightDirection[1] ** 2 + lightDirection[2] ** 2);
    lightDirection = lightDirection.map(val => val / length); // Normalize the direction
    gl.uniform3fv(gl.getUniformLocation(program, "uLightDirection"), lightDirection);
}

canvas.addEventListener('mousemove', function(event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    updateLightDirection(x, y);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, sphereData.indices.length, gl.UNSIGNED_SHORT, 0);
});

// Update object color from sliders
function updateObjectColor(r, g, b, a) {
    var r = document.getElementById("rSlider").value / 255;
    var g = document.getElementById("gSlider").value / 255;
    var b = document.getElementById("bSlider").value / 255;
    var newColor = [r, g, b, 1.0];
    gl.uniform4fv(gl.getUniformLocation(program, "uObjectColor"), newColor);
    document.getElementById("colorDisplay").style.backgroundColor = `rgb(${r * 255}, ${g * 255}, ${b * 255})`;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, sphereData.indices.length, gl.UNSIGNED_SHORT, 0);
}

document.getElementById("rSlider").addEventListener('input', updateObjectColor);
document.getElementById("gSlider").addEventListener('input', updateObjectColor);
document.getElementById("bSlider").addEventListener('input', updateObjectColor);
