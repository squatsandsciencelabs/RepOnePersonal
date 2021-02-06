import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import OrbitControlsView from 'expo-three-orbit-controls';
import * as React from 'react';
import { Modal, TouchableHighlight, Text, View } from 'react-native';
import {
  GridHelper,
  PerspectiveCamera,
  Scene,
} from 'three';
import * as TWEEN from "@tweenjs/tween.js";

const data = [
  0, 0, 0, // TODO: why is this fucking needed
  0,	-3219,	4398,
  0,	-3021,	4566,
  0,	-3002,	4608,
  0,	-2983,	4651,
  -7,	-2992,	4674,
  -14,	-3002,	4698,
  -22,	-3011,	4722,
  -29,	-3020,	4746,
  -37,	-3030,	4770,
  -44,	-3039,	4794,
  -49,	-3047,	4818,
  -53, -3056,	4842,
  -57,	-3065,	4866,
  -62,	-3073,	4890,
  -66,	-3082,	4915,
  -70,	-3090,	4939,
  -75,	-3099,	4963,
  -79,	-3108,	4987,
  -83,	-3116,	5011,
  -88,	-3125,	5036,
  -90,	-3136,	5058,
  -92,	-3148,	5080,
  -94,	-3159,	5103,
  -95,	-3171,	5125,
  -97,	-3182,	5148,
  -99,	-3194,	5170,
  -101,	-3205,	5192,
  -103,	-3216,	5215,
  -105,	-3228,	5237,
  -107,	-3239,	5260,
  -109,	-3251,	5282,
  -111,	-3262,	5304,
  -113,	-3274,	5327,
  -115,	-3285,	5349,
  -117,	-3297,	5372,
  -123,	-3305,	5396,
  -129,	-3313,	5420,
  -135,	-3321,	5445,
  -142,	-3328,	5469,
  -148,	-3336,	5494,
  -154,	-3344,	5518,
  -160,	-3352,	5542,
  -166,	-3360,	5567,
  -172,	-3368,	5591,
  -179,	-3376,	5616,
  -185,	-3384,	5640,
  -191,	-3392,	5664,
  -197,	-3400,	5689,
  -203,	-3407,	5713,
  -209,	-3415,	5737,
  -216,	-3423,	5762,
  -216,	-3429,	5788,
  -215,	-3435,	5813,
  -215,	-3440,	5839,
  -215,	-3446,	5865,
  -215,	-3451,	5891,
  -215,	-3457,	5917,
  -215,	-3463,	5942,
  -215,	-3468,	5968,
  -214,	-3474,	5994,
  -214,	-3480,	6020,
  -214,	-3485,	6046,
  -214,	-3491,	6071,
  -214,	-3497,	6097,
  -214,	-3502,	6123,
  -214,	-3508,	6149,
  -213,	-3514,	6175,
  -217,	-3518,	6201,
  -220,	-3523,	6227,
  -224,	-3527,	6253,
  -227,	-3532,	6279,
  -231,	-3537,	6305,
  -234,	-3541,	6331,
  -238,	-3546,	6357,
  -241,	-3551,	6383,
  -245,	-3555,	6409,
  -248,	-3560,	6435,
  -252,	-3565,	6461,
  -255,	-3569,	6487,
  -259,	-3574,	6513,
  -262,	-3579,	6539,
  -266,	-3583,	6565,
  -269,	-3588,	6591,
  -271,	-3593,	6617,
  -272,	-3597,	6643,
  -273,	-3602,	6669,
  -275,	-3607,	6695,
  -276,	-3612,	6721,
  -277,	-3617,	6746,
  -279,	-3621,	6772,
  -280,	-3626,	6798,
  -281,	-3631,	6824,
  -283,	-3636,	6850,
  -284,	-3641,	6876,
  -285,	-3646,	6902,
  -287,	-3650,	6928,
  -288,	-3655,	6953,
  -289,	-3660,	6979,
  -290,	-3665,	7005,
  -289,	-3661,	7035,
  -288,	-3658,	7065,
  -287,	-3654,	7095,
  -287,	-3650,	7125,
  -286,	-3647,	7155,
  -285,	-3643,	7185,
  -284,	-3640,	7215,
  -283,	-3636,	7245,
  -282,	-3633,	7275,
  -281,	-3629,	7305,
  -280,	-3625,	7335,
  -279,	-3622,	7365,
  -278,	-3618,	7395,
  -277,	-3615,	7425,
  -276,	-3610,	7455,
  -276,	-3606,	7485,
  -275,	-3602,	7515,
  -275,	-3597,	7544,
  -275,	-3593,	7574,
  -274,	-3588,	7604,
  -274,	-3584,	7634,
  -273,	-3580,	7664,
  -273,	-3575,	7694,
  -273,	-3571,	7724,
  -272,	-3567,	7753,
  -272,	-3562,	7783,
  -271,	-3558,	7813,
  -268,	-3552,	7843,
  -265,	-3547,	7873,
  -262,	-3542,	7903,
  -259,	-3537,	7933,
  -256,	-3531,	7963,
  -253,	-3526,	7993,
  -249,	-3521,	8023,
  -246,	-3515,	8052,
  -243,	-3510,	8082,
  -240,	-3505,	8112,
  -237,	-3499,	8142,
  -234,	-3494,	8172,
  -231,	-3484,	8204,
  -228,	-3474,	8235,
  -225,	-3463,	8267,
  -222,	-3453,	8298,
  -219,	-3443,	8329,
  -216,	-3433,	8361,
  -213,	-3422,	8392,
  -210,	-3412,	8424,
  -207,	-3402,	8455,
  -204,	-3392,	8487,
  -201,	-3382,	8518,
  -207,	-3374,	8548,
  -213,	-3366,	8578,
  -219,	-3359,	8607,
  -225,	-3351,	8637,
  -231,	-3344,	8667,
  -237,	-3336,	8696,
  -243,	-3328,	8726,
  -249,	-3321,	8756,
  -255,	-3313,	8785,
  -261,	-3306,	8815,
  -268,	-3298,	8844,
  -274,	-3290,	8874,
  -270,	-3287,	8902,
  -267,	-3284,	8930,
  -264,	-3280,	8958,
  -260,	-3277,	8986,
  -257,	-3274,	9014,
  -254,	-3270,	9042,
  -250,	-3267,	9071,
  -247,	-3263,	9099,
  -244,	-3260,	9127,
  -240,	-3257,	9155,
  -239,	-3254,	9182,
  -238,	-3251,	9210,
  -237,	-3249,	9237,
  -236,	-3246,	9265,
  -235,	-3243,	9293,
  -234,	-3240,	9320,
  -233,	-3238,	9348,
  -232,	-3235,	9375,
  -231,	-3232,	9403,
  -230,	-3230,	9430,
  -229,	-3227,	9458,
  -236,	-3213,	9489,
  -243,	-3199,	9520,
  -250,	-3185,	9551,
  -257,	-3171,	9582,
  -264,	-3157,	9613,
  -271,	-3143,	9643,
  -278,	-3129,	9674,
  -284,	-3115,	9705,
  -280,	-3115,	9732,
  -275,	-3115,	9758,
  -270,	-3114,	9785,
  -265,	-3114,	9812,
  -261,	-3114,	9838,
  -256,	-3113,	9865,
  -251,	-3113,	9891,
  -246,	-3113,	9918,
  -241,	-3112,	9945,
  -232,	-3095,	9976,
  -222,	-3077,	10008,
  -213,	-3060,	10040,
  -203,	-3042,	10072,
  -193,	-3025,	10104,
  -184,	-3007,	10135,
  -177,	-2988,	10167,
  -171,	-2968,	10199,
  -164,	-2949,	10231,
  -158,	-2929,	10263,
  -151,	-2910,	10295,
  -145,	-2891,	10326,
  -124,	-2878,	10356,
  -104,	-2866,	10386,
  -84,	-2854,	10415,
  -64,	-2842,	10445,
  -43,	-2829,	10474,
  -23,	-2817,	10504,
  -15,	-2754,	10546,
  -7,	-2691,	10588,
  0,	-2627,	10631,
  0,	-2553,	10674,
  0,	-2323,	10753,
  0,	-2318,	10779,
];
let timeout;
const vertices = data.map(x => x / 100);
const colors = vertices.map(v => THREE.MathUtils.randFloat(0, 1));
const midpointIndex = parseInt(vertices.length/2);
let loaded = false;
let prevIndex = midpointIndex;
let currentIndex = midpointIndex;
let selectedPoint = null;

