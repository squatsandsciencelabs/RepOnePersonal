import * as VideoThumbnails from 'expo-video-thumbnails';

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
