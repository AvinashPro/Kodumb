import Vector from "../utils/Vector.js"
import createCanvas from "../utils/Canvas.js"
import Entity from "../ecs/Entity.js"
import Position from "../components/Position.js"
//import Velocity from "../components/Velocity.js"
import Body from "../components/Body.js"
import Sprite from "../components/Sprite.js"
import Collider from "../components/Collider.js"
import Input from "../components/Input.js"
import Animate from "../components/Animate.js"
import Camera from "../renderer/Camera.js"
import Scene from "../scene/Scene.js"
import Engine from "../core/Engine.js"
import Renderer from "../renderer/Renderer.js"
import PhysicsSystem from "../systems/PhysicsSystem.js"
//import CameraSystem from "../systems/CameraSystem.js"
import RenderSystem from "../systems/RenderSystem.js"
import InputSystem from "../systems/InputSystem.js"
import AnimationSystem from "../systems/AnimationSystem.js"
//import CollisionSystem from "../systems/CollisionSystem.js";
import AddComponentsToEntity from "../utils/AddComponents.js"
import Controller from "../utils/Controller.js"

import Grid from "../physics/Grid.js"
//import Joystick from "../utils/Joystick.js"

import Tilemap from "../utils/Tilemap.js"
import SceneManager from "../scene/SceneManager.js"
import SceneTransition from "../scene/SceneTransition.js"
// CREATING CANVAS
const canvas = createCanvas(Math.min(window.innerWidth, 800), 9 / 16 * Math.min(window.innerWidth, 800));
const ctx = canvas.getContext("2d");
const gameContainer = document.getElementById("game-container");
gameContainer.appendChild(canvas);


let controller_data = [
  [
    {
      name: "Left",
      id: "left-btn",
      _class: "game-btn"
    },
    {
      name: "Right",
      id: "right-btn",
      _class: "game-btn"
    },
    {
      name: "Down",
      id: "down-btn",
      _class: "game-btn"
    },
    {
      name: "Up",
      id: "up-btn",
      _class: "game-btn"
    }
  ],
  
  [
    {
      name: "Jump",
      id: "jump-btn",
      _class: "game-btn"
    }
  ],
  
  
];

const c1 = Controller(controller_data[0], "c1");
const c2 = Controller(controller_data[1], "c2");
gameContainer.appendChild(c1);
gameContainer.appendChild(c2);

//console.log(player.get("Input"))

// VARIABLES
/*let entities = [];

entities.push(
  new Entity(new Vector(100, 50), 10, 30)
);*/
const renderer = new Renderer(ctx);
const scene = new Scene();
const game_title_scene = new Scene();
//game_title_scene.blocksUpdate = true
const block = new Entity();
block.add(new Position(0, 50));
block.add(new Sprite({w:32, h:32, color:"#f04"}))
game_title_scene.world.addEntity(block)
game_title_scene.world.addSystem(new RenderSystem(renderer))
const sceneManager = new SceneManager();
sceneManager.push(game_title_scene);
const GRID = new Grid(32);

//setTimeout(() => {
  game_title_scene.transition = new SceneTransition({
    name: "fade",
    initialOpacity: 0,
    finalOpacity: 1,
    dur: 3,
    callback: function() {
      game_title_scene.transition = new SceneTransition({
        name: "fade",
        initialOpacity: 1,
        finalOpacity: 0,
        dur: 2,
        remove: true,
        callback: function() {
          sceneManager.push(scene);
        },
        callbackDelay: 0
      })
    },
    callbackDelay: 2
  });
//}, 1000)

scene.world.width = canvas.width;
scene.world.height = canvas.height;
scene.world.viewportWidth = canvas.clientWidth;
scene.world.viewportHeight = canvas.clientHeight;


const engine = new Engine(sceneManager, []);
engine.start();
const assets = engine.load({
  "tileset": {
    url: "assets/img/infinity.png",
    type: "Img",
    size: 3
  },
  "levels": {
    url: "assets/json/levels.json",
    type: "JSON",
    size: 25
  },
  "character": {
    url: "assets/img/player.png",
    type: "Img",
    size: 4
  },
  "logo": {
    url: "assets/img/logo4.jpg",
    type: "Img",
    size: 273
  }
}, callback);