export default function App() {
  const [camera, setCamera] = React.useState(null);
  const orbitShit = React.useRef();

  React.useEffect(() => {
    // Clear the animation loop when the component unmounts
    return () => clearTimeout(timeout);
  }, []);

  const onContextCreate = async (gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

    // Create a WebGLRenderer without a DOM element
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);
    renderer.setClearColor('white');

    const camera = new PerspectiveCamera(70, width / height, 0.01, 10000);
    camera.position.set(vertices[midpointIndex]+10, vertices[midpointIndex+1]+10, vertices[midpointIndex+2]+10);
    setCamera(camera);

    const scene = new Scene();
    scene.add(new GridHelper(10, 10));

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
    const material = new THREE.ShaderMaterial({
      vertexColors: THREE.VertexColors,
      uniforms: {
          size: {value: 20},
          scale: {value: 10},
      },
      defines: {
        // USE_MAP: "",
        // USE_SIZEATTENUATION: ""
      },
      vertexShader: THREE.ShaderLib.points.vertexShader,
      fragmentShader: `
      in vec3 vColor;
      void main() {
          vec2 xy = gl_PointCoord.xy - vec2(0.5);
          float ll = length(xy);
          if (ll > 0.5) discard;
          gl_FragColor = vec4(vColor, step(ll, 0.5));
      }
      `
    });
    const points = new THREE.Points( geometry, material );
    scene.add( points );

    const selectedGeometry = new THREE.BufferGeometry();
    selectedGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [vertices[currentIndex], vertices[currentIndex+1], vertices[currentIndex+2]], 3 ) );
    selectedGeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( [colors[currentIndex], colors[currentIndex+1], colors[currentIndex+2]], 3 ) );
    const selectedMaterial = new THREE.ShaderMaterial({
      vertexColors: THREE.VertexColors,
      depthTest: false,
      // transparent: true,
      uniforms: {
          size: {value: 40},
          scale: {value: 10},
      },
      defines: {
        // USE_MAP: "",
        // USE_SIZEATTENUATION: ""
      },
      vertexShader: THREE.ShaderLib.points.vertexShader,
      fragmentShader: `
      in vec3 vColor;
      void main() {
          vec2 xy = gl_PointCoord.xy - vec2(0.5);
          float ll = length(xy);
          if (ll > 0.5) discard;
          if (ll < 0.4) discard;
          gl_FragColor = vec4(vColor, step(ll, 0.5));
          // gl_FragColor.a = 0.8;
      }
      `
    });
    selectedPoint = new THREE.Points( selectedGeometry, selectedMaterial );
    selectedPoint.renderOrder = 999;
    scene.add( selectedPoint );

    const update = () => {
      if (prevIndex !== currentIndex) {
        selectedPoint.geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [vertices[currentIndex], vertices[currentIndex+1], vertices[currentIndex+2]], 3 ) );
        selectedPoint.geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( [colors[currentIndex], colors[currentIndex+1], colors[currentIndex+2]], 3 ) );
        prevIndex = currentIndex;
      }
    };

    // Setup an animation loop
    const render = (time) => {
      // hack just set initial point
      // TODO: figure out right way to do this
      if (!loaded && orbitShit.current.getControls()) {
        loaded = true;
        orbitShit.current.getControls().target.set( vertices[midpointIndex], vertices[midpointIndex+1], vertices[midpointIndex+2] );
        orbitShit.current.getControls().update();
      }

      TWEEN.update(time);
      update();
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
      <TouchableHighlight style={{ padding: 20, position: 'absolute', right: 0, top: 50}} onPress={()=> {
        const newIndex = currentIndex+3;
        const target = orbitShit.current.getControls().target;
        const from = { x: target.x, y: target.y, z: target.z };
        const coords = { x: target.x, y: target.y, z: target.z };
        const to = { x: vertices[newIndex], y: vertices[newIndex+1], z: vertices[newIndex+2] };
        const cameraOrig = camera.position.clone();
        new TWEEN.Tween(coords)
          .to(to, 500)
          .easing(TWEEN.Easing.Quadratic.Out)
          .onUpdate(() => {
            camera.position.set(coords.x - from.x + cameraOrig.x, coords.y - from.y + cameraOrig.y, coords.z - from.z + cameraOrig.z);
            orbitShit.current.getControls().target.set( coords.x, coords.y, coords.z );
            orbitShit.current.getControls().update();
          })
          .start();
        currentIndex = newIndex;
      }}><Text>NEXT</Text></TouchableHighlight>
      <TouchableHighlight style={{ padding: 20, position: 'absolute', right: 0, bottom: 50 }} onPress={()=> {
        const newIndex = currentIndex-3;
        const target = orbitShit.current.getControls().target;
        const from = { x: target.x, y: target.y, z: target.z };
        const coords = { x: target.x, y: target.y, z: target.z };
        const to = { x: vertices[newIndex], y: vertices[newIndex+1], z: vertices[newIndex+2] };
        const cameraOrig = camera.position.clone();
        new TWEEN.Tween(coords)
          .to(to, 500)
          .easing(TWEEN.Easing.Quadratic.Out)
          .onUpdate(() => {
            camera.position.set(coords.x - from.x + cameraOrig.x, coords.y - from.y + cameraOrig.y, coords.z - from.z + cameraOrig.z);
            orbitShit.current.getControls().target.set( coords.x, coords.y, coords.z );
            orbitShit.current.getControls().update();
          })
          .start();
        currentIndex = newIndex;
      }}><Text>PREV</Text></TouchableHighlight>
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