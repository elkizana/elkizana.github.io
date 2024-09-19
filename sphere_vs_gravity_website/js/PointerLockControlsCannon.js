import * as THREE from './three.module.js'
import * as CANNON from './cannon-es.js'
import { playerCannonBody} from './toCannon.js'
import { playerThreeMeshFullGroup} from './cartoonizeRigid.js'
import {OriginalrigidMeshes,world,CannonBody,materialName} from './initCannon.js'
import {rigidBodies} from "./toCannon.js"
import { toCannon, emptyRigidBodies } from './toCannon.js';
import { startTimer,resetStopWatch, stopTimer,StopWatchTime,addTextGeometry , ended} from './stopwatch.js'
import {stats,scene} from './initThree.js'

function startEvent() {
  if (!startSound.isPlaying) startSound.play()
  
}

document.addEventListener('keydown', startEvent, { once: true });


  
 



 


   

let allowStartSound = true
let allowEndSound = true
let allowRKey = true 
let allowReset = true
let canplay = false 
    const listener = new THREE.AudioListener()
    const audioLoader = new THREE.AudioLoader();
    let end

    const startSound = new THREE.PositionalAudio( listener );
    audioLoader.load( './assets/sounds/start.ogg', function( buffer ) {
      startSound.setBuffer( buffer );
      startSound.setVolume( 0.5 );

    });

    const backgroundSound = new THREE.PositionalAudio( listener );
    audioLoader.load( './assets/sounds/background.mp3', function( buffer ) {
      backgroundSound.setBuffer( buffer );
      backgroundSound.setRefDistance( 2000 );
      backgroundSound.setVolume( 0.04 );
      backgroundSound.setLoop( true );
      backgroundSound.play();
    });

    const jumperSound = new THREE.PositionalAudio( listener );
    audioLoader.load( './assets/sounds/jumper.wav', function( buffer ) {
      jumperSound.setBuffer( buffer );
      jumperSound.setRefDistance( 2000 );
      jumperSound.setVolume( 1 );
    });

  /*   const walkingSound = new THREE.PositionalAudio( listener );
    audioLoader.load( './assets/sounds/bike-click-7033.mp3', function( buffer ) {
      walkingSound.setBuffer( buffer );
      walkingSound.setRefDistance( 2000 );
      walkingSound.setVolume( 0.2 );
    }); */

/*     const flyingSound = new THREE.PositionalAudio( listener );
    audioLoader.load( './assets/sounds/Woosh Effect 4.wav', function( buffer ) {
      flyingSound.setBuffer( buffer );
      flyingSound.setRefDistance( 2000 );
      flyingSound.setVolume( 0.2 );
    }); */

    const jumpSound = new THREE.PositionalAudio( listener );
    audioLoader.load( './assets/sounds/jump.wav', function( buffer ) {
      jumpSound.setBuffer( buffer );
      jumpSound.setRefDistance( 2000 );
      jumpSound.setVolume( 0.2 );
      //jumpSound.setLoop( true );
      //walking.play();
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
  
         
       
       if (mesh.name != "ball" && mesh.material.name == "rigid")  toCannon(mesh,CannonBody, "rigid")  
      })


}  

const contactNormal = new CANNON.Vec3() // Normal in the contact, pointing *out* of whatever the player touched
const upAxis = new CANNON.Vec3(0, 1, 0)

let pressR = new KeyboardEvent('keydown', {
  key: 'r', 
  keyCode: 82, 
  code: 'KeyR',
  which: 13,
  bubbles: true
});




setInterval(() => {
  
  document.getElementById("ballPostion").innerHTML = Math.floor(playerCannonBody.position.y) + "/" + Math.floor(end)

  if (playerCannonBody.position.y < -400) { 
    document.dispatchEvent(pressR);
  }
   
    
}, 1000);


