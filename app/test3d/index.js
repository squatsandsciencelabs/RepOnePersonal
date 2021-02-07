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
  0,	-2318,	10779
];
const times = [
  0,
  61177,
  87138,
  107211,
  124154,
  137561,
  148802,
  159517,
  168533,
  177231,
  184846,
  192048,
  199447,
  206021,
  212069,
  218527,
  224389,
  230431,
  235939,
  241346,
  247016,
  252210,
  257008,
  262297,
  267122,
  272116,
  276795,
  281380,
  286229,
  290817,
  295105,
  299753,
  304063,
  308624,
  312980,
  317110,
  321743,
  326057,
  330140,
  334644,
  338866,
  343242,
  347366,
  351513,
  355948,
  360208,
  364263,
  368658,
  372766,
  377071,
  381158,
  385257,
  389696,
  393959,
  397967,
  402319,
  406580,
  411068,
  415334,
  419661,
  424321,
  428786,
  433044,
  437714,
  442193,
  446805,
  451162,
  455623,
  460277,
  464713,
  468963,
  473552,
  477837,
  482414,
  486730,
  491054,
  495751,
  500166,
  504365,
  509001,
  513374,
  517982,
  522279,
  526613,
  531233,
  535607,
  539768,
  544423,
  548749,
  553296,
  557610,
  561881,
  566456,
  570833,
  575052,
  579449,
  583614,
  587996,
  592109,
  596197,
  600700,
  604861,
  608784,
  613141,
  617255,
  622637,
  628639,
  634562,
  640684,
  646535,
  652156,
  658150,
  663644,
  669602,
  675258,
  680878,
  686431,
  691590,
  696233,
  701177,
  705912,
  710856,
  715592,
  720376,
  725539,
  730636,
  735567,
  741036,
  746290,
  751879,
  757385,
  762993,
  769175,
  775362,
  781513,
  788336,
  794733,
  801524,
  807947,
  814358,
  821291,
  827736,
  833781,
  840427,
  846637,
  853038,
  859021,
  864935,
  871181,
  876948,
  882397,
  888542,
  894260,
  900258,
  906028,
  911835,
  918159,
  924280,
  930170,
  936717,
  942921,
  949599,
  955884,
  962202,
  969268,
  975875,
  982109,
  988994,
  995387,
  1001989,
  1008178,
  1014374,
  1021036,
  1027368,
  1033465,
  1040210,
  1046636,
  1053587,
  1060346,
  1067351,
  1075230,
  1082951,
  1090457,
  1098803,
  1107126,
  1116014,
  1124461,
  1132803,
  1141440,
  1149579,
  1157192,
  1165442,
  1173325,
  1181402,
  1189090,
  1196943,
  1205200,
  1213178,
  1220895,
  1229918,
  1239341,
  1250513,
  1262079,
  1274049,
  1287245,
  1300305,
  1313912,
  1328964,
  1341670,
  1353845,
  1364787,
  1375695,
  1387462,
  1399038,
  1411046,
  1426010,
  1441743,
  1461861,
  1482964,
  1505633,
  1537625,
  1693460,
  1844083
];
const speeds = [0];
for (let i=3, j=1; i<data.length; i+=3, j++) {
  const deltaT = times[j]-times[j-1];
  const prevPoint = new THREE.Vector3(data[i-3], data[i-2], data[i-1]);
  const currentPoint = new THREE.Vector3(data[i], data[i+1], data[i+2]);
  const deltaD = prevPoint.distanceTo(currentPoint);
  const speed = parseFloat(deltaD / deltaT);
  speeds.push(speed);
}
const maxSpeed = Math.max(...speeds);
const halfSpeed = maxSpeed * 0.5;
const colors = [1, 0, 0];
speeds.forEach(s => {
  const r = s <= halfSpeed ? 1 : 1 - ((s-halfSpeed) / halfSpeed);
  const g = s >= halfSpeed ? 1 : s / halfSpeed;
  colors.push(r, g, 0);
});

let timeout;
const vertices = data.map(x => x / 100);
const midpointIndex = Math.floor(times.length/2) * 3;
let loaded = false;
let prevIndex = midpointIndex;
let currentIndex = midpointIndex;
let points;

