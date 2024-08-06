function getFileExt(filePath){
    return filePath.substring(
            filePath.lastIndexOf('.')+1, 
            filePath.length
        ) || filePath;
}

const imageExts = [
    "png", 
    "apng",  //animated PNG
    "jpg",   // Jpeg formats from here
    "jpeg",
    "jfif",
    "pjp",
    "pjpeg", // to here
    "svg",   // Vector graphics
    "webp",
    "avif",  // AV1 picture (animated)
    "gif"
]
function isImage(filePath){
    let ext = getFileExt(filePath).toLowerCase();
    return imageExts.includes(ext);
}

const videoExts = [
    "webm",
    "mp4"
]
function isVideo(filePath){
    let ext = getFileExt(filePath).toLowerCase();
    return videoExts.includes(ext);
}

function updateFileList(){
    
}