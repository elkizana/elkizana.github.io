import * as THREE from './three.module.js'
import * as CANNON from './cannon-es.js'
import { playerCannonBody} from './toCannon.js'
import { playerThreeMeshFullGroup} from './cartoonizeRigid.js'
import {OriginalrigidMeshes,world,CannonBody,materialName} from './initCannon.js'
import {rigidBodies} from "./toCannon.js"
import { toCannon, emptyRigidBodies } from './toCannon.js';
import { startTimer,resetStopWatch, stopTimer,StopWatchTime,addTextGeometry} from './stopwatch.js'

function startEvent() {
  startSound.play()
  
}

document.addEventListener('keydown', startEvent, { once: true });



let allowStartSound = true
let allowEndSound = true
let allowRKey = true 
let allowReset = true 
    const listener = new THREE.AudioListener()
    const audioLoader = new THREE.AudioLoader();
    

    const startSound = new THREE.PositionalAudio( listener );
    audioLoader.load( './assets/sounds/start.mp3', function( buffer ) {
      startSound.setBuffer( buffer );
      startSound.setRefDistance( 50 );
    });



    const ballCollisionSound = new THREE.PositionalAudio( listener )
    audioLoader.load( './assets/sounds/ball_collision.mp3', function( buffer ) {
      ballCollisionSound.setBuffer( buffer );
      ballCollisionSound.setRefDistance( 3 );
      if (playerThreeMeshFullGroup) playerThreeMeshFullGroup.add(ballCollisionSound)
    });


    const initPos = []
    
function reInitiate () { 
  
      rigidBodies.forEach((body) => {
        world.removeBody(body )
          })

      emptyRigidBodies()

      OriginalrigidMeshes.forEach((mesh) => {
        if (mesh.name != "ball" ) toCannon(mesh,CannonBody, materialName,  true) 
      })

}  


