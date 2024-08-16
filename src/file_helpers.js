
/**
 * @param {String} HTML representing a single element.
 * @param {Boolean} flag representing whether or not to trim input whitespace, defaults to true.
 * @return {Element | HTMLCollection | null}
 */
function elementFromHTMLString(htmlString, trim = true) {
    // Process the HTML string.
    htmlString = trim ? htmlString.trim() : htmlString;
    if (!htmlString) return null;
  
    // Then set up a new template element.
    const template = document.createElement('template');
    template.innerHTML = htmlString;
    const result = template.content.children;
  
    // Then return either an HTMLElement or HTMLCollection,
    // based on whether the input HTML had one or more roots.
    if (result.length === 1) return result[0];
    return result;
}

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

// Only works when hosted on a server
async function listDir(rootPath) {
    const baseURL = document.location.origin;

    const response = await fetch(`${baseURL}/${rootPath}`);
    const respText = await response.text();
    const htmlResp = elementFromHTMLString(respText);

    const htmlLiA = htmlResp[htmlResp.length -1].querySelectorAll("ul li a");

    var dirContent = [];
    htmlLiA.forEach(a => {
        href = a.href;
        if (href != "/"){
            dirContent.push(href);
        }
    });
    
    return dirContent;
}

function readFile(file, callbackFunc) {
    console.log(file);
    
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        const fileData = reader.result;
        templateData = JSON.parse(fileData);
    
        switch (templateData["version"]) {
            case "1.0":
                // for demo, Display selected template in iframe.
                callbackFunc(templateData);
                break;
            default:
                console.log("Unknown template version" + templateData["version"]);
                templateData = {};
                break;
        }

        console.log(fileData);
    });
    reader.readAsText(file);
}

function validDataAt(key) {
    var data = localStorage.getItem(key);
    try {
        data = JSON.parse(data);
        const path = data["file"];
        
        if(path){
            return true;
        }
    } catch (error) {
        if (error instanceof SyntaxError) {
            console.debug(error);
            console.debug(`${key}: ${data}`);
            return false;
        } else {
            throw error;
        }
    }
    return false;
}
