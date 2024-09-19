

import { threeToCannon, ShapeType } from './three-to-cannon.esm.js';
import * as CANNON from './cannon-es.js'
import {physicsMaterial,world,animatedBodies}  from './initCannon.js'

export let playerCannonBody , rigidBodies = []

export function emptyRigidBodies() { 
    rigidBodies = []
}

export function toCannon(mesh,body, materialName  ) { 
    
    let result
    
    if (  mesh.name.startsWith("Sphere") )  {
                result = threeToCannon(mesh ,{type: ShapeType.SPHERE})   
    }   
    else if (  mesh.name.startsWith("ball") )  {
                result = threeToCannon(mesh ,{type: ShapeType.SPHERE})   
    }   
    else if (  mesh.name.startsWith("Cylinder") ||  mesh.name.startsWith("jumper")   )  {
                result = threeToCannon(mesh ,{type: ShapeType.CYLINDER})   
    }  
  
     else if (  mesh.name.startsWith("kaaba") ||  mesh.name.startsWith("rigidkaaba") /* || mesh.material.name == "solidbox" */ )  {
                result = threeToCannon(mesh ,{type: ShapeType.BOX})   
    }   
     else {
                result = threeToCannon(mesh,{type: ShapeType.HULL})  
                //console.log("mesh.name",mesh.name)
                }


const {shape, offset, quaternion} = result;
mesh.material.name == "rigid" ? body = new CANNON.Body({   mass: 200, material: physicsMaterial })  : body = new CANNON.Body({ mass: 0, material: physicsMaterial }) 
if (mesh.name == "ball")            body.mass = 200
if (mesh.name.endsWith("gravity"))  body.mass = 200 
if (mesh.name.startsWith("kaaba"))  body.mass = 0
if (mesh.name.startsWith("end"))  body.name = "end"
if (mesh.name.startsWith("reset")) body.name = "reset"
if (mesh.name.startsWith("jumper")) body.name = "jumper"



body.addShape(shape, offset, quaternion);

body.position.copy(mesh.position)
    


world.addBody(body)


if (mesh.name != "ball" && mesh.name != "floor" && mesh.material.name == "rigid"   /* && mesh.name == 'clonedObject' */     ) {
     rigidBodies.push(body) 
}
else if (mesh.name == "ball"  ) {
    playerCannonBody = body
    body.allowSleep = false
}
else if (mesh.material.name == "animated") { 
    animatedBodies.push(body)   
}

/* else if (mesh.material.name == "reset") { 
    body.mass = 10
    body.name = "reset"

} */

return body


}
