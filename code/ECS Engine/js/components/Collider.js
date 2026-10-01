import Component from "../ecs/Component.js"

export default class Collider extends Component {
  
  constructor(w = 16, h = 16, bodyData = {shape: "rect"}) {
    super();
    this.w = w;
    this.h = h;
    this.bodyData = bodyData;
  }
  
}