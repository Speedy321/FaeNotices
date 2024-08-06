

const cardHtmlString = `
<div class="card" id="template">
    <video playsinline autoplay muted loop>
        <source src="" type="video/webm">
        Your browser does not support the video tag.
    </video>
    <img src="assets/background.gif">
    <div class="container">
        <p>Hello World</p>
    </div>
    <div class="card_controls">
        <input type="checkbox" name="autoplay" onclick="toggleNoticeAuto(this)">
        <button class="display" onclick="toggleShown(this)"> [--] </button>
        <button class="delete" onclick="deleteNotice(this)"> X </button>
    </div>
</div>
`

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

function populateNoticeCard(cardElem, bgPath, text, auto_on) {
    cardElem.getElementsByClassName("container")[0]
            .getElementsByTagName("p")[0]
            .textContent = text;

    cardElem.getElementsByTagName("input")[0].checked = auto_on;
    // console.log(cardElem.getElementsByTagName("input")[0]);
    // console.log(auto_on);

    // console.log(cardElem);
    // console.log(bgPath + " - " + text);

    if(isImage(bgPath)){
        cardElem.getElementsByTagName("video")[0]
                .hidden = true;
        
        let imgElem = cardElem.getElementsByTagName("img")[0];
        imgElem.src = bgPath;
        imgElem.hidden = false;

    } else if(isVideo(bgPath)) {
        cardElem.getElementsByTagName("img")[0]
                .hidden = true;

        let videoElem = cardElem.getElementsByTagName("video")[0];
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
        // hide both video and image
        cardElem.getElementsByTagName("video")[0]
                .hidden = true;
        cardElem.getElementsByTagName("img")[0]
                .hidden = true;
    }
}

function getCardFromTemplate(uuid, bgPath, text, auto_on) {
    var cardElem = elementFromHTMLString(cardHtmlString);
    cardElem.id = uuid;
    populateNoticeCard(cardElem, bgPath, text, auto_on);
    return cardElem;
}