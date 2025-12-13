import React, { Component } from 'react';
import {
    Text,
    View,
    StatusBar,
    Modal,
    StyleSheet,
    TouchableOpacity,
    SectionList,
    Platform,
} from 'react-native';

import OneRMEditSetFormScreen from './form/OneRMEditSetFormScreen';
import OneRMEditSetTitleScreen from './form/OneRMEditSetTitleScreen';
import OneRMEditSetExerciseScreen from './exercise_name/OneRMEditSetExerciseScreen';
import OneRMEditSetTagsScreen from './tags/OneRMEditSetTagsScreen';
import OneRMEditSetVideoButtonScreen from './form/OneRMEditSetVideoButtonScreen';
import OneRMEditSetVideoRecorderScreen from './camera/OneRMEditSetVideoRecorderScreen';
import OneRMEditSetVideoPlayerScreen from './video/OneRMEditSetVideoPlayerScreen';

import SetDataLabelRow from 'app/shared_features/set_card/expanded/SetDataLabelRow';
import SetDataRow from 'app/shared_features/set_card/expanded/SetDataRow';
import SetFooterRow from 'app/shared_features/set_card/SetFooterRow';
import SetAnalysisScreen from 'app/shared_features/set_card/analysis/SetAnalysisScreen';
import RestoreSetRow from 'app/shared_features/set_card/restore/RestoreSetRow';
import Open3DRow from 'app/shared_features/set_card/expanded/Open3DRow'; // TODO: wrap this in a screen? Or should this guy pass in the props itself? Leaning screen but just make it work for now

import SetData from 'app/shared_features/set_card/expanded/SetData';

// TODO: add a close button on this shit
class OneRMEditSetView extends Component {
    // UPDATE

    shouldComponentUpdate(nextProps) {
        const differentSections = nextProps.sections !== this.props.sections;
        const differentSelectedRep =
            nextProps.selectedRowSetID !== this.props.selectedRowSetID ||
            nextProps.selectedRowRep !== this.props.selectedRep;
        return differentSections || differentSelectedRep;
    }

    // RENDER

