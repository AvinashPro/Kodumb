import { Joystick } from "./src/utils/Joystick.js"
import { App } from "./src/core/App.js"
import { Program } from "./src/gl/Program.js"
import { QuadGeometry, CubeGeometry } from "./src/geometry/Quad.js";
import { Material } from "./src/scene/Material.js";
import { Mesh } from "./src/scene/Mesh.js";
import { mat4 } from "./src/math/Mat4.js";
//import { Camera } from "./src/render/Camera.js";


const joystick = new Joystick("#joystick1", 20, 40, 120);
const canvas = document.querySelector("canvas");
canvas.addEventListener("dblclick", () => {
  document.documentElement.requestFullscreen();
})

const vs = `#version 300 es
  layout(location=0) in vec3 a_pos;
  uniform mat4 u_model;
  layout(std140) uniform AppData {
    mat4 u_projection;
    mat4 u_view;
  };
  
  void main() {
    gl_Position = u_projection * u_view * u_model * vec4(a_pos, 1.0);
  }
`;

const fs = `#version 300 es
  precision mediump float;
  
  out vec4 FragColor;
  uniform vec4 u_color;
  
  void main() {
    FragColor = u_color;
  }
`

const app = new App(canvas);
const program = new Program(app.renderer.gl, vs, fs, { "AppData": 0 });
const { scene } = app;
const quad1 = new QuadGeometry();
const cube1 = new CubeGeometry();
const material1 = new Material(program);
material1.setUniform("u_color", new Float32Array([0.9, 1.0, 0.9, 1.0]));
const mesh1 = scene.add(new Mesh(quad1, material1));
mesh1.transform.setScale(1000, 1000, 1);
mesh1.transform.setPosition(0, -10, -300);
mesh1.transform.setRotationX(- Math.PI/180*90);

const mesh2 = scene.add(new Mesh(cube1, material1));
mesh2.transform.setScale(50, 50, 50);
mesh2.transform.setPosition(130, 100, -450)

let k = 0;
mesh1.onUpdate = (mesh, dt) => {
  
  k += 2 * dt;
  //app.camera.rotate(k, 0)
  //app.camera.pos.x += 100;
  /*mesh.transform.setRotationX(k/10);
  mesh.transform.setRotationY(k/6);*/
  //mesh.transform.setRotationZ(k/3);
}
mesh2.onUpdate = (mesh, dt) => {
  mesh.transform.setRotationX(k/10);
  mesh.transform.setRotationY(k/6);
  mesh.transform.setRotationZ(k/3);
}
//mesh1.transform.setScale(10, 10, 1);

app.start();

let ubo;
function main(app) {
const { gl } = app.renderer;

const projMatrix = mat4.identity();
mat4.perspective(Math.PI/180*45, gl.canvas.width / gl.canvas.height, 1, 3000, projMatrix);
//mat4.orthographic(0, gl.canvas.width, 0, gl.canvas.height, -1000, 1000, projMatrix);
//console.log(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height)

ubo = gl.createBuffer();
app.ubo = ubo;
gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, ubo);
gl.bindBuffer(gl.UNIFORM_BUFFER, ubo);
gl.bufferData(gl.UNIFORM_BUFFER, 128, gl.DYNAMIC_DRAW);
gl.bufferSubData(gl.UNIFORM_BUFFER, 0, projMatrix.data);

}

setTimeout(() => {
  main(app);
}, 200)


let pointerX, pointerY, camRotating = false;
canvas.addEventListener("pointerdown", e => {
  camRotating = true;
  pointerX = e.clientX;
  pointerY = e.clientY;
})
canvas.addEventListener("pointermove", e => {
  if(!camRotating) return;
  const dx = e.clientX - pointerX;
  const dy = e.clientY - pointerY;
  pointerX = e.clientX;
  pointerY = e.clientY;
  app.camera.rotate(dx, dy);
  canvas.setPointerCapture(e.pointerId)
})
canvas.addEventListener("pointerup", e => {
  camRotating = false;
  canvas.releasePointerCapture(e.pointerId)
})

document.querySelector("#joystick1").addEventListener("pointermove", () => {
  let m = app.camera.move;
  m.x = joystick.x;
  m.z = joystick.y;
})
document.querySelector("#joystick1").addEventListener("pointerup", () => {
  let m = app.camera.move;
  m.x = 0;
  m.z = 0;
})

app.input.bind("Y-", "rBtn")
app.input.bind("Y+", "yBtn")

document.querySelector("#r-btn").addEventListener("pointerdown", () => {
  app.input.handleInputStart("rBtn");
})
document.querySelector("#r-btn").addEventListener("pointerup", () => {
  app.input.handleInputEnd("rBtn");
})
document.querySelector("#y-btn").addEventListener("pointerdown", () => {
  app.input.handleInputStart("yBtn");
})
document.querySelector("#y-btn").addEventListener("pointerup", () => {
  app.input.handleInputEnd("yBtn");
})


console.log({app, program, quad1, material1, mesh1, scene });