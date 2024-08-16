const shownNoticeBtnValue = "[<>]";
const hiddenNoticeBtnValue = "[--]";

const bubbleStorageKey = "noticeToShow";

const SCALE = 0.5;

var maxNoticeID = 0;
var autoCurrentNoticeID = 0;
var autoNotices = [];
var autoPlayOn = false;
var autoPlayIntervalObj;

function makeNewCard(noticeID) {
    var data = JSON.parse(localStorage.getItem(noticeID));
    data["scale"] = SCALE;

    var buttons = elementFromHTMLString(cardButtons);
    buttons.getElementsByClassName("autoplay")[0].checked = data["auto"];
    if (data["auto"]) {
        autoNotices.push(noticeID);
    }

    var container = document.createElement("div");
    container.className = "iframe-container col";
    container.appendChild(buttons);

    var frame = document.createElement("iframe");
    frame.scrolling = "no";
    frame.id = noticeID;
    frame.frameBorder = 0;
    frame.className = "card";
    
    if (data["height"]) {
        frame.style.height = `${data["height"]}`;
    }
    if (data["width"]) {
        frame.style.width = `${data["width"]}`;
    }

    frame.src = data["file"] + "?" + JSON.stringify(data);

    container.appendChild(frame);

    document.getElementById("notice_list").appendChild(container);
}

function showNotice(id) {
    localStorage.setItem(bubbleStorageKey, id);
    document.getElementById(id).parentNode
            .getElementsByClassName("display")[0]
            .innerHTML = shownNoticeBtnValue;
}

function hideNotice(id) {
    localStorage.setItem(bubbleStorageKey, "empty");
    document.getElementById(id).parentNode
            .getElementsByClassName("display")[0]
            .innerHTML = hiddenNoticeBtnValue;
}

// Fuctions for the card buttons.
function toggleShown(btnElem) {
    let id = btnElem.parentNode.parentNode.getElementsByTagName("iframe")[0].id;
    var currentShownId = localStorage.getItem(bubbleStorageKey);
    // console.log("toggle: "+ id + " - " + currentShownId);
    
    if(currentShownId == id) {
        hideNotice(id);
    } else {
        if(currentShownId != "empty") {
            hideNotice(currentShownId);
        }
        showNotice(id);
    }
}

function deleteNotice(btnElem) {
    let id = btnElem.parentNode.parentNode.getElementsByTagName("iframe")[0].id;
    var currentShownId = localStorage.getItem(bubbleStorageKey);
    
    if(currentShownId == id) {
        // Hide this card, diplay nothing.
        localStorage.setItem(bubbleStorageKey, "empty");
    }
    
    localStorage.removeItem(id);
    removeElement(id);
}

// Other dashboard functionalities
function newNotice() {
    document.getElementById("new_notice_form").hidden = false;
}

function addNewNotice() {
    var config = {};
    var inputs = document.querySelectorAll("#inputs input");

    inputs.forEach(element => {
        config[element.id] = element.value;
    });

    const previewElem = document.getElementById("preview");

    var templateHTML = previewElem.src;
    var templateHTML = templateHTML.substring(0, templateHTML.indexOf("?"));

    //Note: these will from now on be strings, and 0.5x the original size.
    var width = previewElem.style.width
    var height = previewElem.style.height

    var newID = maxNoticeID + 1;
    localStorage.setItem(newID, JSON.stringify({
        "file": templateHTML, 
        "config": config, 
        "auto": false,
        "width": width,
        "height": height
    }));
    makeNewCard(newID);

    maxNoticeID = newID;
}

function closeNewNotice(){
    document.getElementById("new_notice_form").hidden = true;
}

function editCommands() {
    alert("Chat commands not yet implemented.");
    //TODO: open a ui to add/modify chat commands
}

function toggleNoticeAuto(chbElem) {
    console.log(chbElem);
    var is_on = chbElem.checked;
    var id = chbElem.parentNode.parentNode.getElementsByTagName("iframe")[0].id;
    var data = JSON.parse(localStorage.getItem(id));
    if (is_on) {
        autoNotices.push(id);
        data["auto"] = true;
    } else {
        const index = autoNotices.indexOf(id);
        if (index > -1) { // only splice array when item is found
            autoNotices.splice(index, 1); // 2nd parameter means remove one item only
        }

        var currentShownId = localStorage.getItem(bubbleStorageKey);
        if (currentShownId == id) {
            toggleShown(document.getElementById(id).parentNode.getElementsByClassName("display")[0]);
        }
        data["auto"] = false;
    }
    localStorage.setItem(id, JSON.stringify(data))
}

