import React, { useRef, useEffect } from 'react';
import { useFrame, useThree, Canvas } from 'react-three-fiber';

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
            <ambientLight intensity={0.5} />
            <Sphere position={[10, 10, 10]} color={'red'} />
            <Sphere position={[0, 0, 0]} color={0x0ff000} />
        </Canvas>
    );
}
