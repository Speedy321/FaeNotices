const shownNoticeBtnValue = "[<>]";
const hiddenNoticeBtnValue = "[--]";

const bubbleStorageKey = "noticeToShow";

var maxNoticeID = 0;
var autoCurrentNoticeID = 0;
var autoNotices = [];
var autoPlayOn = false;

// Fuctions for the card buttons.
function toggleShown(btnElem) {
    let id = btnElem.parentNode.parentNode.id;
    var currentShownId = localStorage.getItem(bubbleStorageKey);
    //console.log("toggle: "+ id + " - " + currentShownId);
    
    if(currentShownId == id) {
        // Hide this card, diplay nothing.
        localStorage.setItem(bubbleStorageKey, "empty");
        btnElem.innerHTML = hiddenNoticeBtnValue;
    } else {
        localStorage.setItem(bubbleStorageKey, id);
        if(currentShownId != "empty") {
            // Hide currently showing notice
            document.getElementById(currentShownId)
                    .getElementsByClassName("display")[0]
                    .innerHTML = hiddenNoticeBtnValue;
        }
        btnElem.innerHTML = shownNoticeBtnValue;
    }
}

function deleteNotice(btnElem) {
    let id = btnElem.parentNode.parentNode.id;
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
    let bgPath = document.getElementById("bg_path_select").value;
    let text = document.getElementById("notice_text_area").value;

    var uuid = maxNoticeID + 1;
    localStorage.setItem(uuid, JSON.stringify({"file": bgPath, "text": text, "auto": false}));
    document.getElementById("notice_list").append(getCardFromTemplate(uuid, bgPath, text));
    maxNoticeID = uuid;
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
    var id = chbElem.parentNode.parentNode.id;
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
            toggleShown(document.getElementById(id).getElementsByClassName("display")[0]);
        }
        data["auto"] = false;
    }
    localStorage.setItem(id, JSON.stringify(data))
}

// On load execution to populate from localStorage and enable auto play
window.onload = function () {
    console.log("On Load!");

    autoPlayOn = (localStorage.getItem("autoPlayStatus") == 'true');

    var keys = Object.keys(localStorage);
    keys.sort();
    var i = 0, key;

    // populate from localStorage
    for (; key = keys[i]; i++) {
        let notice_data = validateNoticeData(localStorage.getItem(key));
        // console.log(notice_data);
        if(notice_data) {
            document.getElementById("notice_list")
                    .append(getCardFromTemplate(key, notice_data["file"], notice_data["text"], notice_data["auto"]));
            if(notice_data["auto"]){
                autoNotices.push(key);
            }
            maxNoticeID = JSON.parse(key);
        }
    }

    // enable auto play
    setInterval(poolAutoPlay.bind(250), 500);
    poolAutoPlay();
}

async function poolAutoPlay(delay_between) {
    if (autoPlayOn) {
        const old_index = autoNotices.indexOf(autoCurrentNoticeID);
        var new_id = 0;
        if (old_index > -1) {
            new_id = autoNotices[old_index + 1];
            if(!new_id){
                console.log("looping");
                new_id = autoNotices[0];
            }
        } else if (autoNotices.length > 0) {
            new_id = autoNotices[0];
        }
        // console.log(old_index + " - " + new_id);

        // toggle old notice off
        var currentShownId = localStorage.getItem(bubbleStorageKey);
        if (currentShownId == autoCurrentNoticeID) {
            toggleShown(document.getElementById(new_id).getElementsByClassName("display")[0]);
        }
        
        // sleep between notices
        await sleep(delay_between);

        // display next notice
        if (new_id > 0) {
            toggleShown(document.getElementById(new_id).getElementsByClassName("display")[0]);
        }
        autoCurrentNoticeID = new_id;
        // console.log(autoNotices);
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
}