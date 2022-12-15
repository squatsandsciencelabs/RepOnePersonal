import {
    EXPAND_WORKOUT_SET,
    PRESENT_WORKOUT_VIDEO_PLAYER,
    DELETE_WORKOUT_VIDEO,
} from 'app/configs+constants/ActionTypes';
import * as VideoPermissionsUtils from 'app/utility/VideoPermissionsUtils';
import * as Analytics from 'app/services/Analytics';
import * as SetsSelectors from 'app/redux/selectors/SetsSelectors';
import * as CollapseExpandWorkoutActions from 'app/redux/shared_actions/CollapseExpandWorkoutActions';
import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';

export const expandCard = (setID) => (dispatch, getState) => {
    const state = getState();
    logExpandCardAnalytics(setID, state);

    dispatch(CollapseExpandWorkoutActions.expandCard(setID));
};

export const presentWatchVideo = (setID, videoFileURL) => (dispatch, getState) => {
    VideoPermissionsUtils.checkWatchVideoPermissions().then(async () => {
        const state = getState();
        Analytics.setCurrentScreen('workout_watch_video');
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
                                    type: DELETE_WORKOUT_VIDEO,
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
            type: PRESENT_WORKOUT_VIDEO_PLAYER,
            setID: setID,
            videoFileURL: videoFileURL
        });
    }).catch(() => {});
};

const logWatchVideoAnalytics = (setID, state) => {
    const is_working_set = SetsSelectors.getIsWorkingSet(state, setID);
    
    Analytics.logEventWithAppState('watch_video', {
        is_working_set: is_working_set,
        from_collapsed_card: true,
    }, state);
};

const logExpandCardAnalytics = (setID, state) => {
    Analytics.logEventWithAppState('expand_card', {
        set_id: setID
    }, state);
};
