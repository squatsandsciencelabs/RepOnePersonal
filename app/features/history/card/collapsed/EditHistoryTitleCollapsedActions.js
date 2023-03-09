import {
    EXPAND_HISTORY_SET,
    PRESENT_HISTORY_VIDEO_PLAYER,
    DELETE_HISTORY_VIDEO,
} from 'app/configs+constants/ActionTypes';
import * as VideoPermissionsUtils from 'app/utility/VideoPermissionsUtils';
import * as Analytics from 'app/services/Analytics';
import * as CollapseExpandHistoryActions from 'app/redux/shared_actions/CollapseExpandHistoryActions';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';

export const expandCard = setID => (dispatch, getState) => {
    const state = getState();
    logExpandCardAnalytics(setID, state);

    dispatch(CollapseExpandHistoryActions.expandCard(setID));
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

const logWatchVideoAnalytics = (setID, state) => {
    Analytics.logEventWithAppState(
        'watch_video',
        {
            is_working_set: false,
            from_collapsed_card: true,
        },
        state,
    );
};

const logExpandCardAnalytics = (setID, state) => {
    Analytics.logEventWithAppState(
        'expand_card',
        {
            set_id: setID,
        },
        state,
    );
};
