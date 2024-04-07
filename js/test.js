
import * as THREE from './three.module.js';
import { GLTFLoader } from './GLTFLoader.js';
import *  as BufferGeometryUtils from './BufferGeometryUtils.js';
import dat from './dat.gui.module.js';
import { LineSegmentsGeometry } from './LineSegmentsGeometry.js';
import { LineSegments2 } from './LineSegments2.js';
import { LineMaterial } from './LineMaterial.js';
import { OutsideEdgesGeometry } from './OutsideEdgesGeometry.js';
import { ConditionalEdgesGeometry } from './ConditionalEdgesGeometry.js';
import { ConditionalEdgesShader } from './ConditionalEdgesShader.js';
import { ConditionalLineSegmentsGeometry } from './ConditionalLineSegmentsGeometry.js';
import { ConditionalLineMaterial } from './ConditionalLineMaterial.js';
import { ColoredShadowMaterial } from './ColoredShadowMaterial.js';
import {loaded_pvc,rigidMeshes,rigidBodies} from "./initCannon.js"
import { camera, scene, renderer } from './initThree.js';
// globals
var params = {
    colors: 'LIGHT',
    backgroundColor: '#0a0c0c',
    modelColor: '#0a0c0c',
    lineColor: '#000000',
    shadowColor: '#000000',

    lit: false,
    opacity: 0.85,
    threshold: 11,
    display: 'THRESHOLD_EDGES',
    displayConditionalEdges: true,
    thickness: 4,
    useThickLines: true,
    model: 'HELMET',

    randomize: () => randomizeColors(),
};

export let  model,edgesModel, originalModel, backgroundModel, conditionalModel, shadowModel, depthModel, gui,floor,group2
//group2 = new THREE.Group();


const models = {};
const color = new THREE.Color();
const color2 = new THREE.Color();

const LIGHT_BACKGROUND = 0xeeeeee;
const LIGHT_MODEL = 0xffffff;
const LIGHT_LINES = 0x455A64;
const LIGHT_SHADOW = 0xc4c9cb;

const DARK_BACKGROUND = 0x213722
const DARK_MODEL = 0xffffff;
const DARK_LINES = 0x000000;
const DARK_SHADOW = 0x000000;

function randomizeColors() {
    scene.background = new THREE.Color( LIGHT_BACKGROUND );
    const lineH = Math.random();
    const lineS = Math.random() * 0.2 + 0.8;
    const lineL = Math.random() * 0.2 + 0.4;

    const lineColor = '#' + color.setHSL( lineH, lineS, lineL ).getHexString();
    const backgroundColor = '#' + color.setHSL(
        ( lineH + 0.35 + 0.3 * Math.random() ) % 1.0,
        lineS * ( 0.25 + Math.random() * 0.75 ),
        1.0 - lineL,
    ).getHexString();

    color.set( lineColor );
    color2.set( backgroundColor );
    const shadowColor = '#' + color.lerp( color2, 0.7 ).getHexString();

    /* params.shadowColor = shadowColor;
    params.lineColor = lineColor;
    params.backgroundColor = backgroundColor;
    params.modelColor = backgroundColor;
    params.colors = 'CUSTOM'; */

    initGui();

};

export function updateModel() {
    
/*     originalModel = models[ params.model ];

    initEdgesModel();

    initBackgroundModel();

    initConditionalModel(); */

}

