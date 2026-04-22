import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import SafeModal from 'app/shared_features/safe_modal/SafeModal';
import { SafeAreaView } from 'react-native-safe-area-context';

class SurveyModalView extends Component {
    _close() {
        this.props.closeModal();
    }

    // RENDER

    // TODO: grab the blue color for cancel from a global stylesheet
    _renderNavigation() {
        // TODO: consider using close icon instead of X text
        return (
            <View>
                <View style={styles.container}>
                    <View style={{ position: 'absolute', left: 0, top: 0 }}>
                        <TouchableOpacity onPress={() => this._close()}>
                            <View style={styles.nav}>
                                <FontAwesome
                                    name="times-circle"
                                    size={20}
                                    color="red"
                                />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.navTitle}>
                        <Text style={{ color: 'rgba(77, 77, 77, 1)' }}>
                            Survey
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

    render() {
        return (
            <SafeModal visible={this.props.isModalShowing}>
                <SafeAreaView
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        backgroundColor: 'rgba(242, 242, 242, 1)',
                    }}>
                    {this._renderNavigation()}

                    <WebView
                        source={{ uri: this.props.url }}
                        style={{ flex: 1 }}
                    />
                </SafeAreaView>
            </SafeModal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 50,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    nav: {
        paddingTop: 15,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 10,
    },
    navTitle: {
        paddingTop: 15,
    },
});

export default SurveyModalView;
