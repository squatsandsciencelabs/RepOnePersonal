import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';
import { getKratosEnabled } from 'app/configs+constants/KratosConfig';
import Localized from 'app/services/Localization';

class WhatIsOneRMView extends Component {
    _close() {
        this.props.closeModal();
    }

    render() {
        const body = Localized('WHAT_IS_ONE_RM_MODAL.BODY');
        const top = Platform.OS === 'ios' ? 0 : 5;

        return (
            <View>
                <Modal
                    visible={this.props.isModalShowing}
                    animationType={'fade'}
                    onRequestClose={() => this.closeModal()}
                    transparent={true}>
                    <View style={styles.container}>
                        <View style={styles.bodyContainer}>
                            <Text style={styles.titleText}>
                                {Localized('WHAT_IS_ONE_RM_MODAL.TITLE')}
                            </Text>

                            <View
                                style={{ position: 'absolute', left: 0, top }}>
                                <TouchableOpacity onPress={() => this._close()}>
                                    <View style={styles.nav}>
                                        <Icon
                                            name="times-circle"
                                            size={20}
                                            color="red"
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>

                            {getKratosEnabled() && (
                                <View style={styles.kratosNote}>
                                    <Text>
                                        <Text style={styles.bold}>
                                            {Localized('NOTE')}&nbsp;
                                        </Text>
                                        <Text>
                                            {Localized(
                                                'WHAT_IS_ONE_RM_MODAL.KRATOS_NOT_COMPATIBLE_MESSAGE',
                                            )}
                                        </Text>
                                    </Text>
                                </View>
                            )}

                            <Text>{body}</Text>

                            <TouchableOpacity
                                style={{ alignItems: 'center', marginTop: 20 }}
                                onPress={() => this.props.presentAlgorithm()}>
                                <Text
                                    style={[
                                        SETTINGS_PANEL_STYLES.tappableText,
                                    ]}>
                                    {Localized(
                                        'WHAT_IS_ONE_RM_MODAL.ALGORITHM_BUTTON',
                                    )}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ alignItems: 'center', marginTop: 15 }}
                                onPress={() => this.props.presentBestResults()}>
                                <Text
                                    style={[
                                        SETTINGS_PANEL_STYLES.tappableText,
                                    ]}>
                                    {Localized(
                                        'WHAT_IS_ONE_RM_MODAL.RESULTS_BUTTON',
                                    )}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    bodyContainer: {
        padding: 25,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginLeft: 10,
        marginRight: 10,
    },
    nav: {
        paddingTop: Platform.OS === 'ios' ? 15 : 5,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 10,
    },
    titleText: {
        color: 'rgba(77, 77, 77, 1)',
        textAlign: 'center',
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 20,
    },
    kratosNote: {
        marginBottom: 15,
    },
    bold: { fontWeight: 'bold' },
});

export default WhatIsOneRMView;
