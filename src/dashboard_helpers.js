const cardButtons = `
<div class="card_controls row">
    <input type="checkbox" name="autoplay" class="autoplay" onclick="toggleNoticeAuto(this)">
    <button class="display" onclick="toggleShown(this)"> [--] </button>
    <button class="delete" onclick="deleteNotice(this)"> X </button>
</div>`

// Helpers
function removeElement(id) {
    // console.log(`Removing ${id}`);
    var elem = document.getElementById(id).parentNode;
    return elem.parentNode.removeChild(elem);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function reIDNotices() {
    //TODO: find a way to make sure notices don't share an ID when delete happens
}