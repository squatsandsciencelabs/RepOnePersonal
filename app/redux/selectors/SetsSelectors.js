// TODO: refactor so that selectors are aware of the entire state path
// reason being that, the callers shouldn't know to make this state.sets
// right now only a few of them use the stateRoot
import { createSelector } from 'reselect';
import * as SetUtils from 'app/utility/SetUtils';
import * as DurationCalculator from 'app/utility/DurationCalculator';
import * as CollapsedMetrics from 'app/math/CollapsedMetrics';
import * as HistorySelectors from 'app/redux/selectors/HistorySelectors';

const stateRoot = (state) => state.sets;

// Workout

// not memoizing because it's just a reference
export const getWorkoutSets = (state) => stateRoot(state).workoutData;

// up in the air for memoizing
export const getNumWorkoutSets = (state) => {
    return getWorkoutSets(state).length;
};

// memoizing as this gets called on every analytics call
// worth memoizing as 1 ref check saves multiple ref checks without memoizing
export const getIsWorkoutEmpty = createSelector(
    getWorkoutSets,
    (workoutData) => {
        if (workoutData.length >= 2) {
            // at least one set
            return false;
        } else if (workoutData.length === 1 && !SetUtils.isUntouched(workoutData[0])) {
            // only one set and it has data
            return false;
        }
    
        return true;
    }
);

// memoizing as it gets called on every add rep
// arguable if worth memoizing, memoizing has 1 ref check to save a ref check + length check + pulling a ref
export const getWorkingSet = createSelector(
    getWorkoutSets,
    (sets) => {
        if (sets && sets.length > 0) {
            return sets[sets.length - 1];
        }
        return null;
    }
);

// TODO: fix bug here because I'm no longer using set's end and start time
// apparently I used it for more than just rest timer fml
// memoizing as it gets called often, on each change tab even
export const lastWorkoutRepTime = createSelector(
    getWorkoutSets,
    getWorkingSet,
    (workoutData, currentSet) => {
        if (workoutData.length <= 0) {
            return null;
        }
    
        // check the current set for end time
        var endTime = SetUtils.endTime(currentSet);
        if (endTime !== null) {
            return endTime;
        }
    
        // check previous sets for end time
        if (workoutData.length > 1) {
            for (var i=workoutData.length-2; i>=0; i--) {
                var previousSet = workoutData[i];
                var endTime = SetUtils.endTime(previousSet);            
                if (endTime !== null) {
                    return endTime;
                }
            }
        }
    
        // no end times found
        return null;
    }
);

// not memoizing because setID
export const getWorkoutSet = (state, setID) => {
    return stateRoot(state).workoutData.find( set => set.setID == setID );
};

// not memoizing because setID
export const getIsWorkoutSet = (state, setID) => {
    return getWorkoutSet(state, setID) !== undefined;
};

// not memoizing as it's only called in two places for analytics, and each time the value would be different
export const getNumWorkoutReps = (state) => {
    const sets = getWorkoutSets(state);
    var num_reps = 0;

    sets.forEach((set) => {
        if (set.reps) {
            num_reps += set.reps.length;
        }
    });

    return num_reps;
};

// at least 1 field entered not counting video
// not memoizing as it's only called in at end workout for analytics, and each time the value would be different
export const getNumWorkoutSetsWithFields = (state) => {
    const sets = getWorkoutSets(state);
    var num_sets_with_fields = 0;

    sets.forEach((set) => {
        if (!SetUtils.hasEmptyFields(set)) {
            num_sets_with_fields++;
        }
    });

    return num_sets_with_fields; 
};

// at least 1 field entered not counting video
// not memoizing as it's only called in at end workout for analytics, and each time the value would be different
export const getPercentWorkoutSetsWithFields = (state) => {
    const sets = getWorkoutSets(state);
    const numSetsFields = getNumWorkoutSetsWithFields(state);

    if (sets.length > 0) {
        return (numSetsFields/(sets.length)) * 100;
    } else {
        return 0;
    }
};