function callback() {
  const tilemap = new Tilemap({
    pos: { x: 0, y: 0 },
    tileset: assets.get("tileset"),
    tileData: assets.get("levels")["level1"],
    columns: 50,
    tilesetSize: [11, 5],
    tileSize: 32,
    offset: 0,
    staticTiles: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55],
    collidableTiles: [1, 2, 3, 4, 5, 6, 7, 8, 16, 17, 18, 19, 27, 28, 29, 30, 34, 35, 36, 37, 38, 39, 40, 41, 45, 46, 47, 48, 49, 50, 51, 52]
  });
  
  tilemap.init2(scene.world);
  tilemap.entities.push(player, obstacle);
  scene.world.addTilemap(tilemap);
  
  
  
  
  player.get("Sprite").spritesheet = {
    img: assets.get("character"),
    dimension: [4, 2],
    hitbox: [[3, 2], [14, 16]],
    w: assets.get("character").width / 4,
    h: assets.get("character").height / 2
  };
  console.log(player.get("Sprite").spritesheet)
  //AddComponentsToEntity(
    scene.world.addComponent(player,
    
      new Animate({
        states: {
          "idle": [6],
          "run": [1, 2, 3, 2],
          "jump": [5],
          "shoot": [4]
        },
        time: 150
      })
    )
  //);
  //console.log(player.get("Animate"))
  scene.world.addSystem(new AnimationSystem());
  
  const logo = new Entity();
  const logoImg = assets.get("logo");
  AddComponentsToEntity(game_title_scene, logo, [
    new Position((canvas.clientWidth - 200) / 2, (canvas.clientHeight - 200 / logoImg.width * logoImg.height) / 2),
    new Sprite({
      img: logoImg,
      w: 200,
      h: 200 / logoImg.width * logoImg.height
    })
  ])
    //time: 500
  //}));
  
}

//function GAME() {

const player = new Entity();
const player_comps = [
  new Position(50, 0),
  //new Velocity(20, 0),
  new Sprite({
    w: 16,
    h: 22,
    color: "rgba(236,240,193,0.5)"
    
  }),
  new Collider(16, 22),
  new Body({
    vel: new Vector(0, 0),
    gravityScale: 0.1, // 0.1
    type: "Kinematic",
    jumpForce: 250
  }),
  new Input({
    "jump": {
      id: "jump-btn",
      keys: [67, 32]
    },
    "left": {
      id: "left-btn",
      keys: [12, 13]
    },
    "right": {
      id: "right-btn",
      keys: []
    },
    "up": {
      id: "up-btn",
      keys: []
    },
    "down": {
      id: "down-btn",
      keys: []
    }
  })
];
AddComponentsToEntity(scene, player, player_comps);

const obstacle = new Entity();
const obstacle_comps = [
  new Position(200, 300),
  //new Velocity(-10, -40),
  new Sprite({
    w: 25,
    h: 25,
    color: "green"
  }),
  new Collider(25, 25),
  new Body({
    vel: new Vector(60, 0),
    friction: 0,
    gravityScale: 0.05
  })
];
AddComponentsToEntity(scene, obstacle, obstacle_comps);

const platform = new Entity();
const platform_comps = [
  new Position(-100, 150),
  new Sprite({
    w: 300,
    h: 10,
    color: "rgba(12,79,180)"
  }),
  new Collider(300, 10),
  new Body({
    type: "Static"
  })
];
AddComponentsToEntity(scene, platform, platform_comps);

const platform2 = new Entity();
const platform2_comps = [
  new Position(235, 140),
  new Sprite({
    w: 300,
    h: 20,
    color: "rgb(12,79,180)"
  }),
  new Collider(300, 20),
  new Body({
    type: "Static"
  })
];
AddComponentsToEntity(scene, platform2, platform2_comps);


const slopeTile = new Entity();
const slopeTile_comps = [
  new Position(-100, 134),
  new Sprite({
    w: 120,
    h: 16,
    color: "rgb(12,189,250)"
  }),
  new Collider(120, 16, {
    shape: "Slope",
    slopeData: [12, 0]
  }),
  new Body({
    type: "Static"
  })
];
AddComponentsToEntity(scene, slopeTile, slopeTile_comps);
//scene.world.addComponent(obstacle, new Position(200, 250));
//scene.world.addComponent(obstacle, new Velocity(-10, -40))
//scene.world.addComponent(obstacle, new Sprite(5, 5, "#09f"))
//scene.world.addComponent(obstacle, new Collider(5, 5))
scene.world.addEntity(player);
scene.world.addEntity(obstacle);
scene.world.addEntity(platform);
scene.world.addEntity(platform2)
scene.world.addEntity(slopeTile);

const camera = new Camera(0, 0);
camera.follow(player);
scene.world.camera = camera;

scene.world.addSystem(new PhysicsSystem(GRID));
//scene.world.addSystem(new CollisionSystem(GRID));
//scene.world.addSystem(new CameraSystem());
scene.world.addSystem(new InputSystem());
//scene.world.addSystem(new AnimationSystem());
scene.world.addSystem(new RenderSystem(renderer));

console.log(engine)




//}
//renderer.fill("#09f")


//setTimeout(() => {
  //engine.stop()
  /*let col = player.get("Collider");
  let hDiff = col.h - 10;
  col.h = 10;
  player.get("Position").pos.y += hDiff;*/
  //camera.follow(obstacle)
//}, 4000)
/*
const joystick = new Joystick({
  parent: gameContainer
});
joystick.init()*/
//gameContainer.appendChild(joystick);
//console.log(joystick)
