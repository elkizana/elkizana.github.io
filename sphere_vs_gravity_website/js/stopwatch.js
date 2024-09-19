import { scene } from "./initThree.js";
import * as THREE from './three.module.js'
import { FontLoader } from './FontLoader.js'
import { TextGeometry } from './TextGeometry.js';


let bestScoreText 
let bestScore
let bestScoreMesh
let stopWatchMesh
export let StopWatchTime
let shortcutMesh
let shortcut
let time = 0;
let interval;
let myfont
let material = new THREE.MeshBasicMaterial({ color: "white" })
let shortcutNotesText = "_________________________________________________\n\nPress 'R' to restart\nPress 'F' for Fullscreen\n_________________________________________________\n\nObjective : Go up, reach the gravity pole and make it fall.\n_________________________________________________\n\nNotes:\n\n- Train ! The game is impossible to play without proper training.\n\n- There is no save points. If you fall you start over.\n\n- Levels and improvements are regularly added by the developer.\n\n- If you have suggestions/critics send them to spherevsgravity@gmail.com\n\nHave fun!\n\n_________________________________________________ "

const loader = new FontLoader();  
         loader.load('./assets/fonts/Open Sans_Regular.json', function (font) {
            myfont = font
          });



export  function addTextGeometry(text) { 
    if(stopWatchMesh) scene.remove(stopWatchMesh)

    const geometry = new TextGeometry( text, {

        font: myfont,
        size: 55,
        height: 2,
    });

    stopWatchMesh = new THREE.Mesh(geometry, material);
/*     stopWatchMesh.position.z = 50
    stopWatchMesh.position.x = -1000
    stopWatchMesh.position.y = 100 */
    
    stopWatchMesh.position.z = 1000
    stopWatchMesh.position.x = -500
    stopWatchMesh.position.y = 100
    

    stopWatchMesh.rotation.y = 40
    scene.add(stopWatchMesh)

  }
  
    



//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function startTimer() {
  if(interval){
    clearInterval(interval);
  }
  interval = setInterval(() => { 
    time += 1
    
     StopWatchTime  = 
     Math.floor((time % 3600) / 60).toString().padStart(2, "0") + " : " + Math.floor((time % 60)).toString().padStart(2, "0") 
     
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////



function shortcutText () { 

  
            const geometry = new TextGeometry( shortcutNotesText,
              
              {
              font: myfont,
              size: 25,
              height: 2,
          });
        
           shortcutMesh = new THREE.Mesh(geometry, material);
           shortcutMesh.position.z = 50
           shortcutMesh.position.x = -1000
           shortcutMesh.position.y = 100
          shortcutMesh.rotation.y = 20
          scene.add(shortcutMesh)
    
   
  setTimeout(() => {
     scene.remove(shortcutMesh)
  }, 100000);
}

setTimeout(() => {
  shortcutText()
}, 2000);


////////////////////////////////////////////////////////////////////////////////////////////////////////////

export  function addScoreGeometry(bestScore) { 
  
  const geometry = new TextGeometry( bestScore, {

      font: myfont,
      size: 25,
      height: 2,
  });

  bestScoreMesh = new THREE.Mesh(geometry, material);
 
  bestScoreMesh.position.z = 1000
  bestScoreMesh.position.x = -500
  bestScoreMesh.position.y = -100
  bestScoreMesh.rotation.y = 40

 scene.add(bestScoreMesh)

}

 setTimeout(() => {
  addScoreGeometry("world record score : " + bestScore)
}, 6000); 


/* setTimeout(() => {
  bestScoreText = "world record score : " + bestScore
   }, 2000); */
////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////

export async  function getBestScore(score) {
  const requestURL = "https://ardaarda.pythonanywhere.com/read-json"
  const request = new Request(requestURL);
  const response = await fetch(request);
  bestScore = await response.json()
  bestScore = bestScore.sphereVsGravity
  }

  getBestScore()


/////////////////////////////////////////////////////////


function compareStopwatchTimes(time1, time2) {
  function timeToMilliseconds(time) {
      let parts = time.split(':');
      let minutes = parseInt(parts[0]);
      let seconds = parseInt(parts[1]);
      return minutes * 60000 + seconds * 1000 ;
  }

  let milliseconds1 = timeToMilliseconds(time1);
  let milliseconds2 = timeToMilliseconds(time2);

  if (milliseconds1 < milliseconds2) {
      return "StopWatchTime" 
  } else if (milliseconds1 > milliseconds2) {
      return   "bestScore" 
  } else {
      return "Both times are equal.";
  }

}

//////////////////////////////////////////////////////////  

export async  function ended(StopWatchTime) {
  if (compareStopwatchTimes(StopWatchTime , bestScore ) == "StopWatchTime") {
    console.log("won") 
    scene.remove(bestScoreMesh)
    addScoreGeometry("You made a new world best score: " + StopWatchTime)
    postScore(StopWatchTime) 
  }
  else { 
    console.log("lost" )
  }
    
}
//////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////
async function postScore(score) {
  try {
    const requestURL = "https://ardaarda.pythonanywhere.com/write-json";
    const requestBody = {
      sphereVsGravity: score
      
    };
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    };
    const response = await fetch(requestURL, requestOptions);
    if (response.ok) {
      console.log("Score posted successfully");
    } else {
      console.error("Failed to post score:", response.status);
    }
  } catch (error) {
    console.error("Error posting score:", error);
  }
}
//////////////////////////////////////////////////////////