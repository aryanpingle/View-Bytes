let byteArray = null;

document.querySelector("#input-file").onchange = function() {
    let file = this.files[0];

    selectFile(file);
}

/**
 * @param {File} file 
 */
function selectFile(file) {
    const reader = new FileReader();

    reader.onload = function(event) {
        byteArray = new Uint8Array(event.target.result);
        const NUMBER_OF_BYTES = 100;

        const hexString = Array.from(byteArray.slice(0, NUMBER_OF_BYTES), byte => byte.toString(16).padStart(2, '0')).join(' ');
        document.getElementById('bytes').innerHTML = hexString;
    };

    reader.readAsArrayBuffer(file);
}

/**
 * @param {DragEvent} event 
 */
function fileDropped(event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    // Hide the drag'n'drop section
    hideDropFileSection();

    selectFile(event.dataTransfer.files[0]);
}

function onDragOverInputSection(event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    showDropFileSection();
}

function onMouseOutInputSection(event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    hideDropFileSection();
}

function showDropFileSection() {
    document.querySelector(".drop-file-section").classList.add("shown");
}

function hideDropFileSection() {
    document.querySelector(".drop-file-section").classList.remove("shown");
}

function setup() {
    let sectionDropFile = document.body
    // To allow dropping
    sectionDropFile.addEventListener("dragover", onDragOverInputSection)
    sectionDropFile.addEventListener("mouseout", onMouseOutInputSection)
    sectionDropFile.addEventListener("drop", fileDropped)
}

setup()