import React from 'react';
import { Modal } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function SafeModal({ children, ...modalProps }) {
    return (
        <Modal
            animationType="fade"
            presentationStyle="overFullScreen"
            {...modalProps}>
            <SafeAreaProvider>{children}</SafeAreaProvider>
        </Modal>
    );
}

export default SafeModal;