// animations
let sphereVisible = false;
let cameraTween = null;
let sphereTween = null;

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
    // renderer.setClearColor(new THREE.Color(0.97, 0.97, 0.97));
    renderer.setClearColor(0xffffff);

    const camera = new PerspectiveCamera(70, width / height, 0.01, 10000);
    camera.position.set(vertices[midpointIndex]+10, vertices[midpointIndex+1]+10, vertices[midpointIndex+2]+10);
    setCamera(camera);

    const scene = new Scene();

    const sphereGeometry = new THREE.SphereGeometry( 1000, 25, 25 );
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(0.8, 0.8, 0.8),
        side: THREE.BackSide,
        wireframe: true,
        opacity: 0,
        transparent: true,
    });
    const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
    scene.add(sphere);

    // recalcualte selected
    const selected = [];
    for (let i=0; i<data.length; i+=3) {
      selected.push(i === currentIndex ? 1.0 : 0.0);
    }

    // draw
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
    geometry.setAttribute( 'selected', new THREE.Float32BufferAttribute( selected, 1 ) );
    const material = new THREE.ShaderMaterial({
      vertexColors: THREE.VertexColors,
      uniforms: {
          size: {value: 20},
          scale: {value: 10},
      },
      defines: {
        USE_MAP: "",
        USE_SIZEATTENUATION: ""
      },
      vertexShader: `
      uniform float size;
      uniform float scale;
      in float selected;
      out float vSelected;
      #include <common>
      #include <color_pars_vertex>
      #include <fog_pars_vertex>
      #include <morphtarget_pars_vertex>
      #include <logdepthbuf_pars_vertex>
      #include <clipping_planes_pars_vertex>
      void main() {
        #include <color_vertex>
        #include <begin_vertex>
        #include <morphtarget_vertex>
        #include <project_vertex>
        vSelected = selected;
        if (vSelected > 0.0) {
          gl_PointSize = size * 3.0;
        } else {
          gl_PointSize = size;
        }
        #ifdef USE_SIZEATTENUATION
          bool isPerspective = isPerspectiveMatrix( projectionMatrix );
          if ( isPerspective ) {
            gl_PointSize *= ( scale / - mvPosition.z );
            gl_PointSize = max(gl_PointSize, vSelected > 0.0 ? 30.0 : 10.0);
          }
        #endif
        #include <logdepthbuf_vertex>
        #include <clipping_planes_vertex>
        #include <worldpos_vertex>
        #include <fog_vertex>
      }
      `,
      fragmentShader: `
      in vec3 vColor;
      in float vSelected;
      void main() {
          if (vSelected > 0.0) {
            vec2 xy = gl_PointCoord.xy - vec2(0.5);
            float ll = length(xy);
            if (ll > 0.5) discard;
            if (ll > 0.25 && ll < 0.4) discard;
            gl_FragColor = vec4(vColor, step(ll, 0.5));
          } else {
            vec2 xy = gl_PointCoord.xy - vec2(0.5);
            float ll = length(xy);
            if (ll > 0.5) discard;
            gl_FragColor = vec4(vColor, step(ll, 0.5));
          }
      }
      `
    });
    points = new THREE.Points( geometry, material );
    scene.add( points );

    // Setup an animation loop
    const render = (time) => {
      const controls = orbitShit.current.getControls();
      // hack just set initial point
      // TODO: figure out right way to do this
      if (!loaded && controls) {
        loaded = true;
        controls.target.set( vertices[midpointIndex], vertices[midpointIndex+1], vertices[midpointIndex+2] );
        controls.update();
      }

      // update animations
      TWEEN.update(time);

      // update target
      if (prevIndex !== currentIndex) {
        // recreate selected as somehow just modify it isn't enough
        selected.length = 0;
        for (let i=0; i<data.length; i+=3) {
          selected.push(i === currentIndex ? 1.0 : 0.0);
        }
        points.geometry.setAttribute( 'selected', new THREE.Float32BufferAttribute( selected, 1 ) );
        prevIndex = currentIndex;
      }

      // update sphere
      if (controls) {
        if (controls.state === 3) {
          if (!sphereVisible) {
            sphereVisible = true;

            if (sphereTween) { sphereTween.stop() }

            const opacity = {value: sphere.material.opacity};
            sphereTween = new TWEEN.Tween(opacity)
            .to({value: 1.0}, 300)
            .easing(TWEEN.Easing.Quadratic.In)
            .onUpdate(() => {
              sphere.material.opacity = opacity.value;
            })
            .onComplete(() => {
              sphereTween = null;
            })
            .start();
          }
        } else if (sphereVisible) {
          sphereVisible = false;

          if (sphereTween) { sphereTween.stop() }

          const opacity = {value: sphere.material.opacity};
          sphereTween = new TWEEN.Tween(opacity)
          .to({value: 0.0}, 300)
          .easing(TWEEN.Easing.Quadratic.Out)
          .onUpdate(() => {
            sphere.material.opacity = opacity.value;
          })
          .onComplete(() => {
            sphereTween = null;
          })
          .start();
        }
      }

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
        if (cameraTween) { cameraTween.stop(); }

        const newIndex = currentIndex+3;
        const target = orbitShit.current.getControls().target;
        const from = { x: target.x, y: target.y, z: target.z };
        const coords = { x: target.x, y: target.y, z: target.z };
        const to = { x: vertices[newIndex], y: vertices[newIndex+1], z: vertices[newIndex+2] };
        const cameraOrig = camera.position.clone();
        cameraTween = new TWEEN.Tween(coords)
          .to(to, 500)
          .easing(TWEEN.Easing.Quadratic.Out)
          .onUpdate(() => {
            camera.position.set(coords.x - from.x + cameraOrig.x, coords.y - from.y + cameraOrig.y, coords.z - from.z + cameraOrig.z);
            orbitShit.current.getControls().target.set( coords.x, coords.y, coords.z );
            orbitShit.current.getControls().update();
          })
          .onComplete(() => {
            cameraTween = null;
          })
          .start();
        currentIndex = newIndex;
      }}><Text>NEXT</Text></TouchableHighlight>
      <TouchableHighlight style={{ padding: 20, position: 'absolute', right: 0, bottom: 50 }} onPress={()=> {
        if (cameraTween) { cameraTween.stop(); }

        const newIndex = currentIndex-3;
        const target = orbitShit.current.getControls().target;
        const from = { x: target.x, y: target.y, z: target.z };
        const coords = { x: target.x, y: target.y, z: target.z };
        const to = { x: vertices[newIndex], y: vertices[newIndex+1], z: vertices[newIndex+2] };
        const cameraOrig = camera.position.clone();
        cameraTween = new TWEEN.Tween(coords)
          .to(to, 500)
          .easing(TWEEN.Easing.Quadratic.Out)
          .onUpdate(() => {
            camera.position.set(coords.x - from.x + cameraOrig.x, coords.y - from.y + cameraOrig.y, coords.z - from.z + cameraOrig.z);
            orbitShit.current.getControls().target.set( coords.x, coords.y, coords.z );
            orbitShit.current.getControls().update();
          })
          .onComplete(() => {
            cameraTween = null;
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