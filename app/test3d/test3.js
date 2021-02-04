import React, { useRef, useEffect } from 'react';
import { useFrame, useThree, Canvas, extend } from 'react-three-fiber';
import OrbitControls from 'expo-three-orbit-controls';

extend({ OrbitControls });

const CameraControls = () => {
    // Get a reference to the Three.js Camera, and the canvas html element.
    // We need these to setup the OrbitControls component.
    // https://threejs.org/docs/#examples/en/controls/OrbitControls
    const {
      camera,
      gl: { domElement },
    } = useThree();
    // Ref to the controls, so that we can update them on every frame using useFrame
    const controls = useRef();
    useFrame((state) => controls.current.update());
    return <orbitControls ref={controls} args={[camera, domElement]} />;
};  

function Sphere(props) {
    const sphere = useRef();
    return (
        <mesh {...props} ref={sphere}>
            <sphereGeometry attach="geometry" args={[1, 16, 16]} />
            <meshStandardMaterial attach="material" color={props.color} />
        </mesh>
    )
}

// TODO: calculate fov for lift on tons of points
// for now just proof of concept that I can display them
export default function HelloWorld() {
    return (
        <Canvas camera={{ fov: 75, position: [0, 0, 70] }}>
            <CameraControls />
            <ambientLight intensity={0.5} />
            <Sphere position={[10, 10, 10]} color={'red'} />
            <Sphere position={[0, 0, 0]} color={0x0ff000} />
        </Canvas>
    );
}
