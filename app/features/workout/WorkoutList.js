import React, { Component } from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    SectionList,
} from 'react-native';

import WorkoutBottomBarScreen from './bottom_bar/WorkoutBottomBarScreen';
import EditWorkoutTitleExpandedScreen from './card/expanded/title/EditWorkoutTitleExpandedScreen';
import EditWorkoutTitleCollapsedScreen from './card/collapsed/EditWorkoutTitleCollapsedScreen';
import EditWorkoutSetFormScreen from './card/expanded/form/EditWorkoutSetFormScreen';
import EditWorkoutExerciseScreen from './exercise_name/EditWorkoutExerciseScreen';
import EditWorkoutTagsScreen from './tags/EditWorkoutTagsScreen';
import SetData from 'app/shared_features/set_card/expanded/SetData';
import SetFooterRow from 'app/shared_features/set_card/SetFooterRow';
import LiveRestRow from 'app/shared_features/set_card/expanded/LiveRestRow';
import WorkoutVideoButtonScreen from './card/expanded/form/WorkoutVideoButtonScreen';
import WorkoutVideoRecorderScreen from './camera/WorkoutVideoRecorderScreen';
import WorkoutVideoPlayerScreen from './video/WorkoutVideoPlayerScreen';
import ListLoadingFooter from '../history/loading/ListLoadingFooter';
import TimerProgressBarScreen from 'app/features/workout/card/expanded/TimerProgressBarScreen';
import SetSummary from 'app/shared_features/set_card/collapsed/SetSummary';
import SetAnalysisScreen from 'app/shared_features/set_card/analysis/SetAnalysisScreen';
import RestoreSetRow from 'app/shared_features/set_card/restore/RestoreSetRow';
import WorkoutLoginBannerView from './login_banner/WorkoutLoginBannerView';
import Open3DRow from 'app/shared_features/set_card/expanded/Open3DRow'; // TODO: wrap this in a screen? Or should this guy pass in the props itself? Leaning screen but just make it work for now
import EditWorkoutKratosDiscsScreen from './kratos_discs/EditWorkoutKratosDiscsScreen';

class WorkoutList extends Component {
    // UPDATE

    shouldComponentUpdate(nextProps) {
        const differentShowRemoved =
            nextProps.shouldShowRemoved !== this.props.shouldShowRemoved;
        const differentSections = nextProps.sections !== this.props.sections;

        const differentIsLoggedIn =
            nextProps.isLoggedIn !== this.props.isLoggedIn;
        const differentIsLoggingIn =
            nextProps.isLoggingIn !== this.props.isLoggingIn;

        return (
            differentShowRemoved ||
            differentSections ||
            differentIsLoggedIn ||
            differentIsLoggingIn
        );
    }

    // RENDER

    _renderLoginBanner() {
        if (!this.props.isLoggedIn) {
            return (
                <View style={styles.loginBannerContainer}>
                    <WorkoutLoginBannerView
                        isLoggingIn={this.props.isLoggingIn}
                        tappedBanner={() => this.props.tappedLoginBanner()}
                    />
                </View>
            );
        } else {
            return null;
        }
    }

    _renderSectionHeader(section) {
        const sets = this.props.sets;
        const currentSetIndex = this.props.sets.length - 1;
        const set = sets[currentSetIndex];
        const marginTop = this.props.isLoggedIn ? 0 : 40;

        // if there is no set data show disabled add set button
        if (section.key === 0) {
            if (!this.props.isAddEnabled) {
                return (
                    <View
                        style={[
                            styles.disabledButton,
                            { marginTop: marginTop },
                        ]}>
                        <Text style={styles.buttonText}>CREATE NEW SET</Text>
                    </View>
                );
            } else {
                return (
                    <View style={[styles.button, { marginTop: marginTop }]}>
                        <TouchableOpacity onPress={() => this.props.endSet()}>
                            <Text style={styles.buttonText}>
                                CREATE NEW SET
                            </Text>
                        </TouchableOpacity>
                    </View>
                );
            }
        } else {
            return null;
        }
    }

