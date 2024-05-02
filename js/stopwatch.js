import { scene } from "./initThree.js";
import * as THREE from './three.module.js'
import { FontLoader } from './FontLoader.js'
import { TextGeometry } from './TextGeometry.js';

let stopWatchMesh
export let StopWatchTime
let shortcutMesh
let shortcut
let time = 0;
let interval;
let myfont
let material = new THREE.MeshBasicMaterial({ color: "black" })





export  function addTextGeometry(text) { 
    if(stopWatchMesh) scene.remove(stopWatchMesh)

    const geometry = new TextGeometry( text, {

        font: myfont,
        size: 55,
        height: 2,
    });

     stopWatchMesh = new THREE.Mesh(geometry, material);
    stopWatchMesh.position.z = 50
    stopWatchMesh.position.x = -1000
    stopWatchMesh.rotation.y = 20
    scene.add(stopWatchMesh)

  }
  
    




export function startTimer() {
  //altBtns.innerHTML = "Stop"
  if(interval){
    clearInterval(interval);
  }
  interval = setInterval(() => { 
    time += 1
    
     StopWatchTime  = 
     /*  Math.floor(time / 3600).toString().padStart(2, "0") + " : " +  */Math.floor((time % 3600) / 60).toString().padStart(2, "0") + " : " + Math.floor((time % 60)).toString().padStart(2, "0")
      //console.log(StopWatchTime)
      addTextGeometry(StopWatchTime)
  }, 1000);
}


export function stopTimer() {
  
  clearInterval(interval);
  interval = null;
}

export function resetStopWatch (  ) { 

  addTextGeometry("00 : 00")

  if(interval){
    clearInterval(interval);
  }
  interval = null;
  time = 0;
  
}


function shortcutText () { 



  const loader = new FontLoader();  
         loader.load('./assets/fonts/Open Sans_Regular.json', function (font) {
            myfont = font

            const geometry = new TextGeometry( "Press 'R' to restart\n\nPress 'F11' for Fullscreen ", {

              font: font,
              size: 25,
              height: 2,
          });
        
           shortcutMesh = new THREE.Mesh(geometry, material);
           shortcutMesh.position.z = 50
           shortcutMesh.position.x = -1000
           shortcutMesh.position.y = -100
          shortcutMesh.rotation.y = 20
          scene.add(shortcutMesh)
    });
   
  setTimeout(() => {
     scene.remove(shortcutMesh)

  }, 20000);
}

setTimeout(() => {
  shortcutText()
}, 1000);