class PointerLockControlsCannon extends THREE.EventDispatcher {
  constructor(camera, cannonBody,playerThreeMeshFullGroup) {
    super()
    

if (isMobile()) {
    this.cameraNipple = nipplejs.create({
      zone: document.getElementById('cameraNippleDynamic'),
      mode: 'dynamic',
     // position: {right: '10%', top: '90%'},
      color: 'red',
      size : "150",
      
    });

    this.moveCameraHandler = this.moveCameraHandler.bind(this);
    this.cameraNipple.on('move', this.moveCameraHandler);

  }

   this.movementNipple = nipplejs.create({
    zone: document.getElementById('movementNippleDynamic'),
    mode: 'dynamic',
    //position: {left: '10%', top: '80%'},
    color: '#2db8bd',
    size : "110",
    //distance : "80"
    
  });


  this.moveMovementHandler = this.moveMovementHandler.bind(this);
  this.movementNipple.on('move', this.moveMovementHandler);

  this.endMovementHandler = this.endMovementHandler.bind(this);
  this.movementNipple.on('end', this.endMovementHandler); 

  
    this.enabled = false
    this.cannonBody = cannonBody
    this.cannonBody.linearDamping = 0.5 ;
    this.cannonBody.angularDamping = 0.5
    this.playerThreeMesh = playerThreeMeshFullGroup
    
    //let eyeYPos = .1 // eyes are 2 meters above the ground
    this.velocityFactor = 0.12  
    this.jumpVelocity = 6
    this.velocity = this.cannonBody.velocity
    this.pitchObject = new THREE.Object3D()
    this.pitchObject.add(camera)

    this.yawObject = new THREE.Object3D()
    this.yawObject.position.y = 2
    this.yawObject.add(this.pitchObject)

    this.quaternion = new THREE.Quaternion()


    this.moveForward = false
    this.moveBackward = false
    this.moveLeft = false
    this.moveRight = false

    this.canJump = false

    const contactNormal = new CANNON.Vec3() // Normal in the contact, pointing *out* of whatever the player touched
    const upAxis = new CANNON.Vec3(0, 1, 0)
    //const downAxis = new CANNON.Vec3(0, 1, 0)
    
    camera.add( listener );



    let end =  {
      "x": -608.9170532226562,
      "y": -84.71146392822266,
      "z": 1007.2328491210938
  }

    this.cannonBody.addEventListener('collide', (event) => {
              if (event.contact.bj.mass == 10 && allowReset ) { 
                setTimeout(() => {
                  allowReset = false
                  reInitiate()  
                }, 100);
                  
                
                setTimeout(() => {
                  allowReset = true 
                }, 2000);
                }
                
              if (event.contact.bj.position.x == end.x && allowEndSound ) { 
                startSound.play()
                allowEndSound = false
                stopTimer()
                addTextGeometry("Finished in : " + StopWatchTime )
              }
              
           const { contact } = event
           const relativeVelocity = event.contact.getImpactVelocityAlongNormal();
           
            if( Math.abs(relativeVelocity) >   1 ) {
              
              ballCollisionSound.setVolume( relativeVelocity / 10);
               
              this.playerThreeMesh.add(ballCollisionSound)
              if (!ballCollisionSound.isPlaying )  ballCollisionSound.play()
            }


      // contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
      // We do not yet know which one is which! Let's check.
      if (contact.bi.id === this.cannonBody.id) {
        //console.log( relativeVelocity , "contact 1 ")
        // bi is the player body, flip the contact normal
        contact.ni.negate(contactNormal)
      } else {
        // bi is something else. Keep the normal as it is
        contactNormal.copy(contact.ni)
       


      }

      // If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
      if (contactNormal.dot(upAxis) > 0.5) {
        // Use a "good" threshold value between 0 and 1 here!
        this.canJump = true
      }
      


    })


    // Moves the camera to the cannon.js object position and adds velocity to the object if the run key is down
    this.inputVelocity = new THREE.Vector3()
    this.euler = new THREE.Euler()

    this.lockEvent = { type: 'lock' }
    this.unlockEvent = { type: 'unlock' }

    this.connect()
  }
  
  
  connect() {
    document.addEventListener('pointermove', this.onMouseMove)
    document.addEventListener('pointerlockchange', this.onPointerlockChange)
    document.addEventListener('pointerlockerror', this.onPointerlockError)
    document.addEventListener('keydown', this.onKeyDown)
    document.addEventListener('keyup', this.onKeyUp)


    /* document.getElementById('up-button').addEventListener('touchmove', () =>{ this.moveForward = true;provideHapticFeedback() } );
    document.getElementById('up-button').addEventListener('touchend', () => {this.moveForward = false;   });
    document.getElementById('up-right-button').addEventListener('touchmove', () => {this.moveForward = true;this.moveRight = true;provideHapticFeedback() });
    document.getElementById('up-right-button').addEventListener('touchend', () => {this.moveForward = false;this.moveRight = false;  });
    document.getElementById('up-left-button').addEventListener('touchmove', () => {this.moveForward = true;this.moveLeft = true; provideHapticFeedback() });
    document.getElementById('up-left-button').addEventListener('touchend', () => {this.moveForward = false;this.moveLeft = false; });
    document.getElementById('down-button').addEventListener('touchmove', () => {this.moveBackward = true; provideHapticFeedback()});
    document.getElementById('down-button').addEventListener('touchend', () => {this.moveBackward = false ; } );
    document.getElementById('down-right-button').addEventListener('touchmove', () => {this.moveBackward = true;this.moveRight = true; provideHapticFeedback() });
    document.getElementById('down-right-button').addEventListener('touchend', () => {this.moveBackward = false;this.moveRight = false;  });
    document.getElementById('down-left-button').addEventListener('touchmove', () => {this.moveBackward = true;this.moveLeft = true; provideHapticFeedback() });
    document.getElementById('down-left-button').addEventListener('touchend', () => {this.moveBackward = false;this.moveLeft = false;  });
    document.getElementById('left-button').addEventListener('touchmove', () => {this.moveLeft = true; provideHapticFeedback() });
    document.getElementById('left-button').addEventListener('touchend', () => {this.moveLeft = false ; } );
    document.getElementById('right-button').addEventListener('touchmove', () => {this.moveRight = true ; provideHapticFeedback() });
    document.getElementById('right-button').addEventListener('touchend', () => {this.moveRight = false ; } ); */



  }