// all fields but doesn't count video
// not memoizing as it's only called in at end workout for analytics, and each time the value would be different
export const getNumWorkoutSetsWithAllFields = (state) => {
    const sets = getWorkoutSets(state);
    var num_sets_with_all_fields = 0;

    sets.forEach((set) => {
        if (SetUtils.hasAllFields(set)) {
            num_sets_with_all_fields++;
        }
    });

    return num_sets_with_all_fields; 
};

// all fields but doesn't count video
// not memoizing as it's only called in at end workout for analytics, and each time the value would be different
export const getPercentWorkoutSetsWithAllFields = (state) => {
    const sets = getWorkoutSets(state);
    const numSetsAllFields = getNumWorkoutSetsWithAllFields(state);

    if (sets.length > 0) {
        return (numSetsAllFields/(sets.length)) * 100;
    } else {
        return 0;
    }
};

// not memoizing as it's only called in at end workout for analytics, and each time the value would be different
export const getNumWorkoutSetsWithRPE = (state) => {
    const sets = getWorkoutSets(state);
    var num_sets_with_RPE = 0;

    sets.forEach((set) => {
        if (set.rpe) {
            num_sets_with_RPE++;
        }
    });

    return num_sets_with_RPE; 
};

// not memoizing as it's only called in at end workout for analytics, and each time the value would be different
export const getPercentWorkoutSetsWithRPE = (state) => {
    const sets = getWorkoutSets(state);
    const numSetsWithRPE = getNumWorkoutSetsWithRPE(state);

    if (sets.length > 0) {
        return (numSetsWithRPE/(sets.length)) * 100;
    } else {
        return 0;
    }
};

// not memoizing as it's only called in at end workout for analytics, and each time the value would be different
export const getWorkoutDuration = (state) => {
    const sets = getWorkoutSets(state);
    const startDate = SetUtils.startTime(sets[0]);

    if (startDate) {
        return DurationCalculator.getDurationBetween(startDate, Date.now());
    } else {
        return 0;
    }
};

// not memoizing because setID
export const getIsWorkingSet = (state, setID) => {
    const currentSet = getWorkingSet(state);
    return setID === currentSet.setID;
};

// not memoizing as it's only called in at end SET for analytics, and each time the value would be different
export const getWorkoutPreviousSetHasEmptyReps = (state) => {
    const workoutData = stateRoot(state).workoutData;

    if (workoutData.length >= 2) {
        const prevSet = workoutData[workoutData.length - 2];
        if (prevSet) {
            return SetUtils.hasEmptyReps(prevSet);
        }
    }

    return false;
}

// not memoizing as it's only called in at end SET for analytics, and each time the value would be different
export const getIsPreviousWorkoutSetFilled = (state) => {
    const workoutData = stateRoot(state).workoutData;

    if (workoutData.length >= 2) {        
        const prevSet = workoutData[workoutData.length - 2];
        if (prevSet) {
            if(SetUtils.hasEmptyFields(prevSet)) {
                return 0;
            } else {
                return 1;
            }
        }
    }
    
    return -1;
};

// Dictionary to Array

const dictToArray = (dictionary) => {
    var array = [];
    for (var property in dictionary) {
        if (dictionary.hasOwnProperty(property)) {
            array.push(dictionary[property]);
        }
    }
    return array;
};

// History

export const getHistorySets = createSelector(
    state => stateRoot(state).historyData,
    (historyData) => {
        return dictToArray(historyData);
    }
);

export const getHistorySetsChronological = createSelector(
    getHistorySets,
    (sets) => {
        const array = [...sets]; // ensure immutability
        array.sort((set1, set2) => {
            let set1Start = SetUtils.startTime(set1);
            if (set1Start !== null) {
                set1Start = Date.parse(set1Start);
            }
    
            let set2Start = SetUtils.startTime(set2);
            if (set2Start !== null) {
                set2Start = Date.parse(set2Start);
            }
    
            return set1Start - set2Start;
        });
        return array;
    }
);

export const getNumHistorySets = state => getHistorySets(state).length;

