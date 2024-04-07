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
import {rigidMeshes, animatedMeshes} from "./initCannon.js"
import {rigidBodies} from "./toCannon.js"
import { camera, scene, renderer } from './initThree.js';
import { playerThreeMesh } from './initCannon.js';
export let  playerThreeMeshFullGroup
export let  fullGroupAnimated = []
export let  fullGroupRigid = []

export function cartoonizeRigid( sourceList) { 

    let threshold = 11 
    const DARK_LINES = 0x000000
    const LIGHT_MODEL = 0xffffff;

    sourceList.forEach(rigidMesh => {

    let rigidMeshGeometry = rigidMesh.geometry
    rigidMeshGeometry.applyMatrix4( rigidMesh.matrixWorld );
    rigidMeshGeometry.center()
    const mesh = new THREE.Mesh( rigidMeshGeometry );
        

///Lines
/*     let lineGeom = new THREE.EdgesGeometry( rigidMeshGeometry , threshold );
    const line = new THREE.LineSegments( lineGeom, new THREE.LineBasicMaterial( { color: DARK_LINES } ) );
    line.position.copy( mesh.position );
    line.scale.copy( mesh.scale );
    line.rotation.copy( mesh.rotation ); */
////thickLines
     let lineGeom = new THREE.EdgesGeometry( rigidMeshGeometry , threshold );
    const thickLineGeom = new LineSegmentsGeometry().fromEdgesGeometry( lineGeom );
    const thickLines = new LineSegments2( thickLineGeom, new LineMaterial( { color: DARK_LINES, linewidth: .001 } ) );
    thickLines.position.copy( mesh.position );
    thickLines.scale.copy( mesh.scale );
    thickLines.rotation.copy( mesh.rotation ); 
    const fullGroup = new THREE.Group();
  
    const linesGroup = new THREE.Group();
 

    mesh.material = new THREE.MeshBasicMaterial( { color: LIGHT_MODEL } );
    mesh.material.polygonOffset = true;
    mesh.material.polygonOffsetFactor = 1;
    mesh.material.polygonOffsetUnits = 1;
    mesh.renderOrder = 2;
    mesh.material.transparent = true
    mesh.material.opacity = 0.7



    //linesGroup.add(thickLines)
    //fullGroup.add( linesGroup );
    fullGroup.add( mesh ,   thickLines);
     


if (rigidMesh.name == "ball") {
    playerThreeMeshFullGroup = fullGroup
} 
else if (rigidMesh.material.name == "animated") { 
    fullGroupAnimated.push(fullGroup)
}
else {
    fullGroupRigid.push(fullGroup)
}
 

    scene.add(fullGroup)



});












}