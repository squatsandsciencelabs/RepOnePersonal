import {
    TOGGLE_HISTORY_METRIC,
    PRESENT_HISTORY_TAGS,
    PRESENT_HISTORY_VIDEO_RECORDER,
    PRESENT_HISTORY_VIDEO_PLAYER,
    START_EDITING_HISTORY_RPE,
    START_EDITING_HISTORY_WEIGHT,
    END_EDITING_HISTORY_RPE,
    END_EDITING_HISTORY_WEIGHT,
    DELETE_HISTORY_VIDEO,
    PRESENT_HISTORY_KRATOS_DISCS,
    SAVE_HISTORY_VIDEO,
    START_PICKING_HISTORY_VIDEO,
    RESET_PICKING_HISTORY_VIDEO,
} from 'app/configs+constants/ActionTypes';
import * as Analytics from 'app/services/Analytics';
import * as VideoPermissionsUtils from 'app/utility/VideoPermissionsUtils';
import * as SetsActionCreators from 'app/redux/shared_actions/SetsActionCreators';
import * as SetsSelectors from 'app/redux/selectors/SetsSelectors';
import * as DurationsSelectors from 'app/redux/selectors/DurationsSelectors';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export const toggleMetric = setID => (dispatch, getState) => {
    const state = getState();
    logToggleMetricAnalytics(setID, state);
    dispatch({
        type: TOGGLE_HISTORY_METRIC,
    });
};

export const editRPE = setID => (dispatch, getState) => {
    const state = getState();
    logEditRPEAnalytics(setID, state);
    dispatch({
        type: START_EDITING_HISTORY_RPE,
    });
};

export const editWeight = setID => (dispatch, getState) => {
    const state = getState();
    logEditWeightAnalytics(setID, state);
    dispatch({
        type: START_EDITING_HISTORY_WEIGHT,
    });
};

export const dismissRPE = setID => (dispatch, getState) => {
    const state = getState();
    logSaveRPEAnalytics(setID, state);
    dispatch({
        type: END_EDITING_HISTORY_RPE,
    });
};

export const dismissWeight = setID => (dispatch, getState) => {
    const state = getState();
    logSaveWeightAnalytics(setID, state);
    dispatch({
        type: END_EDITING_HISTORY_WEIGHT,
    });
};

export const presentTags = (setID, tags) => (dispatch, getState) => {
    const state = getState();
    Analytics.setCurrentScreen('edit_history_tags');
    logEditTagsAnalytics(setID, state);

    dispatch({
        type: PRESENT_HISTORY_TAGS,
        setID: setID,
        tags: tags,
    });
};

export const presentKratosDiscs =
    (setID, kratosDiscs) => (dispatch, getState) => {
        var state = getState();

        Analytics.setCurrentScreen('edit_history_kratos_discs');

        logEditKratosDiscsAnalytics(setID, state);

        dispatch({
            type: PRESENT_HISTORY_KRATOS_DISCS,
            setID: setID,
            kratosDiscs: kratosDiscs,
        });
    };

export const saveSet = (setID, weight = null, metric = null, rpe = null) => {
    return SetsActionCreators.saveHistoryForm(setID, weight, metric, rpe);
};

export const presentRecordVideo = setID => (dispatch, getState) => {
    VideoPermissionsUtils.checkRecordingPermissions()
        .then(() => {
            const state = getState();
            Analytics.setCurrentScreen('history_record_video');
            logVideoRecorderAnalytics(setID, state);

            dispatch({
                type: PRESENT_HISTORY_VIDEO_RECORDER,
                setID: setID,
                isCommentary: false,
            });
        })
        .catch(() => {});
};

export const presentRecordCommentary = setID => async (dispatch, getState) => {
    dispatch({ type: START_PICKING_HISTORY_VIDEO, setID: setID });
    try {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            dispatch({ type: RESET_PICKING_HISTORY_VIDEO });
            Alert.alert(
                'Additional Permissions Required',
                'RepOne needs Photo Library permissions to attach videos.\n\nPlease enable them for RepOne in your phone Settings',
                [{ text: 'OK' }],
                { cancelable: false },
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['videos'],
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const state = getState();
            Analytics.setCurrentScreen('history');
            logVideoLogRecorderAnalytics(setID, state);

            dispatch({
                type: SAVE_HISTORY_VIDEO,
                setID: setID,
                videoFileURL: result.assets[0].uri,
                videoType: 'commentary',
            });
        } else {
            dispatch({ type: RESET_PICKING_HISTORY_VIDEO });
        }
    } catch (err) {
        dispatch({ type: RESET_PICKING_HISTORY_VIDEO });
        Alert.alert(
            `There was an error attaching your video, please try another`,
        );
        const state = getState();
        logAttachVideoErrorAnalytics(state, setID, err);
        console.tron.log(
            `unknown err presenting commentary ${err} ${
                err.message
            } ${JSON.stringify(err)}`,
        );
    }
};

