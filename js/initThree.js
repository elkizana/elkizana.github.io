import * as THREE from './three.module.js'
import { initCannon} from './initCannon.js'
import { RGBELoader } from './RGBELoader.js'
import { EXRLoader } from './EXRLoader.js';
import { OrbitControls } from './OrbitControls.js'
import   Stats from './stats.module.js'
export  let camera, scene, renderer, stats , texture,light,orbitControls,directionalLight


/* 
import nipplejs from './nipple.js';
      
      console.log(nipplejs);
      let manager = nipplejs.create();
       */
initThree()
initCannon()
//initPointerLock()
//init()
/* setTimeout(() => {
 // animate()
  
}, 1000); */

  
export function initThree() {

      const container = document.getElementById( 'container' );
      // Camera
      camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1600 );

      // Scene
      scene = new THREE.Scene()
      // Renderer
      
    
      renderer = new THREE.WebGLRenderer( { antialias: true, alpha:true } );
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize( window.innerWidth, window.innerHeight );
      container.appendChild( renderer.domElement );

    /*   const pmremGenerator = new THREE.PMREMGenerator( renderer );
      const hdriLoader = new RGBELoader()
      hdriLoader.load( './assets/hdri/animestyled_hdr.hdr', function ( texture ) {
      const envMap = pmremGenerator.fromEquirectangular( texture ).texture;
      texture.dispose(); 
      //scene.environment = envMap
      scene.background = envMap
} ); */
      
      //orbitControls = new OrbitControls(camera, renderer.domElement);
      orbitControls = new OrbitControls( camera, renderer.domElement );
      camera.position.set( 0, 3.5, 3.5 );
      orbitControls.update();
      
      // Stats.js
      stats = new Stats()
      stats.showPanel( 0 )
      //document.body.appendChild(stats.dom)
      //scene.background = new THREE.Color( 0x3F9BE2); // 0x213722  // 0x333333 // 0xF5F5F5 
      // add image backround 
      const loader = new THREE.TextureLoader();
      loader.load( './assets/img/background.jpg', function ( texture ) {
        scene.background = texture
        //scene.background = texture
      })
      

      window.addEventListener('resize', onWindowResize)
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
