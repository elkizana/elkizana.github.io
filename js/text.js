import { scene } from "./initThree.js";
import * as THREE from './three.module.js'
import { FontLoader } from './FontLoader.js'
import { TextGeometry } from './TextGeometry.js';
let textMesh2
export function initText(text) {   
    // remove textMesh2 
    if(textMesh2) scene.remove(textMesh2)
    const loader = new FontLoader();

    loader.load('./fonts/Teko_Medium_Regular.json', function (font) {
       
            const geometry = new TextGeometry( text, {

            font: font,
            size: 5,
            height: 2,
            curveSegments: 10,
            bevelEnabled: false,
            bevelOffset: 0,
            bevelSegments: 1,
            bevelSize: 0.3,
            bevelThickness: 1,
            
        });
        const material = new THREE.MeshBasicMaterial({ color: "green" })
         textMesh2 = new THREE.Mesh(geometry );
        textMesh2.position.z = 0
        textMesh2.position.x = 50
        textMesh2.rotation.y = -90
        scene.add(textMesh2)
    });
}


let StopWatchTime
var time = 0;
var interval;
function startTimer() {
  //altBtns.innerHTML = "Stop"
  if(interval){
    clearInterval(interval);
  }
  interval = setInterval(() => { 
    time += 1
    //display.innerHTML = 
     StopWatchTime  = 
      Math.floor(time / 3600).toString().padStart(2, "0") + ":" + Math.floor((time % 3600) / 60).toString().padStart(2, "0") + ":" + Math.floor((time % 60)).toString().padStart(2, "0")
      console.log(StopWatchTime)
  }, 1000);
}
startTimer()

function stopTimer() {
  altBtns.innerHTML = "Start"
  clearInterval(interval);
  interval = null;
}

function reset (  ) { 
resetBtn.onclick = function(){
  //altBtns.innerHTML = "Start"
  if(interval){
    clearInterval(interval);
  }
  interval = null;
  time = 0;
  //display.innerHTML = "00:00:00";
}
}