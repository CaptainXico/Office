// main.js
import * as THREE from 'https://threejs.org/build/three.module.js';
import { GLTFLoader } from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';

// Rest of your code remains unchanged
const scene = new THREE.Scene();
// ...

// Load the .glb model
const loader = new GLTFLoader();
loader.load('glb\table.glb', (gltf) => {
    scene.add(gltf.scene);
});

// Animation/render loop
const animate = () => {
    requestAnimationFrame(animate);

    // Add any animations or updates here

    renderer.render(scene, camera);
};

// Handle window resize
window.addEventListener('resize', () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(newWidth, newHeight);
});

// Start the animation loop
animate();
