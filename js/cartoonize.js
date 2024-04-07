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
import {rigidMeshes} from "./initCannon.js"
import { camera, scene, renderer } from './initThree.js';
let edgesModel

export function cartoonize( solidMeshes ) { 

    let threshold = 11 
    const DARK_LINES = 0x333333
    const LIGHT_MODEL = 0xffffff


        const geometries = [];
        //glb.updateMatrixWorld( true );
    
        solidMeshes.forEach( eachMesh => {
                    if (eachMesh.material.name !== "rigid" ) { 
                    const singleGeometry = eachMesh.geometry;
                    singleGeometry.applyMatrix4( eachMesh.matrixWorld );
                        for ( const key in singleGeometry.attributes ) {
                            if ( key !== 'position' && key !== 'normal' ) {
                                singleGeometry.deleteAttribute( key )
                            }
                    }
                    geometries.push( singleGeometry.toNonIndexed() )
             


                }

                
            })
                 
    
        const mergedGeometries = BufferGeometryUtils.mergeGeometries( geometries, false );
        const mergedGeometry = BufferGeometryUtils.mergeVertices( mergedGeometries )//.center();
        const mesh = new THREE.Mesh( mergedGeometry );

    


///Lines
    let lineGeom = new THREE.EdgesGeometry( mesh.geometry , threshold );
/*     const line = new THREE.LineSegments( lineGeom, new THREE.LineBasicMaterial( { color: DARK_LINES } ) );
    line.position.copy( mesh.position );
    line.scale.copy( mesh.scale );
    line.rotation.copy( mesh.rotation ); */
////thickLines
    const thickLineGeom = new LineSegmentsGeometry().fromEdgesGeometry( lineGeom );
    const thickLines = new LineSegments2( thickLineGeom, new LineMaterial( { color: DARK_LINES, linewidth: .001 } ) );
    thickLines.position.copy( mesh.position );
    thickLines.scale.copy( mesh.scale );
    thickLines.rotation.copy( mesh.rotation );

    ///ConditionalEdgesGeometry
const lineGeom2 = new ConditionalEdgesGeometry( BufferGeometryUtils.mergeVertices( mergedGeometries ) );
const material = new THREE.ShaderMaterial( ConditionalEdgesShader );
material.uniforms.diffuse.value.set( DARK_LINES );
const conditionalLines = new THREE.LineSegments( lineGeom2, material );
conditionalLines.position.copy( mesh.position );
conditionalLines.scale.copy( mesh.scale );
conditionalLines.rotation.copy( mesh.rotation );


//backgroundmodel 
mesh.material = new THREE.MeshBasicMaterial( { color: LIGHT_MODEL } );
mesh.material.polygonOffset = true;
mesh.material.polygonOffsetFactor = 1;
mesh.material.polygonOffsetUnits = 1;
mesh.renderOrder = 2;
mesh.material.transparent = true
mesh.material.opacity = 0.8
//mesh.material.color = new THREE.Color(LIGHT_MODEL)



    const linesGroup = new THREE.Group(); 
    const fullGroup = new THREE.Group();

    linesGroup.add( thickLines  /*conditionalLines  , conditionalLines */   )
    fullGroup.add( linesGroup,mesh );
    

    scene.add(fullGroup)
    



    

}









