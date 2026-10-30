import { vec3 } from "../math/Vec3.js"
import { mat4 } from "../math/Mat4.js"

export class Camera {
  constructor({
    x = 0, y = 0, z = 0,
    yaw = 0, pitch = 0,
    pitchMin = - Math.PI*0.5 + 0.01,
    pitchMax = Math.PI*0.5 - 0.01,
    sensitivity = 0.005,
    up = new vec3(0, 1, 0),
    speed = 400
  } = {}) {
    this.pos = new vec3(x, y, z);
    this.yaw = yaw;
    this.pitch = pitch;
    this.pitchMin = pitchMin;
    this.pitchMax = pitchMax;
    this.sensitivity = sensitivity;
    this.speed = speed;
    
    this.up = up;
    this.forward = new vec3(0, 0, -1);
    this.forwardHorizontal = new vec3(0, 0, -1);
    this.right = new vec3(1, 0, 0);
    this.cameraUp = new vec3(0, 1, 0);
    this.target = new vec3();
    this.move = new vec3();
    
    this.viewMatrix = mat4.identity();
  }
  
  update(dt) {
    this.viewMatrix.setIdentity();
    
    const sinYaw = Math.sin(this.yaw);
    const cosYaw = Math.cos(this.yaw);
    const sinPitch = Math.sin(this.pitch);
    const cosPitch = Math.cos(this.pitch);
    
    this.forward.x = sinYaw * cosPitch; 
    this.forward.y = sinPitch;
    this.forward.z = - cosYaw * cosPitch;
    
    this.forwardHorizontal.x = sinYaw;
    this.forwardHorizontal.y = 0;
    this.forwardHorizontal.z = - cosYaw;
    
    this.right.x = cosYaw;
    this.right.y = 0;
    this.right.z = sinYaw;
    
    this.pos.x += (this.right.x * this.move.x - this.forwardHorizontal.x * this.move.z) * this.speed * dt;
    this.pos.y += this.move.y * this.speed * dt;
    this.pos.z += (this.right.z * this.move.x - this.forwardHorizontal.z * this.move.z) * this.speed * dt;
    
    this.pos.add(this.forward, this.target);
    
    mat4.lookAt(this.viewMatrix, this.target, this.pos, this.up, this.cameraUp, this.forward, this.right);
    
  }
  
  rotate(dx, dy) {
    this.yaw += dx * this.sensitivity;
    this.pitch -= dy * this.sensitivity;
    this.pitch = Math.max(this.pitchMin, Math.min(this.pitchMax, this.pitch));
  }
  
}