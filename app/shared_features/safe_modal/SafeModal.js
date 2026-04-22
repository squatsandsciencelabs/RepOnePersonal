import React from 'react';
import { Modal, View } from 'react-native';
import {
    SafeAreaProvider,
    useSafeAreaInsets,
} from 'react-native-safe-area-context';

function SafeAreaBackground() {
    const insets = useSafeAreaInsets();
    return (
        <View
            style={{
                backgroundColor: '#333333',
                position: 'absolute',
                width: '100%',
                height: insets.top,
            }}
        />
    );
}

function SafeModal({ children, ...modalProps }) {
    return (
        <Modal
            animationType="fade"
            presentationStyle="overFullScreen"
            {...modalProps}>
            <SafeAreaProvider>
                {children}
                <SafeAreaBackground />
            </SafeAreaProvider>
        </Modal>
    );
}

export default SafeModal;
