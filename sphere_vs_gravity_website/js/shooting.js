import * as CANNON from './cannon-es.js'
import * as THREE from './three.module.js'


// The shooting balls
        const shootVelocity = 25
        const ballShape = new CANNON.Sphere(0.2)
        const ballGeometry = new THREE.SphereBufferGeometry(ballShape.radius, 32, 32)

        // Returns a vector pointing the the diretion the camera is at
        function getShootDirection() {
          const vector = new THREE.Vector3(0, 0, 1)
          vector.unproject(camera)
          const ray = new THREE.Ray(sphereBody.position, vector.sub(sphereBody.position).normalize())
          return ray.direction
        }

        window.addEventListener('click', (event) => {
          if (!controls.enabled) {
            return
          }

          const ballBody = new CANNON.Body({ mass: 1 })
          ballBody.addShape(ballShape)
          const ballMesh = new THREE.Mesh(ballGeometry, material)

          ballMesh.castShadow = true
          ballMesh.receiveShadow = true

          world.addBody(ballBody)
          scene.add(ballMesh)
          balls.push(ballBody)
          ballMeshes.push(ballMesh)

          const shootDirection = getShootDirection()
          ballBody.velocity.set(
            shootDirection.x * shootVelocity,
            shootDirection.y * shootVelocity,
            shootDirection.z * shootVelocity
          )

          // Move the ball outside the player sphere
          const x = sphereBody.position.x + shootDirection.x * (sphereShape.radius * 1.02 + ballShape.radius)
          const y = sphereBody.position.y + shootDirection.y * (sphereShape.radius * 1.02 + ballShape.radius)
          const z = sphereBody.position.z + shootDirection.z * (sphereShape.radius * 1.02 + ballShape.radius)
          ballBody.position.set(x, y, z)
          ballMesh.position.copy(ballBody.position)
        })