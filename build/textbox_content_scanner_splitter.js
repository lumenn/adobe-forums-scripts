function isValidStreetContent(text) {
    return text.search(/\s-\s/) > 0;
}
function cleanStreetText(text) {
    return text.split(' - ')[0];
}
function main() {
    var document = app.activeDocument;
    for (var i = 0; i < document.textFrames.length; i++) {
        var textFrame = document.textFrames[i];
        if (isValidStreetContent(textFrame.contents)) {
            textFrame.contents = cleanStreetText(textFrame.contents);
        }
    }
}
main();
