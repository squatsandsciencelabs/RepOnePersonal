import { GLView } from 'expo-gl';
import { Renderer, loadAsync } from 'expo-three';
import OrbitControlsView from 'expo-three-orbit-controls';
import * as React from 'react';
import {
  TouchableOpacity,
  TouchableHighlight,
  Text,
  StyleSheet,
  View,
  Platform,
  Dimensions,
  Image,
} from 'react-native';
import Slider from '@react-native-community/slider';
import {
  PerspectiveCamera,
  Scene,
  AmbientLight,
} from 'three';
import * as TWEEN from "@tweenjs/tween.js";
import TargetCircle from 'app/shared_features/target/TargetCircle';

// animations
const renderScale = 100;
const zoomDistance = 50;

// slider visuals
if (Platform.OS === 'ios') {
  var thumbTintColor = '#ffffff';
} else {
  var thumbTintColor = '#368fff';
}

// default up
THREE.Object3D.DefaultUp.set(0, 0, 1);

// rendering material
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

export default function App(props) {
    // pull from props
    const model = props.model;
    const data = props.data;
    const colors = props.colors;
    const vertices = props.vertices;
    const midpointIndex = props.midpointIndex;
    const numPoints = props.numPoints;

    // helpers
    const hasData = model && data.length > 0;
    const initialX = hasData ? data[0].x / renderScale : 0;
    const initialY = hasData ? data[0].y / renderScale : 0;
    const initialZ = hasData ? data[0].z / renderScale : 0;
    const midX = hasData ? data[midpointIndex].x / renderScale : 0;
    const midY = hasData ? data[midpointIndex].y / renderScale : 0;
    const midZ = hasData ? data[midpointIndex].z / renderScale : 0;

    // NOTE: we do NOT want re-renders of the component in most cases due to rendering being handled by GLView
    // therefore, modify the state directly here for data changes
    // and for rerenders, for instance after sliding is completed, call setState({...state})
    const [state, setState] = React.useState({
        repIndex: props.repIndex,
        vertices: null, // to determine should re-render points from bulk data coming in
        scene: null,
        points: null,
        sensor: null,
        selected: [],
        currentIndex: midpointIndex,
        timeout: null,
        sphereVisible: false,
        cameraTween: null,
        sphereTween: null,
        isLoaded: false,
    });

    // camera, separate from general state just in case as it's referenced directly in the render function
    const [camera, setCamera] = React.useState(null);

    // refs
    const orbitControls = React.useRef();

    React.useEffect(() => {
        // Clear the animation loop when the component unmounts
        return () => {
            console.tron.log(`clear 3d mode, timeout is ${state.timeout}`);
            clearTimeout(state.timeout);
        };
    }, []);

    console.tron.log(`initialize 3d mode, prev ${props.prevRepIndex} next ${props.nextRepIndex}`);

    const rerender = () => setState({...state});

    const updateIndex = (newIndex, shouldRender=false) => {
        // save it without re-rendering
        state.currentIndex = newIndex;

        // update target
        state.selected.length = 0;
        for (let i=0; i<numPoints; i++) {
            state.selected.push(i === newIndex ? 1.0 : 0.0);
        }
        state.points.geometry.setAttribute( 'selected', new THREE.Float32BufferAttribute( state.selected, 1 ) );

        // rerender if needed
        // called on prev, next, and the default camera positions
        if (shouldRender) {
            rerender();
        }
    };

    const zoomTo = (newIndex, shouldRender=false) => {
        if (newIndex < 0 || newIndex >= numPoints) {
            return;
        }

        if (state.cameraTween) { state.cameraTween.stop(); }

        const target = orbitControls.current.getControls().target;
        const from = { x: target.x, y: target.y, z: target.z };
        const coords = { x: target.x, y: target.y, z: target.z };
        const to = { x: data[newIndex].x / renderScale, y: data[newIndex].y / renderScale, z: data[newIndex].z / renderScale };
        const cameraOrig = camera.position.clone();

        state.cameraTween = new TWEEN.Tween(coords)
            .to(to, 500)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
                camera.position.set(coords.x - from.x + cameraOrig.x, coords.y - from.y + cameraOrig.y, coords.z - from.z + cameraOrig.z);
                orbitControls.current.getControls().target.set( coords.x, coords.y, coords.z );
                orbitControls.current.getControls().update();
            })
            .onComplete(() => {
                state.cameraTween = null;
            })
            .start();
        updateIndex(newIndex, shouldRender);
    };

    const lookTop = () => {
        camera.position.set(initialX+.0000001, initialY, initialZ+zoomDistance+(initialZ-initialX));
        orbitControls.current.getControls().target.set( initialX, initialY, initialZ );
        orbitControls.current.getControls().update();
        updateIndex(0, true);
    };

    const lookFront = () => {
        camera.position.set(midX+zoomDistance, midY, midZ);
        orbitControls.current.getControls().target.set( midX, midY, midZ );
        orbitControls.current.getControls().update();
        updateIndex(midpointIndex, true);
    };

    const lookSide = () => {
        camera.position.set(midX, midY+zoomDistance, midZ);
        orbitControls.current.getControls().target.set( midX, midY, midZ );
        orbitControls.current.getControls().update();
        updateIndex(midpointIndex, true);
    };

    const onContextCreate = async (gl) => {
        console.tron.log(`on context create`);
        const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

        // Create a WebGLRenderer without a DOM element
        const renderer = new Renderer({ gl });
        renderer.setSize(width, height);
        renderer.setClearColor(0xffffff);

        // camera
        const camera = new PerspectiveCamera(70, width / height, 0.01, 10000);
        camera.position.set(midX, midY+zoomDistance, midZ);
        setCamera(camera);

        // scene
        const scene = new Scene();
        state.scene = scene;
        // scene.scale.set(-1, 1, 1); // depends on coordinate plane

        // light
        // const ambientLight = new AmbientLight( 0xffffff, 1, 100);
        // scene.add( ambientLight );

        // skysphere
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

        // grid position helpers
        // const helperGeo = new THREE.SphereBufferGeometry(0.5, 8, 8);
        // const helperMat1 = new THREE.MeshBasicMaterial({color: 'red'});
        // const helper1 = new THREE.Mesh(helperGeo, helperMat1);
        // helper1.position.set(0, 0, 0);
        // scene.add(helper1);
        // const helperMat2 = new THREE.MeshBasicMaterial({color: 'green'});
        // const helper2 = new THREE.Mesh(helperGeo, helperMat2);
        // helper2.position.set(1, 0, 0);
        // scene.add(helper2);
        // const helperMat3 = new THREE.MeshBasicMaterial({color: 'blue'});
        // const helper3 = new THREE.Mesh(helperGeo, helperMat3);
        // helper3.position.set(0, 1, 0);
        // scene.add(helper3)
        // const helperMat4 = new THREE.MeshBasicMaterial({color: 'yellow'});
        // const helper4 = new THREE.Mesh(helperGeo, helperMat4);
        // helper4.position.set(0, 0, 1);
        // scene.add(helper4)

        // sensor
        const sensor = await loadAsync(require('app/appearance/models/sensor.obj'));
        // const texture = await loadAsync(require('app/appearance/images/adam.png'));
        // sensor.traverse((o) => {
        //     if (o.isMesh) {
        //         o.material.map = texture;
        //     }
        // });
        sensor.position.set(initialX, initialY, initialZ-10);
        sensor.rotateX(Math.PI * 0.5);
        sensor.rotateY(Math.PI * 0.5);
        scene.add(sensor);
        state.sensor = sensor;

        // recalculate selected
        for (let i=0; i<numPoints; i++) {
            state.selected.push(i === state.currentIndex ? 1.0 : 0.0);
        }

        // draw
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
        geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
        geometry.setAttribute( 'selected', new THREE.Float32BufferAttribute( state.selected, 1 ) );
        const points = new THREE.Points( geometry, material );
        scene.add(points);
        state.points = points;
        state.vertices = vertices;

        // Setup an animation loop
        const render = (time) => {
            // was remved from view hierarchy
            if (!orbitControls.current) {
                console.tron.log(`render, but orbshit removed from view hierarchy`);
                return;
            }
            const controls = orbitControls.current.getControls();
            // hack just set initial point
            // TODO: figure out right way to do this as I don't really get an "onLoad" function callback FFS
            if (!state.isLoaded && controls) {
                console.tron.log(`render initialize target ${state.isLoaded}`);
                state.isLoaded = true;
                controls.target.set( midX, midY, midZ );
                controls.update();
            }

            // update animations
            TWEEN.update(time);

            // update spherebox
            if (controls) {
                if (controls.state === 3) {
                    if (!state.sphereVisible) {
                        state.sphereVisible = true;

                        if (state.sphereTween) { state.sphereTween.stop() }

                        const opacity = {value: sphere.material.opacity};
                        state.sphereTween = new TWEEN.Tween(opacity)
                            .to({value: 1.0}, 300)
                            .easing(TWEEN.Easing.Quadratic.In)
                            .onUpdate(() => {
                                sphere.material.opacity = opacity.value;
                            })
                            .onComplete(() => {
                                state.sphereTween = null;
                            })
                            .start();
                    }
                } else if (state.sphereVisible) {
                    state.sphereVisible = false;

                    if (state.sphereTween) { state.sphereTween.stop() }

                    const opacity = {value: sphere.material.opacity};
                    state.sphereTween = new TWEEN.Tween(opacity)
                        .to({value: 0.0}, 300)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .onUpdate(() => {
                            sphere.material.opacity = opacity.value;
                        })
                        .onComplete(() => {
                            state.sphereTween = null;
                        })
                        .start();
                }
            }

            const timeout = requestAnimationFrame(render);
            state.timeout = timeout;
            renderer.render(scene, camera);
            gl.endFrameEXP();
        };
        render();
    };

    // update points
    if ((props.repIndex !== state.repIndex || vertices !== state.vertices) && state.scene && state.points && state.sensor) {
        // reset rep index and vertices
        state.repIndex = props.repIndex;
        state.vertices = vertices;

        // remove points
        state.scene.remove(state.points);

        // recreate points
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
        geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
        geometry.setAttribute( 'selected', new THREE.Float32BufferAttribute( state.selected, 1 ) ); // selected will be recreate with look side, so no need to redo it here
        const points = new THREE.Points( geometry, material );
        state.scene.add(points);
        state.points = points;

        // reposition sensor
        state.sensor.position.set(initialX, initialY, initialZ-10);

        // reposition
        lookSide(); 
    }

    // conditional renders
    let summary = null;
    let sliderControls = null;
    let cameraControls = null;
    let errorMessage = null;
    if (hasData) {
        summary = (<React.Fragment>
            <View style={styles.column}>
                <View>
                    <Text style={styles.label}>AVG</Text>
                    <Text style={styles.label}>PKV</Text>
                    <Text style={styles.label}>PKH</Text>
                    <Text style={styles.label}>ROM</Text>
                    <Text style={styles.label}>DUR</Text>
                </View>
                <View>
                    <Text style={styles.data}>{model.averageVelocity}</Text>
                    <Text style={styles.data}>{model.peakVelocity}</Text>
                    <Text style={styles.data}>{model.peakVelocityLocation}</Text>
                    <Text style={styles.data}>{model.rangeOfMotion}</Text>
                    <Text style={styles.data}>{model.duration}</Text>
                </View>
            </View>
            <TargetCircle style={styles.circle} color={data[state.currentIndex].color} size={10} />
            <View style={styles.column}>
                <View>
                    <Text style={styles.label}>VEL</Text>
                    <Text style={styles.label}>ACC</Text>
                    <Text style={styles.label}>POS</Text>
                    <Text style={styles.label}>TIME</Text>
                </View>
                <View>
                    <Text style={styles.data}>{data[state.currentIndex].displayVelocity}</Text>
                    <Text style={styles.data}>{data[state.currentIndex].displayAcceleration}</Text>
                    <Text style={styles.data}>{state.currentIndex+1}</Text>
                    <Text style={styles.data}>{data[state.currentIndex].displayTime}</Text>
                </View>
            </View>
        </React.Fragment>);

        cameraControls = (<View style={styles.presetCamera}>
            <TouchableHighlight style={styles.cameraItem} onPress={()=> lookFront()}><Text style={styles.cameraText}>FRONT</Text></TouchableHighlight>
            <TouchableHighlight style={styles.cameraItem} onPress={()=> lookSide()}><Text style={styles.cameraText} >SIDE</Text></TouchableHighlight>
            <TouchableHighlight style={[styles.cameraItem, styles.lastCameraItem]} onPress={()=> lookTop()}><Text style={styles.cameraText}>TOP</Text></TouchableHighlight>
        </View>);

        sliderControls = (<React.Fragment>
            <View style={styles.sliderContainer}>
                <View style={styles.sliderRotateContainer}>
                    <View style={styles.sliderLayout}>
                        {/* prev */}
                        <TouchableOpacity style={styles.sliderPrev} onPress={()=> {
                            zoomTo(state.currentIndex-1, true);
                        }}><Image source={require('app/appearance/images/left_arrow.png')} /></TouchableOpacity>

                        {/* slider */}
                        <Slider
                            value={state.currentIndex} 
                            style={styles.slider}
                            onValueChange={(value) => zoomTo(value) }
                            minimumValue={0}
                            maximumValue={numPoints-1}
                            step={1}
                            thumbTintColor={thumbTintColor}
                            minimumTrackTintColor={'#D1D1D1'}
                            maximumTrackTintColor={'#D1D1D1'}
                            animateTransitions={true}
                            onSlidingComplete={rerender}
                        />

                        {/* next */}
                        <TouchableOpacity style={styles.sliderNext} onPress={()=> {
                            zoomTo(state.currentIndex+1, true);
                        }}><Image source={require('app/appearance/images/right_arrow.png')} /></TouchableOpacity>
                    </View>
                </View>
            </View>


        </React.Fragment>);
    }
    if (props.errorMessage) {
        errorMessage = <View style={styles.errorContainer}><Text style={styles.errorMessage}>{props.errorMessage}</Text></View>
    }

    // render
    return (<View style={{ flex: 1, backgroundColor: 'white' }}>

        {/* 3d */}
        <OrbitControlsView style={{ flex: 1 }} camera={camera} ref={orbitControls}>
            <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} key="d" />
        </OrbitControlsView>

        {/* error */}
        {errorMessage}

        {/* summary information */}
        <View style={styles.description}>
            <Text style={styles.exercise}>{props.exercise}</Text>
            <Text style={styles.repTitle}>{props.title}</Text>
            {summary}
        </View>

        {/* camera presets */}
        {cameraControls}

        {/* slider */}
        {sliderControls}

        {/* navigate */}
        <View style={styles.navigation}><Text style={styles.navigationText}>{props.navigationText}</Text></View>

        {/* navigate prev */}
        <TouchableOpacity style={styles.navPrevRep} onPress={()=> props.prevRepIndex !== -1 ? props.navigateToRep(props.prevRepIndex) : false}><Image source={require('app/appearance/images/left_arrow.png')} /></TouchableOpacity>

        {/* navigate next */}
        <TouchableOpacity style={styles.navNextRep} onPress={()=> props.nextRepIndex !== -1 ? props.navigateToRep(props.nextRepIndex) : false}><Image source={require('app/appearance/images/right_arrow.png')} /></TouchableOpacity>

        {/* close */}
        <TouchableOpacity style={styles.close} onPress={()=> props.tappedClose()}><Image source={require('app/appearance/images/x.png')} /></TouchableOpacity>
    </View>);
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    description: {
        position: 'absolute',
        top: 15,
        left: 15,
    },
    exercise: {
        color: 'rgba(130, 130, 130, 1)',
        fontWeight: 'bold',
    },
    repTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        paddingTop: 7,
        paddingBottom: 7,
        color: 'rgba(79, 79, 79, 1)',
    },
    column: {
        flexDirection: 'row',
    },
    label: {
        width: 45,
        color: 'rgba(130, 130, 130, 1)',
        fontWeight: 'bold',
    },
    data: {
        color: 'rgba(79, 79, 79, 1)',
    },
    //circle
    circle: {
        marginTop: 15,
        marginBottom: 5,
    },

    // slider
    sliderNext: {
        padding: 10,
        marginLeft: 10,
    },
    sliderContainer: {
        position: 'absolute',
        top: 100,
        bottom: 100,
        right: 5,
        width: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    sliderRotateContainer: {
        transform: [{ rotate: '-90deg' }],
        flexDirection: 'column-reverse',
    },
    sliderLayout: {
        flexDirection: 'row',
    },
    slider: {
        width: windowHeight * 0.55,
    },
    sliderPrev: {
        padding: 10,
        marginRight: 10,
    },

    // camera
    presetCamera: {
        position: 'absolute',
        bottom: 60,
        left: 0,
        right: 0,
        height: 30,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.5,
    },
    cameraItem: {
        width: 80,
        paddingTop: 5,
        paddingBottom: 5,
        borderLeftWidth: 1,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        alignItems: 'center',
        borderColor: 'rgba(51, 51, 51, 1)',
    },
    lastCameraItem: {
        borderRightWidth: 1,
    },
    cameraText: {
        color: 'rgba(51, 51, 51, 1)',
    },

    // nav
    navigation: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 50,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    navigationText: {
        color: 'rgba(51, 51, 51, 1)',
    },
    navPrevRep: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 50,
        height: 50,
        padding: 15,
    },
    navNextRep: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 50,
        height: 50,
        padding: 15,
    },

    // close
    close: {
        position: 'absolute',
        padding: 25,
        top: 0,
        right: 0,
    },

    // error
    errorContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
    errorMessage: {
        color: 'rgba(130, 130, 130, 1)',
        fontWeight: 'bold',
    }
});