function mergeObject( object ) {
    

    // Update the object's world transformation matrix to ensure it reflects any changes in position, rotation, or scale
    object.updateMatrixWorld( true );

    const geometry = [];

    object.traverse( c => {
        if ( c.isMesh && c.name !== "ball" && c.material.name !== "rigid"  ) {
    
            
            const g = c.geometry;
                
            // Apply the object's world transformation to the mesh's geometry
            g.applyMatrix4( c.matrixWorld );
            
            // Loop through each attribute of the geometry
            for ( const key in g.attributes ) {
                //console.log( key );

                // Check if the attribute key is not 'position' or 'normal'
                if ( key !== 'position' && key !== 'normal' ) {
                    // If not 'position' or 'normal', delete the attribute to optimize memory usage
                    g.deleteAttribute( key );
                }
            }

            // Push the modified geometry (converted to non-indexed) into the array
            geometry.push( g.toNonIndexed() );
        }
    } );


    const mergedGeometries = BufferGeometryUtils.mergeGeometries( geometry, false );
    const mergedGeometry = BufferGeometryUtils.mergeVertices( mergedGeometries )//.center();
  /*   const group = new THREE.Group();
    const mesh = new THREE.Mesh( mergedGeometry );
    group.add( mesh );
    return group; */
}


function initBackgroundModel() {

    if ( backgroundModel ) {

        backgroundModel.parent.remove( backgroundModel );
        shadowModel.parent.remove( shadowModel );
        depthModel.parent.remove( depthModel );

        backgroundModel.traverse( c => {

            if ( c.isMesh ) {

                c.material.dispose();

            }

        } );

        shadowModel.traverse( c => {

            if ( c.isMesh ) {

                c.material.dispose();

            }

        } );

        depthModel.traverse( c => {

            if ( c.isMesh ) {

                c.material.dispose();

            }

        } );

    }

    if ( ! originalModel ) {

        return;

    }

    backgroundModel = originalModel.clone();
    backgroundModel.traverse( c => {

        if ( c.isMesh ) {

            c.material = new THREE.MeshBasicMaterial( { color: LIGHT_MODEL } );
            c.material.polygonOffset = true;
            c.material.polygonOffsetFactor = 1;
            c.material.polygonOffsetUnits = 1;
            c.renderOrder = 2;

        }

    } );
    scene.add( backgroundModel );
    //group2.add(backgroundModel)

    shadowModel = originalModel.clone();
    shadowModel.traverse( c => {

        if ( c.isMesh ) {

            c.material = new ColoredShadowMaterial( { color: LIGHT_MODEL, shininess: 1.0 } );
            c.material.polygonOffset = true;
            c.material.polygonOffsetFactor = 1;
            c.material.polygonOffsetUnits = 1;
            c.receiveShadow = true;
            c.renderOrder = 2;

        }

    } );
    //    scene.add( shadowModel );

    depthModel = originalModel.clone();
    depthModel.traverse( c => {

        if ( c.isMesh ) {

            c.material = new THREE.MeshBasicMaterial( { color: LIGHT_MODEL } );
            c.material.polygonOffset = true;
            c.material.polygonOffsetFactor = 1;
            c.material.polygonOffsetUnits = 1;
            c.material.colorWrite = false;
            c.renderOrder = 1;

        }

    } );
    //scene.add( depthModel );

}

