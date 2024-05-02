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


let rewind = 1
let allowStartSound = true
let allowEndSound = true
let allowRKey = true 

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

    this.enabled = false
    this.cannonBody = cannonBody
    this.cannonBody.linearDamping = 0.5 ;
    this.cannonBody.angularDamping = 0.5
    this.playerThreeMesh = playerThreeMeshFullGroup
    //let eyeYPos = .1 // eyes are 2 meters above the ground
    this.velocityFactor = 0.15
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
    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('pointerlockchange', this.onPointerlockChange)
    document.addEventListener('pointerlockerror', this.onPointerlockError)
    document.addEventListener('keydown', this.onKeyDown)
    document.addEventListener('keyup', this.onKeyUp)
  }

  disconnect() {
    document.removeEventListener('mousemove', this.onMouseMove)
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

  onMouseMove = (event) => {
    if (!this.enabled) {
      return
    }

    const { movementX, movementY } = event
    this.yawObject.rotation.y -= movementX * 0.002
    this.pitchObject.rotation.x -= movementY * 0.002
    this.pitchObject.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitchObject.rotation.x))
  }

  

  onKeyDown = (event) => {

    if (allowStartSound) startTimer()    
allowStartSound = false


    switch (event.code) {

      case 'KeyW':
      case 'ArrowUp':
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

        case 'Enter':
        break
        
        case 'KeyE':
          playerCannonBody.position.y = playerCannonBody.position.y + 10 
        break
        case 'KeyY':
          playerCannonBody.position.z = playerCannonBody.position.z + 10 
        break

        case 'KeyX':
          playerCannonBody.position.x = playerCannonBody.position.x - 10 
        break

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

    delta *= 1000
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