  disconnect() {
    document.removeEventListener('pointermove', this.onMouseMove)
    document.removeEventListener('pointerlockchange', this.onPointerlockChange)
    document.removeEventListener('pointerlockerror', this.onPointerlockError)
    document.removeEventListener('keydown', this.onKeyDown)
    document.removeEventListener('keyup', this.onKeyUp)
  }

  dispose() {
    this.disconnect()
  }

  lock() {
    document.body.requestPointerLock()
  }

  unlock() {
    document.exitPointerLock()
  }

  onPointerlockChange = () => {
    if (document.pointerLockElement) {
      this.dispatchEvent(this.lockEvent)

      this.isLocked = true
    } else {
      this.dispatchEvent(this.unlockEvent)

      this.isLocked = false
    }
  }

  onPointerlockError = () => {
    console.error('PointerLockControlsCannon: Unable to use Pointer Lock API')
  }


  moveCameraHandler(evt, nipple) {
    let vector = nipple.vector;
    let movementX = vector.x;
    let movementY = vector.y;
    //console.log(nipple.angle);

    this.yawObject.rotation.y -= movementX * 0.042
    this.pitchObject.rotation.x += movementY * 0.042
    this.pitchObject.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitchObject.rotation.x))
  }


  moveMovementHandler(evt, nipple) {

    let direction = nipple.angle.degree;
    
if (nipple.force >= 0.4) {//console.log(nipple.force) 
  provideHapticFeedback() 
  if (direction > 70 && direction < 110) {  // forward
    this.moveForward = true;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false; 

   // console.log("forward  ")

  }
  else if (direction > 20 && direction < 70) { // forward right 
    this.moveForward = true;
    this.moveRight = true; 
    this.moveLeft = false;
    this.moveBackward = false;
  //  console.log("forward right ")
  }
  else if (direction > 110 && direction < 160) { // forward left
    this.moveForward = true;
    this.moveLeft = true;
    this.moveRight = false; 
    this.moveBackward = false;
    //console.log("forward left ")

  }

  else if (direction > 250 && direction < 290) {// Backward 
    this.moveBackward = true;
    this.moveForward = false;
    this.moveLeft = false;
    this.moveRight = false; 

    //console.log("backward ")

  } 
  else if (direction > 290 && direction < 340) {// Backward  right
    this.moveBackward = true;
    this.moveRight = true; 
    this.moveLeft = false;
    this.moveForward = false;
    //console.log("Backward  right ")

  } 

  else if (direction > 200 && direction < 250) {// Backward  left
    this.moveBackward = true;
    this.moveRight = false; 
    this.moveLeft = true;
    this.moveForward = false;
    //console.log("Backward  left ")

  } 
   else if (direction > 160 && direction < 200 && direction != 180) {
    // Left
    this.moveLeft = true;
    this.moveRight = false; 
    this.moveForward = false;
    this.moveBackward = false;

    //console.log("left ")

    
  } 
    else if (direction > 340 || direction < 20) {
    // Right
    this.moveRight = true; 
    this.moveLeft = false;
    this.moveForward = false;
    this.moveBackward = false;
    //console.log("Right ")

  } 
}else {
  this.moveForward = false;
  this.moveBackward = false;
  this.moveRight = false;
  this.moveLeft = false;
}
  }

  
  
   endMovementHandler(evt, nipple) {
        //console.log(nipple)
        this.moveForward = false;
        this.moveBackward = false;
        this.moveRight = false;
        this.moveLeft = false; 
    
      /*  const direction = nipple.angle.degree;
    
      if (direction >= 45 && direction < 135) {
        this.moveForward = false;
      } */
    
    
      } 

  
    onMouseMove = (event) => {
      if (!this.enabled) {
        return
      }
      const { movementX, movementY } = event
      //console.log(event)
      this.yawObject.rotation.y -= movementX * 0.002
      this.pitchObject.rotation.x -= movementY * 0.002
      this.pitchObject.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitchObject.rotation.x))

      
    }


  onKeyDown = (event) => {

    if (allowStartSound) startTimer()    
allowStartSound = false


    switch (event.code) {

      case 'KeyW'  :
      case 'ArrowUp':
      case 'ButtonW':

        this.moveForward = true
        break

      case 'KeyA':
      case 'ArrowLeft':
        this.moveLeft = true
        break

      case 'KeyS':
      case 'ArrowDown':
        this.moveBackward = true
        break

      case 'KeyD':
        case 'ArrowRight':
          this.moveRight = true
        break
        
        case 'KeyR':
          if (allowRKey) { 
          allowRKey = false
          allowStartSound = true
          allowEndSound = true
          reInitiate()
          document.addEventListener('keydown', startEvent, { once: true });
          this.cannonBody.velocity.set(0, 0, 0);
          this.cannonBody.position.set(0,2.2,0)
          resetStopWatch()
        }
          setTimeout(() => {
            allowRKey = true
          }, 2000);
        break

        /* case 'Enter':
        break
        */
       /*  case 'KeyE':
          playerCannonBody.position.y = playerCannonBody.position.y + 10 
        break
        case 'KeyY':
          playerCannonBody.position.z = playerCannonBody.position.z + 10 
        break

        case 'KeyX':
          playerCannonBody.position.x = playerCannonBody.position.x - 10 
        break  */

        case 'Space':
        if (this.canJump) {
          this.velocity.y = this.jumpVelocity
        }
        this.canJump = false
        break
    }
    //console.log(check)

  }

  onKeyUp = (event) => {
    
    switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
      case 'ButtonW':

        this.moveForward = false
        break

      case 'KeyA':
      case 'ArrowLeft':
        this.moveLeft = false
        break

      case 'KeyS':
      case 'ArrowDown':
        this.moveBackward = false
        break

      case 'KeyD':
      case 'ArrowRight':
        this.moveRight = false
        break
    }
  }

  getObject() {
    return this.yawObject
  }

  getDirection() {
    const vector = new CANNON.Vec3(0, 0, -1)
    vector.applyQuaternion(this.quaternion)
    return vector
  }

  update(delta) {
    

    if (this.enabled === false) {
      return
    }

    delta *= 950
    delta *= 0.1

    this.inputVelocity.set(0, 0, 0)
    
    if (this.moveForward) {
      

      this.inputVelocity.z = -this.velocityFactor * delta
      
    }
    if (this.moveBackward) {
      this.inputVelocity.z = this.velocityFactor * delta
    }

    if (this.moveLeft) {
      this.inputVelocity.x = -this.velocityFactor * delta
    }
    if (this.moveRight) {
      this.inputVelocity.x = this.velocityFactor * delta
    }

    // Convert velocity to world coordinates
    this.euler.x = this.pitchObject.rotation.x
    this.euler.y = this.yawObject.rotation.y
    this.euler.order = 'XYZ'
    this.quaternion.setFromEuler(this.euler)
    this.inputVelocity.applyQuaternion(this.quaternion)

    // Add to the object
    this.velocity.x += this.inputVelocity.x
    this.velocity.z += this.inputVelocity.z
    //console.log(this.velocity)


    //this.velocity.y += this.inputVelocity.y

    if (this.playerThreeMesh && this.cannonBody) { 
      this.yawObject.position.copy(this.cannonBody.position)
        

      //this.yawObject.position.copy(this.cannonBody.position)

      this.playerThreeMesh.position.copy(this.cannonBody.position)
        this.playerThreeMesh.quaternion.copy(this.cannonBody.quaternion)
    

  }
    
    // up the camera so it with head 
    //this.yawObject.position.y += 1
    //this.yawObject.position.x -= 2
    //this.yawObject.position.z += 1 

  }
}

export { PointerLockControlsCannon }