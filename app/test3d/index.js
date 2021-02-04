import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { Renderer, TextureLoader } from 'expo-three';
import OrbitControlsView from 'expo-three-orbit-controls';
import * as React from 'react';
import { Modal, TouchableHighlight, Text, View } from 'react-native';
import {
  AmbientLight,
  BoxBufferGeometry,
  Fog,
  GridHelper,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SpotLight,
  Vector3,
  Camera,
} from 'three';
import * as TWEEN from "@tweenjs/tween.js";

export default function App() {
  const [camera, setCamera] = React.useState(null);
  const orbitShit = React.useRef();

  let timeout;

  React.useEffect(() => {
    // Clear the animation loop when the component unmounts
    return () => clearTimeout(timeout);
  }, []);

  const onContextCreate = async (gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const sceneColor = 0x6ad6f0;

    // Create a WebGLRenderer without a DOM element
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);
    renderer.setClearColor(sceneColor);

    const camera = new PerspectiveCamera(70, width / height, 0.01, 1000);
    camera.position.set(2, 5, 5);

    setCamera(camera);

    const scene = new Scene();
    scene.fog = new Fog(sceneColor, 1, 10000);
    scene.add(new GridHelper(10, 10));

    const ambientLight = new AmbientLight(0x101010);
    scene.add(ambientLight);

    const pointLight = new PointLight(0xffffff, 2, 1000, 1);
    pointLight.position.set(0, 200, 200);
    scene.add(pointLight);

    const spotLight = new SpotLight(0xffffff, 0.5);
    spotLight.position.set(0, 500, 100);
    spotLight.lookAt(scene.position);
    scene.add(spotLight);

    // const cube = new IconMesh();

    // cube.on( 'click',function(ev){
    //   orbitShit.current.getControls().target = new Vector3(0, 0, 1);
    //   orbitShit.current.getControls().update(); 
    // });
    // scene.add(cube);

    // camera.lookAt(cube.position);

    // POINTS EXAMPLE
    const vertices = [];
    for ( let i = 0; i < 5; i ++ ) {
      const x = THREE.MathUtils.randFloatSpread( 3 );
      const y = THREE.MathUtils.randFloatSpread( 3 );
      const z = THREE.MathUtils.randFloatSpread( 3 );

      vertices.push( x, y, z );
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    // material from https://stackoverflow.com/a/54361382
    // const material = new THREE.ShaderMaterial({
    //   transparent: true,
    //   uniforms: {
    //       depthWrite: false,
    //       size: {value: 10},
    //       scale: {value: 1},
    //       color: {value: new THREE.Color('red')},
    //   },
    //   vertexShader: THREE.ShaderLib.points.vertexShader,
    //   fragmentShader: `
    //   uniform vec3 color;
    //   void main() {
    //       vec2 xy = gl_PointCoord.xy - vec2(0.5);
    //       float ll = length(xy);
    //       gl_FragColor = vec4(color, step(ll, 0.5));
    //   }
    //   `
    // });
    // const material = new THREE.PointsMaterial( { color: 'red' } );
    const tex = new TextureLoader().load(require("app/appearance/images/barpath-dot.png"));
    const material = new THREE.PointsMaterial( { size: 1, map: tex, transparent: true, alphaTest: 0.5, sizeAttenuation: true } );
    // material.color.setHSL( 1.0, 0.3, 0.7 );
    material.color.setColorName('red');
    const points = new THREE.Points( geometry, material );
    // const spriteMaterial = new THREE.SpriteMaterial( { color: 0xffffff } );
    // const points = new THREE.Sprite( spriteMaterial );
    scene.add( points );
    // END POINTS EXAMPLE


    // Setup an animation loop
    const render = (time) => {
      TWEEN.update(time);
      timeout = requestAnimationFrame(render);
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    render();
  };

  return (
    <Modal
      transparent={true}
      visible={true} >
      <OrbitControlsView style={{ flex: 1 }} camera={camera} ref={orbitShit}>
        <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} key="d" />
      </OrbitControlsView>
      <TouchableHighlight onPress={()=> {
        const target = orbitShit.current.getControls().target;
        const from = { x: target.x, y: target.y, z: target.z };
        const to = { x: 1, y: 1, z: 1 };
        new TWEEN.Tween(from)
          .to(to, 1000)
          .easing(TWEEN.Easing.Quadratic.InOut)
          .onUpdate(() => {
            // camera.position.set(coords.x, coords.y, coords.z); // animate the thing
            orbitShit.current.getControls().target.set( from.x, from.y, from.z ); // set it logically but don't update visually
            orbitShit.current.getControls().update();
          })
          .start();
  
      }}><Text>Get Controls set target</Text></TouchableHighlight>
    </Modal>
  );
}

/*
class IconMesh extends Mesh {
  constructor() {
    super(
      new BoxBufferGeometry(1.0, 1.0, 1.0),
      new MeshStandardMaterial({
        map: new TextureLoader().load(
          'https://pbs.twimg.com/profile_images/1203624639538302976/h-rvrjWy_400x400.jpg'
        ),
      })
    );
  }
}
*/