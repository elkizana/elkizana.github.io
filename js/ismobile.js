function isMobile() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  // Checking if the device is Android or iOS
  if (/android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return true;
  }
  return false;
}

function displayDeviceType() {
  const deviceTypeElement = document.getElementById('device-type');
  if (isMobile()) {
//    let isMobile = true
    console.log('You are using a mobile device.');
  } else {
    console.log('You are using a desktop device.')
  //  isMobile = false
  }
  
}

displayDeviceType()

if (!isMobile()) {
  document.getElementById("restart_button").style.display = "none";
  document.getElementById("jump_button").style.display = "none";
/*   document.getElementById("cameraNippleDynamic").style.display = "none";
  document.getElementById("movementNippleDynamic").style.display = "none"; */
}