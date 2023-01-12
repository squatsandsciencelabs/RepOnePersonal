import React, { Component } from 'react';
import { AppRegistry, Platform, Text, TextInput } from 'react-native';
import { Provider } from 'react-redux';
import 'app/configs+constants/ReactotronConfig';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { RootSiblingParent } from 'react-native-root-siblings';
import OpenBarbellConfig from 'app/configs+constants/OpenBarbellConfig.json';

// NOTE: Somehow importing this later causes animations to fail
// NOTE: Commenting out as this is crashing in release mode
// https://github.com/expo/expo/issues/16057
// import VisualizationScreen from 'app/features/visualization/VisualizationScreen';

import Store from 'app/redux/Store';
import ApplicationScreen from 'app/features/application/ApplicationScreen';
import * as GoogleSignInSetup from 'app/services/GoogleSignInSetup';
import * as Firebase from 'app/services/Firebase';
import Bluetooth from 'app/services/Bluetooth';
import AppState from 'app/services/AppState';
import * as Analytics from 'app/services/Analytics';
import Permissions from 'app/services/Permissions';
import * as BluetoothUtils from 'app/utility/BluetoothUtils';

// TODO: confirm font scaling disabled
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

// initialize the store
var store = Store();

// initialize analytics
Analytics.setInitialAnalytics();

// configure google sign in
GoogleSignInSetup.configure();

// configure firebase
Firebase.configure();

// set up app state listeners
AppState(store);

// render
class RepOnePersonal extends Component {
    async componentDidMount() {
        // request permissions
        await Permissions();

        if (Platform.OS !== 'ios') {
            let allPermissionsGranted =
                await BluetoothUtils.checkBluetoothPermissionsAndroid();

            if (allPermissionsGranted) {
                await Bluetooth(store);
            }
        } else {
            // start the bluetooth
            await Bluetooth(store);
        }
    }

    render() {
        return (
            <ActionSheetProvider>
                <RootSiblingParent>
                    <Provider store={store}>
                        <ApplicationScreen />
                        {/* {OpenBarbellConfig.visualizationEnabled ? <VisualizationScreen /> : null} */}
                    </Provider>
                </RootSiblingParent>
            </ActionSheetProvider>
        );
    }
}

// begin application
export default function () {
    AppRegistry.registerComponent('RepOnePersonal', () => RepOnePersonal);
}
