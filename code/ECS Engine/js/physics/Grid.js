export default class Grid {
  constructor(cellSize = 64) {
    this.cellSize = cellSize;
    this.cells = new Map();
  }
  
  _cellCoords(x, y) {
    return [
      Math.floor(x / this.cellSize),
      Math.floor(y / this.cellSize)
    ];
  }
  
  _key(x, y) {
    return `${x}, ${y}`;
  }
  
  clear() {
    this.cells.clear();
  }
  
  insert(entity) {
    const col = entity.get("Collider");
    const pos = entity.get("Position").pos;
    const [x, y] = [pos.x, pos.y];
    const bounds = {
      minX: Math.floor(x / this.cellSize),
      minY: Math.floor(y / this.cellSize),
      maxX: Math.floor((x + col.w) / this.cellSize),
      maxY: Math.floor((y + col.h) / this.cellSize)
    };
    
    for(let i = bounds.minX; i <= bounds.maxX; i++) {
      
      for(let j = bounds.minY; j <= bounds.maxY; j++) {
        
        
        const key = this._key(i, j);
        if(!this.cells.has(key)) {
          this.cells.set(key, new Set());
        }
        
        this.cells.get(key).add(entity);
        
      }
      
    }
    /*
    const [cx, cy] = this._cellCoords(x, y);
    const key = this._key(cx, cy);
    if(!this.cells.has(key)) {
      this.cells.set(key, new Set());
    }
    
    this.cells.get(key).add(entity);
    */
  }
  
  query(x, y) {
    const [cx, cy] = this._cellCoords(x, y);
    
    const result = [];
    for(let dx = -1; dx <= 1; dx++) {
      for(let dy = -1; dy <= 1; dy++) {
        const key = this._key(cx + dx, cy + dy);
        
        const cell = this.cells.get(key);
        if(!cell) continue;
        
        for(const e of cell) {
          result.push(e);
        }
        
      }
    }
    
    return result;
    
  }
  
}