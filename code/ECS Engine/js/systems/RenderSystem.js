import System from "../ecs/System.js"

export default class RenderSystem extends System {
  
  constructor(renderer) {
    super();
    this.renderer = renderer;
  }
  
  init(world) {
    this.query = world.createQuery("Position", "Sprite");
    const camera = world.camera;
    if(camera) {
      this.renderer.setCamera(camera);
    }
    
    /*
    const entities = this.query.entities;
    for(const e of entities) {
     const spritesheet = e.get("Sprite").spritesheet;
     if(spritesheet) {
       spritesheet.w = spritesheet.img.width / spritesheet.dimension[0];
       spritesheet.h = spritesheet.img.height / spritesheet.dimension[1];
     }
     
    }*/
    
  }
  
  update(world, dt) {
    
    
    
    const camera = world.camera;
    if(camera) {
      camera.update(dt);
      //this.renderer.setCamera(camera);
      //this.renderer.applyCamera();
    }
    
   if(world.id == 0) {
     this.renderer.clear();
     this.renderer.resetTransform();
   }
    
    const tilemap = world.tilemap;
    
    if(camera) this.renderer.applyCamera();
    if(tilemap) {
      tilemap.update();
      this.renderTilemap(tilemap);
      document.querySelector("#dev2").textContent = tilemap.chunksGenerated;
    }
    
    const entities = this.query.entities;
    entities.forEach(entity => {
      const pos = entity.get("Position").pos;
      const sprite = entity.get("Sprite");
      const collider = entity.get("Collider");
      const animate = entity.get("Animate")
      
    /* if(collider) {
        const bodyData = collider.bodyData
        if(bodyData.shape == "Slope") {
          this.renderer.slope(pos.x, pos.y + collider.h - bodyData.slopeData[0], pos.x + collider.w, pos.y + collider.h - bodyData.slopeData[1], sprite.color);
        //this.renderer.rect(pos.x, pos.y, sprite.w, sprite.h, "#f04");
        }
        
      }*/
     // else {
        
        //console.log(animate)
        if(!animate) {
          if(!sprite.img) {
            this.renderer.rect(pos.x, pos.y, sprite.w, sprite.h, sprite.color);
          } else {
            this.renderer.image2(sprite.img, 0, 0, sprite.img.width, sprite.img.height, pos.x, pos.y, sprite.w, sprite.h, "rgb(2,24,64)");
          }
        }
        else {
          //this.renderer.rect(pos.x - (sprite.w - collider.w)/2, pos.y -(sprite.h - collider.h)/2, sprite.w, sprite.h, "rgba(255,255,255,0.1)");
          //this.renderer.rect(pos.x, pos.y, collider.w, collider.h, "rgba(255,255,255,0.5)");
          //console.log(spritesheet)
          const spritesheet = sprite.spritesheet;
          const currentFrame = entity.get("Animate").currentFrame;
          
          if(currentFrame) {
            let hitbox = spritesheet.hitbox;
            let sx = ((currentFrame - 1) % spritesheet.dimension[0]) * spritesheet.w + hitbox[0][0];
            let sy = Math.floor((currentFrame - 1) / spritesheet.dimension[0]) * spritesheet.h + hitbox[0][1];
            let sw = hitbox[1][0] - hitbox[0][0];
            let sh = hitbox[1][1] - hitbox[0][1];
            
            //console.log(sx, sy)
            //console.log(sx, sy, sw, sh)
            this.renderer.image2(spritesheet.img, sx, sy, sw, sh, pos.x - (sprite.w - collider.w) / 2, pos.y - (sprite.h - collider.h), sprite.w, sprite.h);
          }
          
        }
        
        
        const transition = world.scene.transition;
    if(transition) {
      this.renderer[transition.type+"Transition"](transition);
    }
     // }
    })
    
    
    this.renderer.resetTransform();
    
  }
  
  
  renderTilemap(tilemap) {
    const chunkData = tilemap.queryChunks();
    for(const data of chunkData) {
      this.renderer.image(data[2], data[0], data[1]);
    }
    /*
    const chunks = tilemap.chunks;
    const chunkSize = tilemap.chunkSize;
    const tileSize = tilemap.tileSize;
    const pos = tilemap.pos;
    const playerPos = tilemap.playerPos;
    //const playerPos = tilemap.playerPos;
    //this.renderer.image(tilemap.chunks[10], 0, -20)
    let r = 0;
    let c = 0;
    //let cCount = 0;
    for(const rows of chunks) {
      let y = pos.y + chunkSize * tileSize * r;
      r++;
      for(const chunk of rows) {
        let x = pos.x + chunkSize * tileSize * c;
        c++;
        
        let w = tileSize * chunkSize;
        if(
          x + w < cameraPos.x - cw / 2 ||
          x > cameraPos.x + cw / 2 ||
          y + w < cameraPos.y - ch / 2 ||
          y > cameraPos.y + ch / 2
        ) {
          continue;
        }
        
        this.renderer.image(chunk, x, y);
        //cCount++;
      }
      c = 0;
    }*/
    
    //console.log(cCount);
    //document.getElementById("dev2").textContent = cCount+","+playerPos.x.toFixed(0)+","+playerPos.y.toFixed(0);
    
  }
  
  
  
}