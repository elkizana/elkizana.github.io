

import { threeToCannon, ShapeType } from './three-to-cannon.esm.js';
import * as CANNON from './cannon-es.js'
import {physicsMaterial,world,CannonBody,rigidMeshes,playerThreeMesh,animatedBodies}  from './initCannon.js'

export let playerCannonBody , rigidBodies = []

export function emptyRigidBodies() { 
    rigidBodies = []
}

export function toCannon(mesh,body, materialName  ) { 
    
    let result
    
    //result = threeToCannon(mesh ,{type: ShapeType.BOX})   
    
    if (  mesh.name.startsWith("Sphere") )  {
                result = threeToCannon(mesh ,{type: ShapeType.SPHERE})   
    }   
    else if (  mesh.name.startsWith("ball") )  {
                result = threeToCannon(mesh ,{type: ShapeType.SPHERE})   
    }   
    else if (  mesh.name.startsWith("Cylinder") )  {
                result = threeToCannon(mesh ,{type: ShapeType.CYLINDER})   
    }  
     else if (  mesh.name.startsWith("kaaba") ||  mesh.name.startsWith("rigidkaaba") )  {
                result = threeToCannon(mesh ,{type: ShapeType.BOX})   
    }   
     else {
                result = threeToCannon(mesh,{type: ShapeType.HULL})  
                }


const {shape, offset, quaternion} = result;
mesh.material.name == "rigid" ? body = new CANNON.Body({   mass: 5, material: physicsMaterial })  : body = new CANNON.Body({ mass: 0, material: physicsMaterial }) 
if (mesh.name == "ball")            body.mass = 6
if (mesh.name.endsWith("gravity"))  body.mass = 50 
if (mesh.name.startsWith("kaaba"))  body.mass = 0
body.addShape(shape, offset, quaternion);
body.position.copy(mesh.position)

world.addBody(body)


if (mesh.name != "ball" && mesh.name != "floor" && mesh.material.name == "rigid"/*  && body.mass != 0 */   ) {
     rigidBodies.push(body) 
}
else if (mesh.name == "ball"  ) {
    playerCannonBody = body
    body.allowSleep = false
}
else if (mesh.material.name == "animated") { 
    animatedBodies.push(body)   
}

return body


}
