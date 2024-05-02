import {  renderer, scene, camera} from "./initThree.js"
import {  controls} from "./initPointerLock.js"
import { world  , cannonDebugger, mixer, animatedMeshes, animatedBodies} from "./initCannon.js"
import { fullGroupAnimated,fullGroupRigid } from "./cartoonizeRigid.js"
import {rigidBodies} from "./toCannon.js"
const timeStep = 1 / 60
let lastCallTime = performance.now()

 export function animate() {

  //stats.begin();

     

    const time = performance.now() / 1000
    const dt = time - lastCallTime
    lastCallTime = time
    
    if (controls.enabled) {


      if (mixer) { 
        mixer.update(timeStep)
      }

      world.step(timeStep, dt)
      
 
     
     if (rigidBodies.length > 0){ 
      //console.log(rigidBodies.length)
        for (let i = 0; i < rigidBodies.length; i++) {
        fullGroupRigid[i].position.copy(rigidBodies[i].position)
        fullGroupRigid[i].quaternion.copy(rigidBodies[i].quaternion)
      }  
    
    }
    
    if (animatedMeshes.length > 0){ 

        for (let i = 0; i < animatedMeshes.length; i++) {
        
        animatedBodies[i].position.copy(animatedMeshes[i].position)
        animatedBodies[i].quaternion.copy(animatedMeshes[i].quaternion)
    
        fullGroupAnimated[i].position.copy(animatedMeshes[i].position)
        fullGroupAnimated[i].quaternion.copy(animatedMeshes[i].quaternion)
        }
  }
       cannonDebugger ?   cannonDebugger.update()  : null 
  
       renderer.render(scene, camera)
      controls.update(dt)

       
  }

    requestAnimationFrame(animate)
    
    
    //stats.end()


    
   
  }