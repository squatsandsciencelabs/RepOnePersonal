import {
    takeEvery,
    put,
    apply,
    all,
    call,
    select,
} from 'redux-saga/effects';
import Share from 'react-native-share';
import ReactNativeBlobUtil from 'react-native-blob-util';

import * as CSVConverter from 'app/utility/CSVConverter';
import * as SetsSelectors from 'app/redux/selectors/SetsSelectors';

import { 
    EXPORTING_CSV,
} from 'app/configs+constants/ActionTypes';

export default function * FetchConfigSaga() {
    yield all([
        takeEvery(EXPORTING_CSV, exportCSV),
    ]);
};

function* exportCSV(action) {
    if (action.isExportingCSV !== true) {
        return;
    }

    // filename
    const fs = ReactNativeBlobUtil.fs;
    let filename = 'RepOne_Data_Export.csv';
    const filepath = `${fs.dirs.CacheDir}/${filename}`;

    try {

        // csv as base64
        const base64 = ReactNativeBlobUtil.base64;
        const sets = yield select(SetsSelectors.getHistorySetsChronological);
        const csv = CSVConverter.convert(sets);
        const base64Data = base64.encode(csv);

        // clear file if it exists
        const exists = yield apply(fs, fs.exists, [filepath]);
        if (exists) {
            yield apply(fs, fs.unlink, [filepath]);
            console.tron.log(`unlink file as it exists`);
        }

        // write to file
        yield apply(fs, fs.createFile, [filepath, base64Data, 'base64']);

        // share
        yield apply(Share, Share.open, [{ url: `file://${filepath}`, type:'text/csv', filename, title: filename, saveToFiles: true, showAppsToView: true }]);

        // finish
        yield put({
            type: EXPORTING_CSV,
            isExportingCSV: false
        });
    } catch (err) {
        console.tron.log(`Export CSV error ${err}`);
        try {
            yield apply(fs, fs.unlink, [filepath]);
        } catch (err) {
            console.tron.log(`Export CSV failed to unlink filepath on err ${err}`);
        }
    }
}
