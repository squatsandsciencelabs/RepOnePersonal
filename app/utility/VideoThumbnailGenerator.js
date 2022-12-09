import * as VideoThumbnails from 'expo-video-thumbnails';
import * as FileSystem from 'expo-file-system';

export const generateThumbnail = async (videoPath) => {
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
    return await new Promise(resolve => {
        const interval = setInterval(async () => {
            const fileInfo = await FileSystem.getInfoAsync(filePath);
            const { exists } = fileInfo;

            if (exists) {
                resolve();
                clearInterval(interval);
            }
        }, ms);
    });
};