// On load execution to populate from localStorage and enable auto play
window.onload = function () {
    console.log("On Load!");

    autoPlayOn = (localStorage.getItem("autoPlayStatus") == 'true');
    if (autoPlayOn){
        document.getElementById("autorun_toggle").innerHTML = "Deactivate Auto Play";
        onDelayChanged(); // activate autoplay
    }

    var keys = Object.keys(localStorage);
    keys.sort();
    var i = 0, key;

    // populate from localStorage
    for (; key = keys[i]; i++) {
        if (validDataAt(key)) {
            makeNewCard(key);
            const keyval = JSON.parse(key);
            if (keyval > maxNoticeID){
                maxNoticeID = keyval;
            }
        }
    }

    // Set template selector action
    const fileSelector = document.getElementById('template-select');
    fileSelector.addEventListener('change', (event) => {
        const fileList = event.target.files;
        // console.log(fileList);
        readFile(fileList[0], onTemplateSelect);
    });

    const delayInput = document.getElementById("delay_s");
    delayInput.addEventListener("change", onDelayChanged);
}

async function poolAutoPlay() {
    if (autoPlayOn) {

        const currentShownID = localStorage.getItem(bubbleStorageKey);
        var newToShowID;

        if (autoNotices.length > 0) {
            const currentIDX = autoNotices.indexOf(currentShownID);
            if (currentIDX > -1){
                newToShowID = autoNotices[(currentIDX + 1) % autoNotices.length];
            } else {
                newToShowID = autoNotices[0];
            }
            
            console.log(`${currentShownID}[${currentIDX}] => ${newToShowID}`);
            if (currentShownID != "empty") {
                hideNotice(currentShownID);
            }
            showNotice(newToShowID);

        } else {
            console.log(`List empty and showing ${currentShownID}`);
            if (currentShownID != "empty") {
                hideNotice(currentShownID);
            }
        }
    }
}

function toggleAutoRun() {
    if (autoPlayOn) {
        document.getElementById("autorun_toggle").innerHTML = "Activate Auto Play";
        autoPlayOn = false;
        localStorage.setItem("autoPlayStatus", false);
    } else {
        document.getElementById("autorun_toggle").innerHTML = "Deactivate Auto Play";
        autoPlayOn = true;
        localStorage.setItem("autoPlayStatus", true);
    }
    onDelayChanged();
}

function onTemplateSelect(templateJSON) {
    const htmlFile = templateJSON["html"];
    const config = templateJSON["config"];

    console.log(templateJSON);

    var inputsElem = document.getElementById("inputs");
    for (const key in config) {
        if (Object.hasOwnProperty.call(config, key)) {
            const element = config[key];

            var div = document.createElement("div");
            div.className = "row"

            var label = document.createElement("label");
            label.for = key;
            label.innerHTML = `${key}: `;

            var input = document.createElement("input");
            input.name = key;
            input.id = key;
            input.onchange = updatePreviewOnChange;
            input.oninput = updatePreviewOnChange;
            
            switch (element["type"]) {
                case "string":
                    input.type = "text";
                    break;
                case "color":
                    input.type = "color";
                    input.value = config[key].value;
                    break;
                case "number":
                    input.type = "number";
                    input.value = config[key].value;
                    break;
                default:
                    input.type = "text";
                    break;
            }

            div.appendChild(label);
            div.appendChild(input);
            inputsElem.appendChild(div);
        }
    }

    templateJSON["scale"] = SCALE;
        
    var preview = document.getElementById("preview")
    if (templateJSON["height"]) {
        preview.style.height = `${templateJSON["height"]/2}px`;
    }
    if (templateJSON["width"]) {
        preview.style.width = `${templateJSON["width"]/2}px`;
    }
    document.getElementById("preview").src = htmlFile;
    updatePreviewOnChange();
}

function updatePreviewOnChange() {
    var config = {};
    var inputs = document.querySelectorAll("#inputs input");

    inputs.forEach(element => {
        config[element.id] = element.value;
    });

    var templateHTML = document.getElementById("preview").src;

    if(templateHTML.indexOf("?")>-1){
        var templateHTML = templateHTML.substring(0, templateHTML.indexOf("?"));
    }

    var jsonStrConfig = JSON.stringify({"scale": SCALE, "config": config})

    document.getElementById("preview").src = `${templateHTML}?${jsonStrConfig}`;
}

function onDelayChanged() {
    const delay = document.getElementById("delay_s").value;

    var keys = Object.keys(localStorage);
    keys.sort();
    var i = 0, key;

    for (; key = keys[i]; i++) {
        if (validDataAt(key)) {
            var keyval = JSON.parse(localStorage[key]);
            keyval["animation-duration"] = delay;
            // console.log(keyval);
            localStorage.setItem(key, JSON.stringify(keyval));
        }
    }

    clearInterval(autoPlayIntervalObj);
    autoPlayIntervalObj = setInterval(poolAutoPlay, delay*1000); //in ms
    poolAutoPlay();
}