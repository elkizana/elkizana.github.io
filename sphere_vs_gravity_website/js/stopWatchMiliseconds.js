let startTime;
let elapsedTime = 0;
let timerInterval;
export let stopWatchMiliseconds

export function startStopMiliseconds() {
  if (timerInterval) {
    clearInterval(timerInterval);
    
  } else {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(updateTime, 10); // update every 10 milliseconds
    
  }
}

function pad(value, length = 2) {
    return value.toString().padStart(length, '0');
  }

function updateTime() {
  elapsedTime = Date.now() - startTime;
  const milliseconds = elapsedTime % 1000;
  const seconds = Math.floor(elapsedTime / 1000) % 60;
  const minutes = Math.floor(elapsedTime / (1000 * 60)) % 60;
  const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
  
  stopWatchMiliseconds =  pad(minutes) + ":" + pad(seconds) + ":" + pad(milliseconds, 3) 
//console.log(stopWatchMiliseconds)

}


export function resetMiliseconds() {
    clearInterval(timerInterval);
    timerInterval = null;
    elapsedTime = 0;
  }