export const getFilteredHistorySets = createSelector(
    getHistorySetsChronological,
    HistorySelectors.getShowRemoved,
    HistorySelectors.getHistoryFilterExercise,
    HistorySelectors.getHistoryFilterTagsToInclude,
    HistorySelectors.getHistoryFilterTagsToExclude,
    HistorySelectors.getHistoryFilterStartingDate,
    HistorySelectors.getHistoryFilterEndingDate,
    HistorySelectors.getHistoryFilterStartingWeight,
    HistorySelectors.getHistoryFilterStartingWeightMetric,
    HistorySelectors.getHistoryFilterEndingWeight,
    HistorySelectors.getHistoryFilterEndingWeightMetric,
    HistorySelectors.getHistoryFilterStartingRPE,
    HistorySelectors.getHistoryFilterEndingRPE,
    HistorySelectors.getHistoryFilterStartingRepRange,
    HistorySelectors.getHistoryFilterEndingRepRange,
    (allSets, showRemoved, exercise, tagsToInclude, tagsToExclude, startingDate, endingDate, startingWeight, startingWeightMetric, endingWeight, endingWeightMetric, startingRPE, endingRPE, startingRepRange, endingRepRange) => {
        const data = [];
        allSets.forEach((set) => {
            if (SetUtils.startTime(set) !== null && isValidForHistoryFilter(set, exercise, tagsToInclude, tagsToExclude, startingRPE, endingRPE, startingWeight, startingWeightMetric, endingWeight, endingWeightMetric, startingRepRange, endingRepRange, startingDate, endingDate, showRemoved)) {
                data.push(set);
            }
        });
        return data;
    }
)

const isValidForHistoryFilter = (set, exercise, tagsToInclude, tagsToExclude, startingRPE, endingRPE, startingWeight, startingWeightMetric, endingWeight, endingWeightMetric, startingRepRange, endingRepRange, startingDate, endingDate, showRemoved) => {
    return (showRemoved || !SetUtils.isDeleted(set))
    && SetUtils.checkExercise(set.exercise, exercise)
    && SetUtils.checkIncludesTags(set.tags, tagsToInclude)
    && SetUtils.checkExcludesTags(set.tags, tagsToExclude)
    && SetUtils.checkWeightRange(set.weight, set.metric, startingWeight, startingWeightMetric, endingWeight, endingWeightMetric)
    && SetUtils.checkRPERange(set.rpe, startingRPE, endingRPE)
    && SetUtils.checkDateRange(SetUtils.startTime(set), startingDate, endingDate)
    && SetUtils.checkRepRange(set, startingRepRange, endingRepRange);
};

// can't really memoize as input and stuff can change if passed in
// would need to set the input to the STORE itself, which was slower than being on a component level
// should still be fine, like it'll run each time you open when it didn't need to, but other than that it only runs on change which it would need to anyways
// memoizing would only save it on opening the modal
export const getHistoryFilterTagsSuggestions = (state, input, ignore, isIncluded = true) => {
    const sets = getAllSets(state);
    if (isIncluded) {
        var oppositeTags = HistorySelectors.getEditingFilterTagsToExclude(state);
    } else {
        var oppositeTags = HistorySelectors.getEditingFilterTagsToInclude(state);
    }
    oppositeTags = oppositeTags.map((tag) => tag.toLowerCase());
    const tags = [];

    if (input) {
        input = input.toLowerCase();
    }

    ignore = ignore.map((tag) => tag.toLowerCase());

    // generate pool of usable tags
    sets.forEach((set) => {
        if (set.tags) {
            set.tags.forEach((tag) => {
                const lowerTag = tag.toLowerCase();
                if (!tags.includes(lowerTag)
                    && !oppositeTags.includes(lowerTag)
                    && lowerTag !== 'bug'
                    && !ignore.includes(lowerTag)
                    && lowerTag.includes(input)) {
                    tags.push(lowerTag);
                }
            });
        }
    });

    return tags;
};

export const getHistoryFilterTagsToIncludeSuggestions = (state, input, ignore) => getHistoryFilterTagsSuggestions(state, input, ignore, true);

export const getHistoryFilterTagsToExcludeSuggestions = (state, input, ignore) => getHistoryFilterTagsSuggestions(state, input, ignore, false);

