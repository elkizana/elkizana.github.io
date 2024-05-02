import { PointerLockControlsCannon } from './PointerLockControlsCannon.js'
import { camera, scene } from './initThree.js'
import { playerCannonBody} from './toCannon.js'
import { playerThreeMeshFullGroup} from './cartoonizeRigid.js'
export let controls


export function initPointerLock() {
     controls = new PointerLockControlsCannon(camera, playerCannonBody,playerThreeMeshFullGroup)

    scene.add(controls.getObject())

    container.addEventListener('click', () => {
      controls.lock()
    })

    controls.addEventListener('lock', () => {
      controls.enabled = true
      //instructions.style.display = 'none'
      //container.style.display = 'none'
      fullscreenBtn.style.display = 'none'

    })

    controls.addEventListener('unlock', () => {
      controls.enabled = false
      //container.style.display = null
      fullscreenBtn.style.display = null


    })
  }