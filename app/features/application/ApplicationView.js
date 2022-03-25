// TODO: NavigationConfig info should ideally be passed in from the screen rather than pulled from the view
// TODO: Fix Kill Switch bug on rotation
// TODO: move the kill switch UI (not the logic) to another file, it doesn't belong in the Application
// TODO: Kill switch should link to the app store to make it easier to update
// TODO: recommended but NOT required update

import React, { useState, useEffect } from 'react';
import {
    Text,
    StatusBar,
    StyleSheet,
    View,
    Alert,
    Platform,
} from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as NavigationConfig from 'app/configs+constants/NavigationConfig';
// import SurveyModalScreen from 'app/shared_features/survey/SurveyModalScreen';
import Badge from './Badge';

function ApplicationView(props) {
    const insets = useSafeAreaInsets();
    const [index, setIndex] = useState(NavigationConfig.initialIndex);
    const [routes] = useState(NavigationConfig.routes);

    useEffect(() => {
        if (props.tabIndex !== index) {
            setIndex(props.tabIndex);
        }
    }, [props.tabIndex, index]);

    useEffect(() => {
        _checkIfOutdated();
    }, []);

    // KILL SWITCH FUNCTIONS

    const _checkIfOutdated = () => {
        if (props.killSwitch.status == 'OUTDATED') {
            Alert.alert('Application Outdated', 'Update to latest?', [
                {
                    text: 'Later',
                    onPress: () => console.tron.log("'Later' pressed"),
                },
                {
                    text: 'Update',
                    onPress: () => console.tron.log("'Update' Pressed"),
                },
            ]);
        }
    };

    const _renderKillSwitch = () => {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                    }}>
                    <Text style={{ textAlign: 'center' }}>
                        ᕦ[ . ◕ ͜ ʖ ◕ . ]ᕤ
                    </Text>
                </View>
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <Text style={{ textAlign: 'center' }}>
                        Please update to the latest version! This version is no
                        longer supported.
                    </Text>
                </View>
            </View>
        );
    };

    // TAB BAR FUNCTIONS

    const _renderLabel = ({ route, focused, color }) => {
        const dot =
            route.badge && props.isUpgradeAvailable ? <Badge /> : null;
        return (
            <Text
                style={{
                    color,
                    fontWeight: '500',
                    fontSize: 10,
                    padding: 0,
                    marginLeft: 0,
                    marginRight: 0,
                }}>
                {dot}
                {route.title}
            </Text>
        );
    };

    const _renderHeader = tabProps => (
        <TabBar
            indicatorStyle={{ backgroundColor: '#eb5757', height: 2 }}
            style={{ backgroundColor: '#333333' }}
            labelStyle={{
                fontWeight: '500',
                fontSize: 10,
                padding: 0,
                marginLeft: 0,
                marginRight: 0,
            }}
            renderLabel={_renderLabel}
            {...tabProps}
        />
    );

    const _renderApplication = () => {
        return (
            <View style={[{ flex: 1 }, styles.container]}>
                <StatusBar backgroundColor="#333333" barStyle="light-content" />
                <View style={{ height: insets.top, backgroundColor: '#333333' }} />
                <TabView
                    style={{ flex: 1 }}
                    navigationState={{ index, routes }}
                    renderScene={NavigationConfig.sceneMap}
                    renderTabBar={_renderHeader}
                    onIndexChange={newIndex => props.changeTab(newIndex)}
                />
                {/* <SurveyModalScreen /> */}
            </View>
        );
    };

    // RENDER

    var killSwitchStatus = props.killSwitch.status;

    if (killSwitchStatus === 'KILLED') {
        return _renderKillSwitch();
    } else {
        return _renderApplication();
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f2f2f2',
    },
});

export default ApplicationView;