    _renderNavigation() {
        return (
            <View style={styles.container}>
                <View style={styles.navTitle}>
                    <Text
                        style={{
                            color: 'rgba(77, 77, 77, 1)',
                            fontWeight: 'bold',
                        }}>
                        {this.props.title}
                    </Text>
                </View>

                <View style={{ position: 'absolute', left: 0, top: 0 }}>
                    <TouchableOpacity onPress={() => this.props.dismissModal()}>
                        <View style={styles.nav}>
                            <Text style={[{ color: 'rgba(47, 128, 237, 1)' }]}>
                                Close
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    _renderSectionHeader(section) {
        return (
            <View>
                <View
                    style={{
                        height: 35,
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                    }}>
                    <Text style={{ color: 'rgba(77, 77, 77, 1)' }}>
                        {section.key}
                    </Text>
                </View>
            </View>
        );
    }

    _renderRow(section, index, item) {
        switch (item.type) {
            case 'restore':
                return (
                    <RestoreSetRow
                        tappedRestore={() => this.props.restoreSet(item.setID)}
                        exercise={item.exercise}
                        weight={item.weight}
                        metric={item.metric}
                        rpe={item.rpe}
                        numReps={item.numReps}
                        tags={item.tags}
                    />
                );
            case 'title':
                return (
                    <View style={{ borderTopWidth: 1, borderColor: '#e0e0e0' }}>
                        <OneRMEditSetTitleScreen
                            setID={item.setID}
                            exercise={item.exercise}
                            removed={item.removed}
                            setNumber={item.setNumber}
                            isCollapsable={false}
                        />
                    </View>
                );
            case 'analysis':
                return <SetAnalysisScreen set={item.set} />;
            case 'form':
                // note: on focus will avoid the Redux store for simplicity and just do it through the callback function
                // technically an action to scroll should be application state and therefore should go through the global store
                return (
                    <View style={{ backgroundColor: 'white' }}>
                        <OneRMEditSetFormScreen
                            setID={item.setID}
                            initialStartTime={item.initialStartTime}
                            removed={item.removed}
                            tags={item.tags}
                            weight={item.weight}
                            metric={item.metric}
                            rpe={item.rpe}
                            renderDetailComponent={() => {
                                if (
                                    item.videoFileURL !== null &&
                                    item.videoFileURL !== undefined
                                ) {
                                    return (
                                        <OneRMEditSetVideoButtonScreen
                                            setID={item.setID}
                                            mode="watch"
                                            videoFileURL={item.videoFileURL}
                                        />
                                    );
                                } else {
                                    return (
                                        <OneRMEditSetVideoButtonScreen
                                            setID={item.setID}
                                            mode="commentary"
                                        />
                                    );
                                }
                            }}
                        />
                    </View>
                );
            case 'open 3d button':
                return (
                    <Open3DRow setID={item.setID} open3D={this.props.open3D} />
                );
            case 'border':
                return (
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: 'white',
                            borderColor: '#e0e0e0',
                            borderLeftWidth: 1,
                            borderRightWidth: 1,
                            borderBottomWidth: 1,
                            height: 10,
                        }}
                    />
                );
            case 'reps':
                return (
                    <SetData
                        item={item}
                        selectedRowSetID={this.props.selectedRowSetID}
                        selectedRowRep={this.props.selectedRowRep}
                        selectedRowDisplayRep={this.props.selectedRowDisplayRep}
                        selectedRowIsRemoved={this.props.selectedRowIsRemoved}
                        selectedRowOverlayNumbers={
                            this.props.selectedRowOverlayNumbers
                        }
                        onPressRemove={(setID, rep) =>
                            this.props.removeRep(setID, rep)
                        }
                        onPressRestore={(setID, rep) =>
                            this.props.restoreRep(setID, rep)
                        }
                        onRowSelect={(
                            setID,
                            rep,
                            repDisplay,
                            overlayNumbers,
                            isRemoved,
                        ) =>
                            this.props.selectRow(
                                setID,
                                rep,
                                repDisplay,
                                overlayNumbers,
                                isRemoved,
                            )
                        }
                        onRowDeselect={this.props.deselectRow}
                    />
                );
            case 'footer':
                // shouldn't need open 3d as it should never open 3d from here
                return (
                    <SetFooterRow
                        item={item}
                        onPressDelete={this.props.deleteSet}
                    />
                );
            default:
                break;
        }
    }

    render() {
        var list = null;
        if (this.props.sections.length > 0) {
            list = (
                <SectionList
                    ref={ref => {
                        this.sectionList = ref;
                    }}
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps="always"
                    initialNumToRender={13}
                    stickySectionHeadersEnabled={false}
                    renderItem={({ item, index, section }) =>
                        this._renderRow(section, index, item)
                    }
                    renderSectionHeader={({ section }) =>
                        this._renderSectionHeader(section)
                    }
                    sections={this.props.sections}
                    style={{ padding: 10, backgroundColor: '#f2f2f2' }}
                />
            );
        }
        return (
            <Modal visible={this.props.isModalShowing} animationType="fade">
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        backgroundColor: 'rgba(242, 242, 242, 1)',
                    }}>
                    <OneRMEditSetExerciseScreen />
                    <OneRMEditSetTagsScreen />
                    <OneRMEditSetVideoRecorderScreen />
                    <OneRMEditSetVideoPlayerScreen />

                    {this._renderNavigation()}
                    <View style={{ flex: 1, backgroundColor: 'white' }}>
                        {list}
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 50,
        alignItems: 'center',
        borderColor: '#e0e0e0',
        borderBottomWidth: 1,
    },
    nav: {
        paddingTop: 15,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 10,
    },
    navTitle: {
        paddingTop: 15,
    },
});

export default OneRMEditSetView;
