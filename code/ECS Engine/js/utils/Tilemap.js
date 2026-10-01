import createCanvas from "../utils/Canvas.js"

export default class Tilemap {
  
  constructor({tileData, tileset, tilesetSize, tileSize, chunkSize = 16, staticTiles = [], pos, offset = 0, entities = [], collidableTiles = [], columns = 16}) {
    this.pos = pos;
    this.tileData = tileData;
    this.tileset = tileset;
    this.tilesetSize = tilesetSize;
    this.tileSize = tileSize;
    
    this.rows = this.tileData[0].length / columns;
    this.columns = columns;
    
    this.chunks = new Map();
    this.chunkSize = chunkSize;
    this.chunkGridColumns = Math.ceil(this.columns / this.chunkSize);
    this.chunkGridRows = Math.ceil(this.rows / this.chunkSize);
    this.queue = [];
    
    this.size = tileset.width / tilesetSize[0];
    
    // offset is used to remove weird lines (if any)
    this.offset = offset;
    
    this.staticTiles = staticTiles;
    this.collidableTiles = collidableTiles;
    
    this.entities = entities;
    
    this.sw = this.tileset.width / this.tilesetSize[0];
    this.sh = this.tileset.height / this.tilesetSize[1];
    this.chunksGenerated = 0;
  }
  
  generateChunk(x, y) {
    this.chunksGenerated++;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.height = this.chunkSize * this.tileSize;
    
    for(const layer of this.tileData) {
      
      let rInitial = y * this.chunkSize;
      let cInitial = x * this.chunkSize;
      for(let rIdx = rInitial; rIdx < rInitial + this.chunkSize; rIdx++) {
        for(let cIdx = cInitial; cIdx < cInitial + this.chunkSize; cIdx++) {
          
          let val = layer[rIdx * this.columns + cIdx];
          let sx = Math.floor((val -1)% this.tilesetSize[0]) * this.sw;
          let sy = Math.floor((val -1) / this.tilesetSize[0]) * this.sh;
          let localX = (cIdx % this.chunkSize) * this.tileSize;
          let localY = (rIdx % this.chunkSize) * this.tileSize;
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(this.tileset, sx, sy, this.sw, this.sh, localX - this.offset/2, localY - this.offset/2, this.tileSize + this.offset, this.tileSize + this.offset);
          
        }
      }
      
    }
    
    return canvas;
    
  }
  
  isChunkLoaded(x, y) {
    if(!this.chunks.has(x)) return false;
    const column = this.chunks.get(x);
    if(!column.has(y)) return false;
    return true;
  }
  
  init2(world) {
    let camera = world.camera;
    if(camera) {
      this.cameraPos = camera.pos;
    } else {
      this.cameraPos = {
        x: 0,
        y: 0
      };
    }
    
    this.canvasWidth = world.viewportWidth;
    this.canvasHeight = world.viewportHeight;
    this.chunkLength = this.chunkSize * this.tileSize;
    
    let range = this.getViewportChunksCoordsRange();
    for(let x = range[0]; x < range[1]; x++) {
      for(let y = range[2]; y < range[3]; y++) {
        this.saveChunk(x, y, this.generateChunk(x, y));
      }
    }
    
  }
  
  getViewportChunksCoordsRange() {
    let minX = Math.floor((this.cameraPos.x - this.canvasWidth / 2) / this.chunkLength),
    maxX = Math.ceil((this.cameraPos.x + this.canvasWidth / 2) / this.chunkLength),
    minY = Math.floor((this.cameraPos.y - this.canvasHeight / 2) / this.chunkLength),
    maxY = Math.ceil((this.cameraPos.y + this.canvasHeight / 2) / this.chunkLength);
    
    if(minX < 0) minX = 0;
    if(minY < 0) minY = 0;
    
    return [minX, maxX, minY, maxY];
  }
  
  saveChunk(x, y, chunk) {
    if(!this.chunks.has(x)) this.chunks.set(x, new Map());
    const column = this.chunks.get(x);
    column.set(y, chunk);
  }
  
  queryChunks() {
    let range = this.getViewportChunksCoordsRange();
    let result = [];
    for(let x = range[0]; x < range[1]; x++) {
      for(let y = range[2]; y < range[3]; y++) {
        if(this.isChunkLoaded(x, y)) result.push([x * this.chunkLength + this.pos.x, y * this.chunkLength + this.pos.y, this.getChunk(x, y)]);
      }
    }
    return result;
  }
  
  getChunk(x, y) {
    return this.chunks.get(x).get(y);
  }
  
  update() {
    let [minX, maxX, minY, maxY] = this.getViewportChunksCoordsRange();
    let offset = 0;
    minX -= offset;
    maxX += offset;
    minY -= offset;
    maxY += offset;
    if(minX < 0) minX = 0;
    if(minY < 0) minY = 0;
    
    for(let x = minX; x < maxX; x++) {
      for(let y = minY; y < maxY; y++) {
        if(!this.isChunkLoaded(x, y)) this.queue.push([x, y]);
      }
    }
    
    if(this.queue.length != 0) {
      let chunkCoords = this.queue.pop();
      this.saveChunk(chunkCoords[0], chunkCoords[1], this.generateChunk(chunkCoords[0], chunkCoords[1]));
    }
    
  }
  
  init(playerPos) {
    
    this.playerPos = playerPos;
    
    let i = Math.ceil(this.columns / this.chunkSize);
    let j = Math.ceil(this.rows / this.chunkSize);
    //console.log("hello")
    const canvases = [];
    const ctxs = []
    for(let r = 0; r < j; r++) {
      canvases.push([]);
      ctxs.push([]);
      for(let c = 0; c < i; c++) {
        
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        
        canvas.height = this.chunkSize * this.tileSize;
        canvas.width = this.chunkSize * this.tileSize;
        canvases[r].push(canvas)
        ctxs[r].push(ctx);
      }
    }
    
  //  let k = []
    this.tileData.forEach(layer => {
      layer.forEach((val, idx) => {
      //  row.forEach((val, cIdx) => {
          let rIdx = Math.floor(idx / this.columns);
          let cIdx = idx % this.columns;
      //    if(this.staticTiles.includes(val)) {
            
            
            let r = Math.floor(rIdx / this.chunkSize);
            let c = Math.floor(cIdx / this.chunkSize);
           // k.push(`${r}${c}`)
            
          
            
            let sw = this.tileset.width / this.tilesetSize[0];
            let sh = this.tileset.height / this.tilesetSize[1];
            let sx = Math.floor((val -1)% this.tilesetSize[0]) * sw;
            let sy = Math.floor((val -1) / this.tilesetSize[0]) * sh;

            let localX = (cIdx % this.chunkSize) * this.tileSize;
            let localY = (rIdx % this.chunkSize) * this.tileSize;
            let canvas = canvases[r][c];
            ctxs[r][c].imageSmoothingEnabled = false;
            ctxs[r][c].drawImage(this.tileset, sx, sy, sw, sh, localX - this.offset/2, localY - this.offset/2, this.tileSize + this.offset, this.tileSize + this.offset);

          //this.chunks.push(canvas);
            
            //console.log(canvas[r][c])
            
       //   }
          
       // })
      })
    })
    
    //console.log(canvases,canvases.length)
    
    this.chunks = canvases;
    /*canvases.forEach(rC => {
      rC.forEach(canvas => {
        this.chunks.push(canvas);
      })
    })*/
    
    //this.chunks = canvases;
   // console.log(k)
  }
  
}