import React from 'react';
import { Modal, View } from 'react-native';
import {
    SafeAreaProvider,
    useSafeAreaInsets,
} from 'react-native-safe-area-context';

function SafeAreaBackground({ statusColor }) {
    const insets = useSafeAreaInsets();
    return (
        <View
            style={{
                backgroundColor: statusColor,
                position: 'absolute',
                width: '100%',
                height: insets.top,
            }}
        />
    );
}

function SafeModal({ children, statusColor = '#333333', ...modalProps }) {
    return (
        <Modal
            animationType="fade"
            presentationStyle="overFullScreen"
            {...modalProps}>
            <SafeAreaProvider>
                {children}
                <SafeAreaBackground statusColor={statusColor} />
            </SafeAreaProvider>
        </Modal>
    );
}

export default SafeModal;
