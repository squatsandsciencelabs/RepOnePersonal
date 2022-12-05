import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    Alert,
    Platform,
    StatusBar,
    ScrollView,
    Image,
}  from 'react-native';
import * as Device from 'app/utility/Device';
import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';

export default function (props) {
    return (
        <Modal
            animationType={"slide"}
            transparent={false}
            visible={props.isModalShowing} >
                {renderNavigation(props)}
                <ScrollView style={{flex: 1, backgroundColor: 'rgba(229, 229, 229, 1)'}}>
                    {renderStep1(props)}
                    {renderStep2(props)}
                </ScrollView>
        </Modal>
    );
}

const renderNavigation = (props) => {
    if (Device.hasNotch()) {
        var statusBar = (
            <View>
                <StatusBar
                    backgroundColor="white"
                    barStyle="dark-content"
                />
            </View>
        );
    } else if (Platform.OS === 'ios') {
        var statusBar = (<View style={{height: 20, width: 9001, backgroundColor: 'black'}}></View>);
    } else {
        var statusBar = null;
    }

    if (props.isCancelEnabled) {
        var cancel = (
            <View style={{position: 'absolute', left: 0, top: 3 }}>
                <TouchableOpacity onPress={() => props.cancelCalibration()}>
                    <View style={styles.nav}>
                        <Text style={[{color: 'rgba(47, 128, 237, 1)'}]}>Cancel</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    } else {
        var cancel = (
            <View style={{position: 'absolute', left: 0, top: 3 }}>
                <View style={styles.nav}>
                    <Text style={[{color: 'rgba(130, 130, 130, 1)'}]}>Cancel</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            { statusBar }

            { cancel }

            <View style={styles.navTitle}>
                <Text style={styles.navTitleText}>3D Calibration</Text>
            </View>

        </View>
    )
}

const renderStep1 = props => {
    if (props.step !== 1) {
        return null;
    }

    return (<View>
        <View style={ [SETTINGS_PANEL_STYLES.panel, { padding: 20, flexDirection: 'column' }] }>
            <Text style={styles.titleText}>Step 1</Text>
            <Text style={styles.text}>
                Pull the tether out at least one foot, and make sure no objects (including your hand) are near the nozzle <Text style={styles.boldText}>before you begin calibration</Text>.
            </Text>
            <Image style={styles.singleImageStyle} source={require('app/appearance/images/calibration_step_1.png')} />
            <TouchableOpacity style={[SETTINGS_PANEL_STYLES.blueButton, {height: 50, marginTop: 10, marginBottom: 10}]}
                onPress={props.startCalibration.bind(this)}>
                    <Text style={SETTINGS_PANEL_STYLES.buttonText}>I’m holding the tether, start calibration</Text>
            </TouchableOpacity>
        </View>
    </View>);
};

const renderStep2 = props => {
    if (props.step !== 2) {
        return null;
    }

    return (<View>
        <View style={ [SETTINGS_PANEL_STYLES.panel, { padding: 20, flexDirection: 'column' }] }>
            <Text style={styles.titleText}>Step 2</Text>
            <Text style={styles.text}>
                Pull the tether to a sharp angle and move it in circles around the perimeter of the nozzle.
            </Text>
            <View style={styles.doubleImageStyle}>
                <Image source={require('app/appearance/images/calibration_step_2a.png')} />
                <Image source={require('app/appearance/images/calibration_step_2b.png')} />
            </View>
            <Text style={styles.text}>
                Continue to circle the nozzle until you <Text style={styles.boldText}>no longer see the numbers on the device’s screen changing.</Text>
            </Text>
            <TouchableOpacity style={[SETTINGS_PANEL_STYLES.blueButton, {height: 50, marginTop: 10, marginBottom: 10}]}
                onPress={props.finishCalibration.bind(this)}>
                    <Text style={SETTINGS_PANEL_STYLES.buttonText}>The numbers are no longer changing</Text>
            </TouchableOpacity>
        </View>
    </View>);
};


const styles = StyleSheet.create({
    container: {
        height: Platform.OS === 'ios' && !Device.hasNotch() ? 70 : 50,
        alignItems: 'center'
    },
    nav: {
        paddingTop: Platform.OS === 'ios' && !Device.hasNotch() ? 35 : 15,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 10
    },
    navTitle: {
        paddingTop: 7,
    },
    navTitleText: {
        color: 'rgba(77, 77, 77, 1)',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    singleImageStyle: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 30,
        marginBottom: 30,
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    doubleImageStyle: {
        marginLeft: 30,
        marginRight: 30,
        marginTop: 30,
        marginBottom: 30,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    titleText: {
        color: 'rgba(51, 51, 51, 1)',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    text: {
        color: 'rgba(51, 51, 51, 1)',
        fontSize: 14,
    },
    boldText: {
        fontWeight: 'bold',
    }
});