function initEdgesModel() {

    // remove any previous model
    if ( edgesModel ) {

        edgesModel.parent.remove( edgesModel );
        edgesModel.traverse( c => {

            if ( c.isMesh ) {

                if ( Array.isArray( c.material ) ) {

                    c.material.forEach( m => m.dispose() );

                } else {

                    c.material.dispose();

                }

            }

        } );

    }

    // early out if there's no model loaded
    if ( ! originalModel ) {

        return;

    }

    // store the model and add it to the scene to display
    // behind the lines
    edgesModel = originalModel.clone();
    scene.add( edgesModel );
    
    //group2.add(edgesModel)
    
    // early out if we're not displaying any type of edge
    if ( params.display === 'NONE' ) {

        edgesModel.visible = false;
        return;

    }

    const meshes = [];
    edgesModel.traverse( c => {

        if ( c.isMesh ) {

            meshes.push( c );

        }

    } );

    for ( const key in meshes ) {

        const mesh = meshes[ key ];
        const parent = mesh.parent;
        //console.log(parent)

        let lineGeom;
        if ( params.display === 'THRESHOLD_EDGES' ) {

            lineGeom = new THREE.EdgesGeometry( mesh.geometry, params.threshold );

        } else {

            const mergeGeom = mesh.geometry.clone();
            mergeGeom.deleteAttribute( 'uv' );
            mergeGeom.deleteAttribute( 'uv2' );
            lineGeom = new OutsideEdgesGeometry( BufferGeometryUtils.mergeVertices( mergeGeom, 1e-3 ) );

        }

        const line = new THREE.LineSegments( lineGeom, new THREE.LineBasicMaterial( { color: LIGHT_LINES } ) );
        line.position.copy( mesh.position );
        line.scale.copy( mesh.scale );
        line.rotation.copy( mesh.rotation );

        const thickLineGeom = new LineSegmentsGeometry().fromEdgesGeometry( lineGeom );
        const thickLines = new LineSegments2( thickLineGeom, new LineMaterial( { color: LIGHT_LINES, linewidth: 3 } ) );
        thickLines.position.copy( mesh.position );
        thickLines.scale.copy( mesh.scale );
        thickLines.rotation.copy( mesh.rotation );

        parent.remove( mesh );
        parent.add( line );
        parent.add( thickLines );

    }

}
function initConditionalModel() {

    // remove the original model
    if ( conditionalModel ) {

        conditionalModel.parent.remove( conditionalModel );
        conditionalModel.traverse( c => {

            if ( c.isMesh ) {

                c.material.dispose();

            }

        } );

    }

    // if we have no loaded model then exit
    if ( ! originalModel ) {

        return;

    }

    conditionalModel = originalModel.clone();
    //scene.add( conditionalModel );
    conditionalModel.visible = false;

    // get all meshes
    const meshes = [];
    conditionalModel.traverse( c => {

        if ( c.isMesh ) {

            meshes.push( c );

        }

    } );

    for ( const key in meshes ) {

        const mesh = meshes[ key ];
        const parent = mesh.parent;

        // Remove everything but the position attribute
        const mergedGeom = mesh.geometry.clone();
        for ( const key in mergedGeom.attributes ) {

            if ( key !== 'position' ) {

                mergedGeom.deleteAttribute( key );

            }

        }

        // Create the conditional edges geometry and associated material
        const lineGeom = new ConditionalEdgesGeometry( BufferGeometryUtils.mergeVertices( mergeGeometries ) );
        const material = new THREE.ShaderMaterial( ConditionalEdgesShader );
        material.uniforms.diffuse.value.set( LIGHT_LINES );

        // Create the line segments objects and replace the mesh
        const line = new THREE.LineSegments( lineGeom, material );
        line.position.copy( mesh.position );
        line.scale.copy( mesh.scale );
        line.rotation.copy( mesh.rotation );

        const thickLineGeom = new ConditionalLineSegmentsGeometry().fromConditionalEdgesGeometry( lineGeom );
        const thickLines = new LineSegments2( thickLineGeom, new ConditionalLineMaterial( { color: LIGHT_LINES, linewidth: 2 } ) );
        thickLines.position.copy( mesh.position );
        thickLines.scale.copy( mesh.scale );
        thickLines.rotation.copy( mesh.rotation );

        parent.remove( mesh );
        parent.add( line );
        parent.add( thickLines );

    }

}

export function init() {
 
    // Lights
    const dirLight = new THREE.DirectionalLight( 0xffffff, 1.0 );
    dirLight.position.set( 5, 10, 5 );
    dirLight.castShadow = true;
    dirLight.shadow.bias = -1e-10;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;

    window.dirLight = dirLight;

    const shadowCam = dirLight.shadow.camera;
    shadowCam.left = shadowCam.bottom = -1;
    shadowCam.right = shadowCam.top = 1;
    scene.add( dirLight );

    const loader = new GLTFLoader().setPath('./assets/models/').load(   
        'pvc.glb',
                	gltf => {
      
       //    const model = mergeObject( gltf.scene );
        //    models.HELMET = model
            
        //    updateModel();
        
		
		
        
        
        
                    }  
				)

       initGui();
}

