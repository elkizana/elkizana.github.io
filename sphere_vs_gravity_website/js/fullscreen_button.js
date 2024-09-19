const iframe = document.getElementById('body');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const forwardButton = document.getElementById('forward');

// Toggle fullscreen state
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    if (iframe.requestFullscreen) {
      iframe.requestFullscreen();
    } else if (iframe.mozRequestFullScreen) { // Firefox
      iframe.mozRequestFullScreen();
    } else if (iframe.webkitRequestFullscreen) { // Chrome, Safari & Opera
      iframe.webkitRequestFullscreen();
    } else if (iframe.msRequestFullscreen) { // IE/Edge
      iframe.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { // Firefox
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { // Chrome, Safari & Opera
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE/Edge
      document.msExitFullscreen();
    }
  }
}

// Add event listener for forward button
/* forwardButton.addEventListener('click', () => {
  const event = new KeyboardEvent('keydown', {
    code: 'ButtonW',
    key: 'w'
  });
  document.dispatchEvent(event);
}); */

// Add event listener for fullscreen button
fullscreenBtn.addEventListener('click', toggleFullscreen);

// Add event listener for 'f' key to toggle fullscreen
document.addEventListener('keydown', (event) => {
  if (event.key === 'f') {
    toggleFullscreen();
  }
});
