import * as THREE from './three.module.js';
import *  as BufferGeometryUtils from './BufferGeometryUtils.js';
import { LineSegmentsGeometry } from './LineSegmentsGeometry.js';
import { LineSegments2 } from './LineSegments2.js';
import { LineMaterial } from './LineMaterial.js';
import { ConditionalEdgesGeometry } from './ConditionalEdgesGeometry.js';
import { ConditionalEdgesShader } from './ConditionalEdgesShader.js';
import { scene } from './initThree.js';

export function cartoonize( solidMeshes ) { 

    let threshold = 11;
    //const DARK_LINES = 0x2e2d2d;
    const LIGHT_MODEL = 0xffffff;

    const geometries = [];
    
    solidMeshes.forEach( eachMesh => {
        if ( eachMesh.material.name !== "rigid"  ) {

            const singleGeometry = eachMesh.geometry;
            singleGeometry.applyMatrix4( eachMesh.matrixWorld );

            for ( const key in singleGeometry.attributes ) {
                if ( key !== 'position' && key !== 'normal' ) {
                    singleGeometry.deleteAttribute( key );
                }
            }

            // Convert geometry to non-indexed geometry and store it
            const geometry = singleGeometry.toNonIndexed();
            geometries.push( geometry );

            // Assign a different color based on a condition (example: mesh name)
            const color = (eachMesh.name.endsWith("grey") || eachMesh.material.name == "grey" ) ? 0x3d3d3d : LIGHT_MODEL;
            const DARK_LINES = (eachMesh.name.endsWith("grey") || eachMesh.material.name == "grey" ) ? 0xa3a3a3: 0x2e2d2d ;
            const linewidth = (eachMesh.name.endsWith("grey") || eachMesh.material.name == "grey" ) ? .001 : .002 ;
            const material = new THREE.MeshBasicMaterial({ color: color });

            // Create the mesh
            const mesh = new THREE.Mesh( geometry, material );

            // Lines and thick lines creation remain unchanged
            let lineGeom = new THREE.EdgesGeometry( mesh.geometry, threshold );

            const thickLineGeom = new LineSegmentsGeometry().fromEdgesGeometry( lineGeom );
            const thickLines = new LineSegments2( thickLineGeom, new LineMaterial( { color: DARK_LINES, linewidth } ) );
            thickLines.position.copy( mesh.position );
            thickLines.scale.copy( mesh.scale );
            thickLines.rotation.copy( mesh.rotation );

            

            // Add the mesh and lines to the group
            const linesGroup = new THREE.Group();
            const fullGroup = new THREE.Group();
            linesGroup.add( thickLines );
            fullGroup.add( linesGroup, mesh );

            scene.add(fullGroup);
        }
    });
}
