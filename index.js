let byteArray = null;
const representations = [
    document.querySelector(".representation--left"),
    document.querySelector(".representation--right")
];

/**
 * @returns {HTMLElement[]}
 */
function querySelectorAll(selectors, target=document) {
    return Array.from(target.querySelectorAll(selectors));
}

document.querySelector("#input-file").onchange = function() {
    let file = this.files[0];

    selectFile(file);
}

/**
 * Groups each consecutive sequence of `N` values with `connector`, and returns this new array
 * @param {Array} arr 
 * @param {number} N 
 * @param {string} connector 
 */
function joinEvery(arr, N, connector) {
    const result = [];
    for(let i = 0; i <= (arr.length-1) / N; ++i) {
        result.push(arr.slice(i*N, Math.min(arr.length, (i+1)*N)).join(connector));
    }
    return result;
}

/**
 * @param {File} file 
 */
function selectFile(file) {
    const reader = new FileReader();

    reader.onload = function(event) {
        byteArray = new Uint8Array(event.target.result);

        setupBothRepresentations();
    };

    reader.readAsArrayBuffer(file);
}

function setupBothRepresentations() {
    const NUMBER_OF_BYTES = 0x120;
    const pruned = byteArray.slice(0, NUMBER_OF_BYTES);
    
    representations[0].querySelector(".bytes").innerHTML = joinEvery(toByteString(pruned), 16, " ").join("<br>").replace(/\s/g, "&nbsp;");
    representations[1].querySelector(".bytes").innerHTML = joinEvery(toASCIIString(pruned), 16, " ").join("<br>").replace(/\s/g, "&nbsp;");
}

/**
 * @param {Array} pruned 
 * @returns {Array}
 */
function toByteString(pruned) {
    return Array.from(pruned).map(byte => byte.toString(16).padStart(2, '0'));
}

/**
 * @param {Array} pruned 
 * @returns {Array}
 */
function toASCIIString(pruned) {
    const decoder = new TextDecoder('utf-8');
    return Array.from(decoder.decode(pruned));
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