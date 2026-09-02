import * as VideoThumbnails from 'expo-video-thumbnails'; // TODO: move to expo-video as this is deprecated
import * as FileSystem from 'expo-file-system';

export const generateThumbnail = async videoPath => {
    try {
        const { uri } = await VideoThumbnails.getThumbnailAsync(videoPath);
        return uri;
    } catch (err) {
        console.tron.log(
            'Error generating video thumbnail setTitleRowCollapsed' + err,
        );
    }
};

export const waitUntilFileExists = async (filePath, ms = 500) => {
    return await new Promise((resolve, reject) => {
        const interval = setInterval(async () => {
            const fileInfo = await FileSystem.getInfoAsync(filePath);
            const { exists } = fileInfo;

            if (exists) {
                resolve();
                clearInterval(interval);
            }
        }, ms);
        // clear interval if the file does not exist after 5s
        setTimeout(function () {
            reject('File does not exist');
            clearInterval(interval);
        }, 5000);
    });
};