// up in the air for memoizing, only runs on attempt export csv, export csv, and export csv error
// may not be worth caching for a rare operation that won't be needed outside it
export const getNumHistoryReps = (state) => {
    let sets = getHistorySetsChronological(state);

    var num_reps = 0;
    
    sets.forEach((set) => {
        if (set.reps) {
            num_reps += set.reps.length;
        }
    });
    
    return num_reps;    
};

const getHistoryWorkoutIDs = (state) => {
    let sets = getHistorySetsChronological(state);

    if (sets.length === 0) {
        return [];
    }
    
    let workoutIDs = [sets[0].workoutID];

    for (var i = 1; i < sets.length; i++) {
        if (sets[i].workoutID !== sets[i - 1].workoutID) {
            workoutIDs.push(sets[i].workoutID);
        }
    }

    return workoutIDs;
};

// up in the air for memoizing, only runs on attempt export csv, export csv, and export csv error
// may not be worth caching for a rare operation that won't be needed outside it
export const getNumHistoryWorkouts = (state) => {
    return getHistoryWorkoutIDs(state).length;
};

// not memoizing because setID
export const getHistorySet = (state, setID) => {
    var dictionary = stateRoot(state).historyData;
    for (var property in dictionary) {
        if (dictionary.hasOwnProperty(property)) {
            let set = dictionary[property];
            if (set.setID === setID) {
                return set;
            }
        }
    }
    return null;
};

// up in the air for memoizing, only runs on attempt export csv, export csv, and export csv error
// may not be worth caching for a rare operation that won't be needed outside it
export const getTimeSinceLastWorkout = (state) => {
    const sets = getHistorySetsChronological(state);
    if (sets.length <= 0) {
        return null;
    } else {
        const lastSet = sets[sets.length-1];
        const startTime = Date.parse(SetUtils.startTime(lastSet));
        return Date.now() - startTime;
    }
};

// Workout / History

// not memoizing because setID
export const getSet = (state, setID) => {
    // check workout
    let set = getWorkoutSet(state, setID);

    // check history
    if (set === undefined) {
        set = getHistorySet(state, setID);
    }

    return set;
};

// Syncing

export const getSetIDsToUpload = state => stateRoot(state).setIDsToUpload;

// memoizing in case of failed sync
export const getSetsToUpload = createSelector(
    getSetIDsToUpload,
    state => stateRoot(state).historyData,
    (ids, historyData) => {
        return ids.map( setID => historyData[setID] );
    }
);

export const getNumSetsToUpload = state => getSetIDsToUpload(state).length;

export const getSetIDsBeingUploaded = state => stateRoot(state).setIDsBeingUploaded;

export const getNumSetsBeingUploaded = state => getSetIDsBeingUploaded(state).length;

export const getIsUploading = state => getSetIDsBeingUploaded(state).length > 0;

// not memoizing as it's too minor
// memoizing would involve 2 ref checks anyway, this involves two > 0 checks, difference in theory is minor
export const hasChangesToSync = state => {
    return getNumSetsToUpload(state) > 0 || getNumSetsBeingUploaded(state) > 0;
}

export const getRevision = (state) => stateRoot(state).revision;

// ALL

// memoizing called in enough places, hoping shallow copy of arrays is enough as it's just an array of references anyway
export const getAllSets = createSelector(
    getHistorySets,
    getWorkoutSets,
    (historySets, workoutSets) => {
        return historySets.concat(workoutSets);
    }
);

// EXERCISE

// check if exercise exists
const exerciseExists = (exercise, arr) => {
    return arr.some((item) => {
        return item.label === exercise;
    }); 
};

// memoizing due to exercise picker screen
export const generateExerciseItems = createSelector(
    getAllSets,
    (sets) => {
        const exercises = [];

        sets.forEach((set) => {
            if (set.exercise) {
                const lowercase = set.exercise.toLowerCase();
                if (!exerciseExists(lowercase, exercises) && SetUtils.numValidUnremovedReps(set) > 0) {
                    exercises.push({ label: lowercase, value: lowercase });
                }
            }
        });
    
        return exercises;
    }
);
