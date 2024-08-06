
const bubbleStorageKey = "noticeToShow";

function populateNotice(bgPath, text) {
    document.getElementById("content")
            .getElementsByTagName("p")[0]
            .textContent = text;

    if(isImage(bgPath)){
        document.getElementById("main")
                .getElementsByTagName("video")[0]
                .hidden = true;
        
        let imgElem = document.getElementById("main").getElementsByTagName("img")[0];
        imgElem.src = bgPath;
        imgElem.hidden = false;

    } else if(isVideo(bgPath)) {
        document.getElementById("main")
                .getElementsByTagName("img")[0]
                .hidden = true;

        let videoElem = document.getElementById("main").getElementsByTagName("video")[0];
        let sourceElem = videoElem.getElementsByTagName("source")[0];
        sourceElem.src = bgPath;
        
        let ext = getFileExt(bgPath);
        if(ext === "mp4"){
            sourceElem.type = "video/mp4";
        } else if(ext === "webm"){
            sourceElem.type = "video/webm";
        }

        videoElem.hidden = false;
    } else {
        console.log("Format not yet implemented for: " + bgPath);
        //hide both img and video
        document.getElementById("main")
                .getElementsByTagName("img")[0]
                .hidden = true;
        document.getElementById("main")
                .getElementsByTagName("video")[0]
                .hidden = true;
    }
}

// Checking if a notice has to be shown
function poolDisplayNotice() {
    try {
        const key = localStorage.getItem(bubbleStorageKey);
        //console.log(key);

        if(key == "empty") {
            if (window.shown != ""){
                window.shown = "";
                document.getElementById("main").hidden = true;
            }
        } else {
            if(window.shown != key) {
                var noticeData = JSON.parse(localStorage.getItem(key));
                var bgPath = noticeData["file"];
                var text = noticeData["text"];

                populateNotice(bgPath, text);

                document.getElementById("main").hidden = false;
                window.shown = key;
            }
        }

    } catch (error) {
        // if key not in localStorage, assume empty
        window.shown = "";
        document.getElementById("main").hidden = true;
        console.log(error);
        return;
    }
}