    _renderSectionFooter(section) {
        if (section.key !== 0) {
            return <ListLoadingFooter isLargeFooter={section.isLast} />;
        }
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
                if (!item.isCollapsed) {
                    return (
                        <View>
                            <EditWorkoutTitleExpandedScreen
                                setID={item.setID}
                                exercise={item.exercise}
                                bias={item.bias}
                                removed={item.removed}
                                setNumber={item.setNumber}
                                isCollapsable={!item.isWorkingSet}
                            />
                        </View>
                    );
                } else {
                    return (
                        <View>
                            <EditWorkoutTitleCollapsedScreen
                                setID={item.setID}
                                exercise={item.exercise}
                                removed={item.removed}
                                setNumber={item.setNumber}
                                videoFileURL={item.videoFileURL}
                            />
                        </View>
                    );
                }
            case 'summary':
                return (
                    <SetSummary
                        weight={item.weight}
                        metric={item.metric}
                        numReps={item.numReps}
                        tags={item.tags}
                        kratosDiscs={item.kratosDiscs}
                        deviceType={item.deviceType}
                    />
                );
            case 'analysis':
                return <SetAnalysisScreen set={item.set} />;
            case 'form':
                return (
                    <View style={{ backgroundColor: 'white' }}>
                        <EditWorkoutSetFormScreen
                            setID={item.setID}
                            removed={item.removed}
                            tags={item.tags}
                            weight={item.weight}
                            metric={item.metric}
                            rpe={item.rpe}
                            kratosDiscs={item.kratosDiscs}
                            deviceType={item.deviceType}
                            renderDetailComponent={() => {
                                if (
                                    item.videoFileURL !== null &&
                                    item.videoFileURL !== undefined
                                ) {
                                    return (
                                        <WorkoutVideoButtonScreen
                                            setID={item.setID}
                                            mode="watch"
                                            videoFileURL={item.videoFileURL}
                                        />
                                    );
                                } else if (section.position === 0) {
                                    return (
                                        <WorkoutVideoButtonScreen
                                            setID={item.setID}
                                            mode="record"
                                        />
                                    );
                                } else {
                                    return (
                                        <WorkoutVideoButtonScreen
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
            case 'reps':
                return (
                    <SetData
                        item={item}
                        key={index}
                        selectedRowSetID={this.props.selectedRowSetID}
                        selectedRowRep={this.props.selectedRowRep}
                        onPressRemove={(setID, rep) =>
                            this.props.removeRep(setID, rep)
                        }
                        onPressRestore={(setID, rep) =>
                            this.props.restoreRep(setID, rep)
                        }
                        onRowSelect={(setID, rep) =>
                            this.props.selectRow(setID, rep)
                        }
                        onRowDeselect={this.props.deselectRow}
                    />
                );
            case 'footer':
                return (
                    <SetFooterRow
                        item={item}
                        onPressDelete={this.props.deleteSet}
                        open3D={this.props.open3D}
                    />
                );
            case 'working set header':
                return (
                    <View style={{ marginTop: 15 }}>
                        <TimerProgressBarScreen />
                    </View>
                );
            case 'top border':
                return (
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: '#e0e0e0',
                            height: 1,
                        }}
                    />
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
                            height: 1,
                        }}
                    />
                );
            case 'bottom border':
                if (item.isPadded) {
                    return (
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: 'white',
                                borderColor: '#e0e0e0',
                                borderLeftWidth: 1,
                                borderRightWidth: 1,
                                borderBottomWidth: 1,
                                height: 1,
                                marginBottom: 15,
                            }}
                        />
                    );
                } else {
                    return (
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: '#e0e0e0',
                                height: 1,
                                marginBottom: 15,
                            }}
                        />
                    );
                }
            case 'working set footer':
                return (
                    <View style={{ marginBottom: 15 }}>
                        <LiveRestRow restStartTimeMS={item.restStartTimeMS} />
                    </View>
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
                    renderItem={({ section, index, item }) =>
                        this._renderRow(section, index, item)
                    }
                    renderSectionHeader={({ section }) =>
                        this._renderSectionHeader(section)
                    }
                    renderSectionFooter={({ section }) =>
                        this._renderSectionFooter(section)
                    }
                    sections={this.props.sections}
                    style={{ padding: 16, backgroundColor: '#f2f2f2' }}
                />
            );
        }

        return (
            <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    backgroundColor: 'white',
                }}>
                <EditWorkoutExerciseScreen />
                <EditWorkoutTagsScreen />
                <EditWorkoutKratosDiscsScreen />
                <WorkoutVideoRecorderScreen />
                <WorkoutVideoPlayerScreen />

                <View style={{ flex: 1 }}>{list}</View>

                {this._renderLoginBanner()}

                <View style={{ height: 50 }}>
                    <WorkoutBottomBarScreen />
                </View>
            </View>
        );
    }
}

//NOTE: currently container names reference the React Native flexDirection which imo is confusing
const styles = StyleSheet.create({
    loginBannerContainer: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
    },
    sectionHeaderText: {
        fontFamily: 'AvenirNext-Medium',
        fontSize: 16,
        left: 0,
    },
    button: {
        backgroundColor: 'rgba(47, 128, 237, 1)',
        borderColor: 'rgba(47, 128, 237, 1)',
        borderWidth: 5,
        borderRadius: 15,
    },
    disabledButton: {
        backgroundColor: 'rgba(47, 128, 237, 1)',
        borderColor: 'rgba(47, 128, 237, 1)',
        borderWidth: 5,
        borderRadius: 15,
        opacity: 0.3,
    },
    buttonText: {
        color: 'white',
        padding: 5,
        textAlign: 'center',
    },
    Shadow: {
        shadowColor: '#000000',
        shadowOpacity: 0.2,
        shadowRadius: 2,
        shadowOffset: {
            height: 4,
            width: 0,
        },
    },
    rowText: {
        fontSize: 20,
        paddingTop: 5,
    },
});

export default WorkoutList;
