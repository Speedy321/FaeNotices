
const bubbleStorageKey = "noticeToShow";

const SCALE = 1.0;

function populateNotice(jsonData) {
    jsonData["scale"] = SCALE;

    document.getElementById("frame").remove();

    var frame = document.createElement("iframe");
    frame.id = "frame";
    frame.frameBorder = 0;
    frame.scrolling = "no";
    frame.src = jsonData["file"] + "?" + JSON.stringify(jsonData);
    document.querySelector("body").appendChild(frame);
    // frame.contentWindow.location.reload();
}

// Checking if a notice has to be shown
function poolDisplayNotice() {
    try {
        const key = localStorage.getItem(bubbleStorageKey);
        console.log(key);

        if(key == "empty") {
            if (window.shown != ""){
                window.shown = "";
                document.getElementById("frame").src = "";
            }
        } else {
            if(window.shown != key) {
                var noticeData = JSON.parse(localStorage.getItem(key));
                populateNotice(noticeData);
                window.shown = key;
            }
        }

    } catch (error) {
        // if key not in localStorage, assume empty
        window.shown = "";
        document.getElementById("frame").src = "";
        console.log(error);
        return;
    }
}