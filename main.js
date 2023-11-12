// main.js

// Set up Three.js scene
import * as THREE from './three.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a simple cube (replace with your GLB model)
const loader = new THREE.GLTFLoader();
let table;

loader.load('glb/table.glb', (gltf) => {
    table = gltf.scene;
    scene.add(table);
});

// Set up WebXR
const xrButton = new XRButton();

// Handle XR session
async function onXRSessionStarted(session) {
    session.addEventListener('end', onXRSessionEnded);

    // Create XR reference space
    const referenceSpace = await session.requestReferenceSpace('local');

    // Create XR frame of reference
    const xrFrameOfReference = await session.requestFrameOfReference('eye-level', 'stage');

    // Handle XR frame loop
    session.requestAnimationFrame(onXRFrame);

    function onXRFrame(t, frame) {
        const pose = frame.getViewerPose(referenceSpace);

        if (pose) {
            const viewerPosition = pose.transform.position;
            const viewerRotation = pose.transform.orientation;

            // Update camera position and rotation based on XR pose
            camera.position.set(viewerPosition.x, viewerPosition.y, viewerPosition.z);
            camera.setRotationFromQuaternion(new THREE.Quaternion(viewerRotation.x, viewerRotation.y, viewerRotation.z, viewerRotation.w));
        }

        // Render the scene
        renderer.render(scene, camera);

        // Continue the XR frame loop
        session.requestAnimationFrame(onXRFrame);
    }
}

// Handle XR session end
function onXRSessionEnded(event) {
    // Clean up resources if needed
}

// Initialize XR button and start XR session on click
xrButton.addEventListener('selectstart', onSelectStart);

function onSelectStart(event) {
    const session = event.frame.session;
    if (!session) {
        xrButton.removeEventListener('selectstart', onSelectStart);
        navigator.xr.requestSession('immersive-vr').then(onXRSessionStarted);
    }
}

// Handle window resize
window.addEventListener('resize', onWindowResize);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
