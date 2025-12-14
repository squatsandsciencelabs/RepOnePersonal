import React, { useRef, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import OneRMDebugScreen from './debug/OneRMDebugScreen';
import OneRMCalculateScreen from './calculate/OneRMCalculateScreen';
import OneRMResultsScreen from './results/OneRMResultsScreen';
import OneRMLoggedOutView from './logged_out/OneRMLoggedOutView';
import OneRMProtocolView from './protocol/OneRMProtocolView';

function AnalysisTab(props) {
    const insets = useSafeAreaInsets();
    const [lastScroll, setLastScroll] = useState(false);
    const scrollViewRef = useRef(null);
    const resultsRef = useRef(null);

    useEffect(() => {
        if (props.scroll !== lastScroll) {
            setLastScroll(props.scroll);

            if (resultsRef.current && scrollViewRef.current) {
                resultsRef.current.measureLayout(
                    scrollViewRef.current,
                    (x, y, width, height, pageX, pageY) => {
                        scrollViewRef.current.scrollTo({
                            x: 0,
                            y: y,
                            animated: true,
                        });
                    },
                );
            }
        }
    }, [props.scroll, lastScroll]);

    if (props.isLoggedIn) {
        // TODO: test the hack still works on Android
        return (
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: insets.bottom }}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="always"
                onScrollBeginDrag={() => props.dragged()}
                ref={scrollViewRef}>
                <OneRMDebugScreen />
                <OneRMCalculateScreen />
                <View
                    ref={resultsRef}
                    onLayout={() => {}}
                    collapsable={false}>
                    <OneRMResultsScreen />
                </View>
                <OneRMProtocolView />
            </ScrollView>
        );
    } else {
        return <OneRMLoggedOutView />;
    }
}

export default AnalysisTab;
