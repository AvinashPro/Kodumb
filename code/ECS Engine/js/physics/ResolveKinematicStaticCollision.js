export default function ResolveKinematicStaticCollision(e1, e2, axis) {
  let kEntity = e1;
  let sEntity = e2;
  if(e2.get("Collider").type === "Kinematic") {
    kEntity = e2;
    sEntity = e1;
  }
  
  const kPos = kEntity.get("Position").pos;
  const kBody = kEntity.get("Body");
  const sPos = sEntity.get("Position").pos;
  const kCol = kEntity.get("Collider");
  const sCol = sEntity.get("Collider");
  
  let dx = kPos.x - kPos.oldX;
  let dy = kPos.y - kPos.oldY;
  
  if(axis) {
    if(dy > 0) {
      kPos.y = sPos.y - kCol.h;
      
      kBody.vel.y = 0;
      kBody.grounded = true;
      
    } else if(dy < 0) {
      kPos.y = sPos.y + sCol.h;
      //kEntity.get("Body").vel.y = 0;
    }
  } else {
    
    if(dx > 0) {
      kPos.x = sPos.x - kCol.w;
      if(sCol.bodyData.shape === "Slope") {
        kPos.y = (sCol.bodyData.slopeData[1] - sCol.bodyData.slopeData[0]) * (kPos.x + kCol.w - sPos.x) / sCol.w + sPos.y;
      }
    } else if(dx < 0) {
      if(sCol.bodyData.shape === "Slope") {
       // let s = sPos.y + sCol.h - ((sCol.bodyData.slopeData[0] - sCol.bodyData.slopeData[1]) * (2 * sPos.x + sCol.w - kPos.x) + sCol.bodyData.slopeData[1]) - kCol.h;
        let newY= -((sCol.bodyData.slopeData[1] - sCol.bodyData.slopeData[0]) / sCol.w * (kPos.x - sPos.x) + sCol.bodyData.slopeData[0]) + sPos.y + sCol.h;
        //console.log(newY - kCol.h)
        //kEntity.get("Body").vel.y = 0
        kPos.y = newY - kCol.h;
        //console.log(kPos.x, kPos.y)
        kEntity.get("Body").vel.y = 0;
      } else {
        
      kPos.x = sPos.x + sCol.w;
      }
    }
    
    
  }
  //console.log(dx, dy)
  
}