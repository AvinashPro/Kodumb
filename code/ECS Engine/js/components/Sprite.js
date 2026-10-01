import Component from "../ecs/Component.js"

export default class Sprite extends Component {
  constructor({w = 16, h = 16, color = "#fff", spritesheet = null, img = null}) {
    super();
    this.w = w;
    this.h = h;
    this.color = color;
    this.spritesheet = spritesheet;
    this.img = img;
  }
  
  
}