function initGui() {

    if ( gui ) {

        gui.destroy();

    }

    // dat gui
    gui = new dat.GUI();
    gui.width = 200;
    gui.add( params, 'colors', [ 'LIGHT', 'DARK', 'CUSTOM' ] );
    gui.addColor( params, 'backgroundColor' );
    gui.addColor( params, 'modelColor' );
    gui.addColor( params, 'lineColor' );
    gui.addColor( params, 'shadowColor' );
    gui.add( params, 'randomize' );

    const modelFolder = gui.addFolder( 'model' );

//    modelFolder.add( params, 'model', Object.keys( models ) ).onChange( updateModel );

    modelFolder.add( params, 'opacity' ).min( 0 ).max( 1.0 ).step( 0.01 );

    modelFolder.add( params, 'lit' );

    modelFolder.open();

    const linesFolder = gui.addFolder( 'conditional lines' );

    linesFolder.add( params, 'threshold' )
        .min( 0 )
        .max( 120 )
        .onChange( initEdgesModel );

    linesFolder.add( params, 'display', [
        'THRESHOLD_EDGES',
        'NORMAL_EDGES',
        'NONE',
    ] ).onChange( initEdgesModel );
 
    linesFolder.add( params, 'displayConditionalEdges' );

    linesFolder.add( params, 'useThickLines' );

    linesFolder.add( params, 'thickness', 0, 5 );

    linesFolder.open();

    gui.close();

}


export function cartoonize() {

   // requestAnimationFrame( animate );
    let linesColor = DARK_LINES;
    let modelColor = DARK_MODEL
    let backgroundColor = DARK_BACKGROUND;
    let shadowColor = DARK_SHADOW;

    if ( params.colors === 'DARK' ) {

        linesColor = DARK_LINES;
        modelColor = DARK_MODEL;
        backgroundColor = DARK_BACKGROUND;
        shadowColor = DARK_SHADOW;

    } else if ( params.colors === 'CUSTOM' ) {

        linesColor = params.lineColor;
        modelColor = params.modelColor;
        backgroundColor = params.backgroundColor;
        shadowColor = params.shadowColor;

    }

    if ( conditionalModel ) {

        conditionalModel.visible = params.displayConditionalEdges;
        conditionalModel.traverse( c => {

            if ( c.material && c.material.resolution ) {

                renderer.getSize( c.material.resolution );
                c.material.resolution.multiplyScalar( window.devicePixelRatio );
                c.material.linewidth = params.thickness;

            }

            if ( c.material ) {

                c.visible = c instanceof LineSegments2 ? params.useThickLines : ! params.useThickLines;
                c.material.uniforms.diffuse.value.set( linesColor );

            }

        } );

    }


    if ( edgesModel ) {

        edgesModel.traverse( c => {

            if ( c.material && c.material.resolution ) {

                renderer.getSize( c.material.resolution );
                c.material.resolution.multiplyScalar( window.devicePixelRatio );
                c.material.linewidth = params.thickness;

            }

            if ( c.material ) {

                c.visible = c instanceof LineSegments2 ? params.useThickLines : ! params.useThickLines;
                c.material.color.set( linesColor );

            }

        } );

    }

    if ( backgroundModel ) {

        backgroundModel.visible = ! params.lit;
        backgroundModel.traverse( c => {

            if ( c.isMesh ) {

                c.material.transparent = params.opacity !== 1.0;
                c.material.opacity = params.opacity;
                c.material.color.set( modelColor );

            }

        } );

    }

    if ( shadowModel ) {

        shadowModel.visible = params.lit;
        shadowModel.traverse( c => {

            if ( c.isMesh ) {

                c.material.transparent = params.opacity !== 1.0;
                c.material.opacity = params.opacity;
                c.material.color.set( modelColor );
                c.material.shadowColor.set( shadowColor );

            }

        } );

    }


    scene.background.set( backgroundColor );

    

}
