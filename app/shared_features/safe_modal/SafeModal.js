import React from 'react';
import { Modal, View } from 'react-native';
import {
    SafeAreaProvider,
    useSafeAreaInsets,
} from 'react-native-safe-area-context';

function SafeModal({ children, ...modalProps }) {
    const insets = useSafeAreaInsets();

    return (
        <Modal
            animationType="fade"
            presentationStyle="overFullScreen"
            {...modalProps}>
            <SafeAreaProvider>{children}</SafeAreaProvider>
            <View
                style={{
                    backgroundColor: '#333333',
                    position: 'absolute',
                    width: '100%',
                    height: insets.top,
                }}
            />
        </Modal>
    );
}

export default SafeModal;
