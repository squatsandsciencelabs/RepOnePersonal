import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';

import OneRMDebugScreen from './debug/OneRMDebugScreen';
import OneRMCalculateScreen from './calculate/OneRMCalculateScreen';
import OneRMResultsScreen from './results/OneRMResultsScreen';
import OneRMLoggedOutView from './logged_out/OneRMLoggedOutView';
import OneRMProtocolView from './protocol/OneRMProtocolView';

class AnalysisTab extends Component {
    // separated Chart and Screen to ensure android hack works along with calculate button
    constructor(props) {
        super(props);

        this.state = { lastScroll: false };
        this.scrollViewRef = React.createRef();
        this.resultsRef = React.createRef();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.scroll !== this.state.lastScroll) {
            // save new props
            this.setState({
                lastScroll: nextProps.scroll,
            });

            // scroll
            if (this.resultsRef.current && this.scrollViewRef.current) {
                this.resultsRef.current.measureLayout(
                    this.scrollViewRef.current,
                    (x, y, width, height, pageX, pageY) => {
                        this.scrollViewRef.current.scrollTo({
                            x: 0,
                            y: y,
                            animated: true,
                        });
                    },
                );
            }
        }
    }

    render() {
        if (this.props.isLoggedIn) {
            // TODO: test the hack still works on Android
            return (
                <ScrollView
                    style={{ flex: 1 }}
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps="always"
                    onScrollBeginDrag={() => this.props.dragged()}
                    ref={this.scrollViewRef}>
                    <OneRMDebugScreen />
                    <OneRMCalculateScreen />
                    <View
                        ref={this.resultsRef}
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
}

export default AnalysisTab;
