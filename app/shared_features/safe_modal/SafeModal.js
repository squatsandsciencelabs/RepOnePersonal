import React from 'react';
import { Modal, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function SafeModal({ children, ...modalProps }) {
    return (
        <Modal
            animationType="fade"
            presentationStyle="overFullScreen"
            {...modalProps}>
            <SafeAreaProvider>
                <StatusBar barStyle="dark-content" />
                {children}
            </SafeAreaProvider>
        </Modal>
    );
}

export default SafeModal;
