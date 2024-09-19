import * as THREE from './three.module.js'
import { initCannon} from './initCannon.js'
import { OrbitControls } from './OrbitControls.js'
import   Stats from './stats.module.js'
export  let camera, scene, renderer, stats , texture,light,orbitControls,directionalLight
import StarrySkyShader from './StarrySkyShader.js';



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
      camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 2600 );

      // Scene
      scene = new THREE.Scene()
      // Renderer
      
     /* if ( navigator.gpu ) {
                 
                   console.log("using webgpu renderer");
                   renderer = new THREE.WebGPURenderer();
               } else {
                   renderer = new THREE.WebGLRenderer();
               } */
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
      /* add light  */

      // Light
      
      // Stats.js
      stats = new Stats()
      stats.showPanel( 0 )
      document.body.appendChild(stats.dom) 
      stats.dom.style.display = 'none'; // Hide the element by default

  

      var skyDomeRadius = 1500.01;
      var sphereMaterial = new THREE.ShaderMaterial({
        uniforms: {
          skyRadius: { value: skyDomeRadius },
          env_c1: { value: new THREE.Color("#0d1a2f") },
          env_c2: { value: new THREE.Color("#0f8682") },
          noiseOffset: { value: new THREE.Vector3(100.01, 100.01, 100.01) },
          starSize: { value: 0.01 },
          starDensity: { value: 0.09 },
          clusterStrength: { value: 0.2 },
          clusterSize: { value: 0.2 },
        },
        vertexShader: StarrySkyShader.vertexShader,
        fragmentShader: StarrySkyShader.fragmentShader,
        side: THREE.DoubleSide,
      })
      var sphereGeometry = new THREE.SphereGeometry(skyDomeRadius, 20, 20);
      var skyDome = new THREE.Mesh(sphereGeometry, sphereMaterial);
      scene.add(skyDome);


 /*     const loader = new THREE.TextureLoader();
      loader.load( './css/gradient.png', function ( texture ) {
        scene.background = texture
        //scene.background = texture
      }) */


      // scene.background = new THREE.Color(0x00c5e7)
    //  scene.background = new THREE.Color("black")


    /*    const canvas = document.createElement('canvas');
canvas.width = 256;
canvas.height = 256;
const context = canvas.getContext('2d'); */
/*
// Create a gradient
const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
gradient.addColorStop(0, '#016e81'); // Top color (DodgerBlue)

gradient.addColorStop(0.7, '#241212'); // Bottom color (HotPink)

gradient.addColorStop(1, '#000000'); // Bottom color (HotPink)


// Fill the canvas with the gradient
context.fillStyle = gradient;
context.fillRect(0, 0, canvas.width, canvas.height); */

// Create a texture from the canvas
/* const texture = new THREE.CanvasTexture(canvas);

// Set the texture as the scene background
scene.background = texture; */



       

      window.addEventListener('resize', onWindowResize)
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
