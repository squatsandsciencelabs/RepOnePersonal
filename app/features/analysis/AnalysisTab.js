import React, { Component } from 'react';
import { ScrollView, Image, View, Text, findNodeHandle } from 'react-native';

import OneRMDebugScreen from './debug/OneRMDebugScreen';
import OneRMCalculateScreen from './calculate/OneRMCalculateScreen';
import OneRMResultsScreen from './results/OneRMResultsScreen';
import OneRMLoggedOutView from './logged_out/OneRMLoggedOutView';
import OneRMProtocolView from './protocol/OneRMProtocolView';
import { SETTINGS_PANEL_STYLES } from 'app/appearance/styles/GlobalStyles';

class AnalysisTab extends Component {
    // separated Chart and Screen to ensure android hack works along with calculate button
    constructor(props) {
        super(props);

        this.state = { lastScroll: false };
        this.scrollView = React.createRef();
        this.results = React.createRef();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.scroll !== this.state.lastScroll) {
            // save new props
            this.setState({
                lastScroll: nextProps.scroll,
            });

            // scroll
            const resultsHandle = findNodeHandle(this.results.current);
            const scrollHandle = findNodeHandle(this.scrollView.current);
            if (resultsHandle && scrollHandle) {
                this.results.current.measureLayout(
                    scrollHandle,
                    (x, y, width, height, pageX, pageY) => {
                        this.scrollView.current.scrollTo({
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
                    ref={this.scrollView}>
                    <OneRMDebugScreen />
                    <OneRMCalculateScreen />
                    <View
                        ref={this.results}
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
