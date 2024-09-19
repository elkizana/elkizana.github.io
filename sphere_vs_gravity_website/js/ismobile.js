function isMobile() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  // Checking if the device is Android or iOS
  if (/android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return true;
  }
  return false;
}



if (!isMobile()) {
  document.getElementById("restart_button").style.display = "none";
  document.getElementById("jump_button").style.display = "none";
/*   document.getElementById("cameraNippleDynamic").style.display = "none";
  document.getElementById("movementNippleDynamic").style.display = "none"; */
}
else if (isMobile()) {
  console.log("mobile");  
  document.getElementById("start_button").style.display = "none";

}


  /// when  #restart_button is clicked ,   press the "r" key on the keyboard 
  document.getElementById('restart_button').addEventListener('touchstart', function() {
    // Create a new keyboard event
    provideHapticFeedback();
    var event = new KeyboardEvent('keydown', {
      key: 'r',
        keyCode: 82,
        code: 'KeyR',
        which: 82,
        shiftKey: false,
        ctrlKey: false,
        metaKey: false
    });
    // Dispatch the event
    document.dispatchEvent(event);
});

document.getElementById('jump_button').addEventListener('touchstart', function() {
    // Create a new keyboard event
    provideHapticFeedback();
    var event = new KeyboardEvent('keydown', {
      key: ' ',
        keyCode: 32,
        code: 'Space',
        which: 32,
        shiftKey: false,
        ctrlKey: false,
        metaKey: false
    });
    // Dispatch the event
    document.dispatchEvent(event);
});


function provideHapticFeedback() {
  if ("vibrate" in navigator) {
      
      navigator.vibrate(1);
      
  }
  
  
}