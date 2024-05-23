import * as CANNON from './cannon-es.js'
import * as THREE from './three.module.js'
import { scene   } from './initThree.js'
import { GLTFLoader } from './GLTFLoader.js';
import CannonDebugger from './cannon-es-debugger.js'
import { initPointerLock } from './initPointerLock.js'
import dat from './dat.gui.module.js';
import { cartoonize } from './cartoonize.js';
import { cartoonizeRigid } from './cartoonizeRigid.js';
import { playerCannonBody } from "./toCannon.js"
import { toCannon } from './toCannon.js';
import { animate } from './animate.js'

export let playerThreeMesh,mixer,world,playerCannonShape,physicsMaterial = [] ,cannonDebugger , rigidMeshes = [] , animatedBodies = [], animatedMeshes = [],OriginalrigidMeshes = [],initPosition = [] , initQuaternion = [],solidMeshes = [],CannonBody = 'let [a, b] = args;return a + b' , materialName = "rigid"  


export function initCannon() {

  world = new CANNON.World()
  world.allowSleep = true
  world.defaultContactMaterial.contactEquationStiffness = 1e9
  world.defaultContactMaterial.contactEquationRelaxation = 4
  const solver = new CANNON.GSSolver()
  solver.iterations = 7
  solver.tolerance = 0.1
  world.solver = new CANNON.SplitSolver(solver)
  world.gravity.set(0, -9.82 , 0)
  
  physicsMaterial = new CANNON.Material('physics')
  const physics_physics = new CANNON.ContactMaterial(physicsMaterial, physicsMaterial, {
    contactEquationRelaxation: 3,
    contactEquationStiffness: 1e7,
    friction: 0.3,
    frictionEquationRelaxation: 3,
    frictionEquationStiffness: 1e7,
    restitution: 0.4,
  })

  // We must add the contact materials to the world
  world.addContactMaterial(physics_physics)

  
  let floorBody
  //floorBody = toCannon(floor,CannonBody, materialName="solid")

  //gridHelper
  //var gridHelper = new THREE.GridHelper( 40, 40 );scene.add( gridHelper ) 
  const startButton = document.getElementById('start_button')

  const loader = new GLTFLoader().setPath('./assets/models/');
    loader.load('pvc.glb',   (gltf) => {
      if (gltf) (startButton.style.display = "block")
        //if (gltf) (animate())
      mixer = new THREE.AnimationMixer( gltf.scene );
      let clips = gltf.animations;
      clips.forEach(clip => {
       let action = mixer.clipAction(clip)
       action.play()
     })


     
     //scene.add(gltf.scene)
gltf.scene.children.forEach((object) => {
  if (object.isMesh ) { 
   if (object.material.name == "rigid"  || object.material.name == "animated") {
    OriginalrigidMeshes.push(object);
      if (object.material.name == "animated") animatedMeshes.push(object)
      if (object.name == "ball") playerThreeMesh = object
      toCannon(object,CannonBody, materialName="rigid") 
    }
   else {
      solidMeshes.push(object);
      toCannon(object,CannonBody, materialName="solid") 
   }
  }

    })

    if (solidMeshes.length > 0) cartoonize(solidMeshes) 
    if (OriginalrigidMeshes.length > 0) cartoonizeRigid(OriginalrigidMeshes)


       //cannonDebugger = new CannonDebugger(scene, world, {color: "red"})
       const gui_Object = {
        floorBody: false,
        updateCannonDebugger: false,
        //floorMesh : false,
        x: 1, 
        y: 1, 
        z: 1,
      }

      let gui = new dat.GUI();
      gui.width = 200;
      gui.hide();


      gui.close();


      //gui.add( gui_Object, 'floorMesh' ).onChange( value => {  value ? scene.add(floor) : scene.remove(floor)           } ) 
      gui.add( gui_Object, 'floorBody' ).onChange( value => {  value == true ?  floorBody = toCannon(floor,CannonBody, materialName="solid") : world.removeBody(floorBody)       } ) 
      gui.add( gui_Object, 'updateCannonDebugger' ).onChange( value => { 
        value == true ? cannonDebugger = new CannonDebugger(scene, world, {color: "red"})  : null ;
        

      } ) 
      gui.add( gui_Object, 'x', -1000, 1000, 1 ).onChange( value => {   playerCannonBody.position.x = value       } ) 
      gui.add( gui_Object, 'y', -1000, 1000, 1 ).onChange( value => {   playerCannonBody.position.z = value       } ) 
      gui.add( gui_Object, 'z', -1000, 1000, 1 ).onChange( value => {   playerCannonBody.position.y = value       } ) 



       initPointerLock()
       animate()
        })  // end loader load function
   

    



   






}