export const presentWatchVideo =
    (setID, videoFileURL) => (dispatch, getState) => {
        VideoPermissionsUtils.checkWatchVideoPermissions()
            .then(async () => {
                const state = getState();
                Analytics.setCurrentScreen('history_watch_video');
                logWatchVideoAnalytics(setID, state);

                if (!videoFileURL) {
                    console.tron.log('No video file URL provided');
                    return Alert.alert(
                        'Video not Found',
                        'The video might be located on another mobile device, or you may deleted it from your photos gallery.',
                    );
                } else {
                    const fileInfo = await FileSystem.getInfoAsync(
                        videoFileURL,
                    );
                    const { exists } = fileInfo;

                    if (!exists) {
                        console.tron.log('Video file not found');
                        return Alert.alert(
                            'Video not Found',
                            'The video might be located on another mobile device, or you may deleted it from your photos gallery.',
                            [
                                {
                                    text: 'Delete',
                                    onPress: () =>
                                        dispatch({
                                            type: DELETE_HISTORY_VIDEO,
                                            setID: setID,
                                        }),
                                    style: 'destructive',
                                },
                                {
                                    text: 'OK',
                                },
                            ],
                        );
                    }
                }

                dispatch({
                    type: PRESENT_HISTORY_VIDEO_PLAYER,
                    setID: setID,
                    videoFileURL: videoFileURL,
                });
            })
            .catch(() => {});
    };

const logToggleMetricAnalytics = (setID, state) => {
    Analytics.logEventWithAppState(
        'toggle_weight_metric',
        {
            is_working_set: false,
        },
        state,
    );
};

const logSaveWeightAnalytics = (setID, state) => {
    let duration = DurationsSelectors.getEditHistoryWeightDuration(state);

    Analytics.logEventWithAppState(
        'save_weight',
        {
            value: duration,
            duration: duration,
            is_working_set: false,
        },
        state,
    );
};

const logSaveRPEAnalytics = (setID, state) => {
    let duration = DurationsSelectors.getEditHistoryRPEDuration(state);

    Analytics.logEventWithAppState(
        'save_rpe',
        {
            value: duration,
            duration: duration,
            is_working_set: false,
        },
        state,
    );
};

const logEditRPEAnalytics = (setID, state) => {
    Analytics.logEventWithAppState(
        'edit_rpe',
        {
            is_working_set: false,
        },
        state,
    );
};

const logEditWeightAnalytics = (setID, state) => {
    Analytics.logEventWithAppState(
        'edit_weight',
        {
            is_working_set: false,
        },
        state,
    );
};

const logEditTagsAnalytics = (setID, state) => {
    Analytics.logEventWithAppState(
        'edit_tags',
        {
            is_working_set: false,
        },
        state,
    );
};

const logEditKratosDiscsAnalytics = (setID, state) => {
    Analytics.logEventWithAppState(
        'edit_kratos_discs',
        {
            is_working_set: false,
        },
        state,
    );
};

const logVideoRecorderAnalytics = (setID, state) => {
    Analytics.logEventWithAppState(
        'video_recorder',
        {
            is_working_set: false,
        },
        state,
    );
};

const logVideoLogRecorderAnalytics = (setID, state) => {
    Analytics.logEventWithAppState(
        'video_log_recorder',
        {
            is_working_set: false,
        },
        state,
    );
};

const logWatchVideoAnalytics = (setID, state) => {
    Analytics.logEventWithAppState(
        'watch_video',
        {
            is_working_set: false,
            from_collapsed_card: false,
        },
        state,
    );
};

const logAttachVideoErrorAnalytics = (state, setID, error) => {
    Analytics.logErrorWithAppState(
        error,
        'attach_video_error',
        {
            set_id: setID,
        },
        state,
    );
};
