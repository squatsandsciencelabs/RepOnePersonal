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
}  from 'react-native';
import * as Device from 'app/utility/Device';

export default function (props) {
    return (
        <Modal
            animationType={"slide"}
            transparent={false}
            visible={props.isModalShowing} >
                {renderNavigation(props)}
        </Modal>
    );
}

const renderNavigation = (props) => {
    if (Device.isiPhoneX()) {
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
            <View style={{position: 'absolute', left: 0, top: 12}}>
                <TouchableOpacity onPress={() => props.cancelCalibration()}>
                    <View style={styles.nav}>
                        <Text style={[{color: 'rgba(47, 128, 237, 1)'}]}>Cancel</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    } else {
        var cancel = (
            <View style={{position: 'absolute', left: 0, top: 12}}>
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
                <Text style={styles.titleText}>3D Calibration</Text>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: Platform.OS === 'ios' && !Device.isiPhoneX() ? 70 : 50,
        alignItems: 'center'
    },
    nav: {
        paddingTop: Platform.OS === 'ios' && !Device.isiPhoneX() ? 35 : 15,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 10
    },
    navTitle: {
        paddingTop: 15,
    },
    titleText: {
        color: 'rgba(77, 77, 77, 1)',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
});