class PointerLockControlsCannon extends THREE.EventDispatcher {
  constructor(camera, cannonBody,playerThreeMeshFullGroup) {
    super()
    

    
    this.enabled = false
    this.cannonBody = cannonBody

    this.cannonBody.linearDamping = 0.5 ;
    this.cannonBody.angularDamping = 0.5
//    this.cannonBody.applyImpulse(new CANNON.Vec3(5, 2, 0), this.cannonBody.position);  // Realistic force when the ball is hit or thrown

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


    //const downAxis = new CANNON.Vec3(0, 1, 0)
    
    camera.add( listener );





  world.bodies.forEach((body) => {  
    if (body.name == "end") {
      end = body.position.y
    
  }})
  

    this.cannonBody.addEventListener('collide', (event) => {
        
        //console.log(event.contact.bj.name)

              if (event.contact.bj.name == "reset" && allowReset ) { 
                setTimeout(() => {
                  allowReset = false
                  reInitiate()  
                  flyingSound.stop()
                  walkingSound.stop()
                  jumperSound.play()

                }, 100);
                
                setTimeout(() => {
                  allowReset = true 
                }, 2000);
                }

                if (event.contact.bj.name == "jumper" ) { 
                    this.velocity.y = this.jumpVelocity * 7
                    //this.this.euler.z = 10000
                    this.canJump = false
                    if (!jumperSound.isPlaying )  jumperSound.play()
                  setTimeout(() => {
                    reInitiate()  

                  }, 100);

                     
                
                  
                  }
                

              //if (event.contact.bj.position.x == end.x && allowEndSound ) { 
                if (event.contact.bj.name == "end" && allowEndSound ) {
                startSound.play()
                allowEndSound = false
                stopTimer()
                addTextGeometry("Congratulations !\nYou finished the game in : " + StopWatchTime )
                ended(StopWatchTime)
                
               
                    

              }
              
           const { contact } = event
           const relativeVelocity = event.contact.getImpactVelocityAlongNormal();
           
            if( Math.abs(relativeVelocity) >   1 ) {
              
              ballCollisionSound.setVolume( relativeVelocity / 10);
               
              this.playerThreeMesh.add(ballCollisionSound)
              if (!ballCollisionSound.isPlaying )  ballCollisionSound.play() && walkingSound.stop() && flyingSound.stop()
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


  
  

      
        onMouseMove = (event) => {
      

          const { movementX, movementY } = event
      
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
        case 'KeyT':
            // hide  document.body.appendChild(stats.dom)
            if (stats.dom.style.display === '' || stats.dom.style.display === 'none') {
              stats.dom.style.display = 'block';
          } else {
              stats.dom.style.display = 'none';
          }
          
          break

       

        /* case 'Enter':
        break
        */

        
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
          /* case click left */

          //case  'Button0':
        if (this.canJump) {
          this.velocity.y = this.jumpVelocity
           if (!jumpSound.isPlaying) jumpSound.play() && walkingSound.stop() && flyingSound.stop()
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

    const speed = Math.sqrt(
      this.velocity.x * this.velocity.x +
      this.velocity.y * this.velocity.y +
      this.velocity.z * this.velocity.z
  );



  
  const speedLimit = 3
  

    //if (!walkingSound.isPlaying && this.canJump && speed > speedLimit /* && speed < 7 */)  walkingSound.setVolume( speed / 40 /* 0.2 */ ) && walkingSound.play() 
    //if (!flyingSound.isPlaying  && !jumperSound.isPlaying && this.velocity.y < -5)  flyingSound.play()  && walkingSound.stop() 


//console.log(this.isGrounded)


      

    //
    

    if (this.enabled === false) {
      return
    }

    delta *= 950
    delta *= 0.1

    this.inputVelocity.set(0, 0, 0)
    
    if (this.moveForward) {
      
     // console.log(this.velocity )

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


    //this.velocity.y += this.inputVelocity.y

    if (this.playerThreeMesh && this.cannonBody) { 
      this.yawObject.position.copy(this.cannonBody.position)
        

      //this.yawObject.position.copy(this.cannonBody.position)

      this.playerThreeMesh.position.copy(this.cannonBody.position)
        this.playerThreeMesh.quaternion.copy(this.cannonBody.quaternion)
    

  }


  }
  
}

export { PointerLockControlsCannon }