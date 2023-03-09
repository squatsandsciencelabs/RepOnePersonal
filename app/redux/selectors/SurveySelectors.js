import { createSelector } from 'reselect';

const stateRoot = state => state.survey;

export const getIsFillingOutSurvey = state =>
    stateRoot(state).isFillingOutSurvey;

export const getURL = state => stateRoot(state).surveyURL;

export const getCompletedSurveyURLs = state =>
    stateRoot(state).completedSurveyURLs;

export const getSurveyAvailable = createSelector(
    getURL,
    getCompletedSurveyURLs,
    (url, completed) => {
        if (url && !completed.includes(url)) {
            return true;
        }
        return false;
    },
);

// not memoizing as it's only called on end workout once
export const getCanPromptEndWorkoutSurvey = state => {
    const url = getURL(state);
    if (
        url &&
        !stateRoot(state).optedOutEndWorkoutPromptSurveyURLs.includes(url)
    ) {
        return true;
    }
    return false;
};
