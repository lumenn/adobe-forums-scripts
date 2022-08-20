var FONT_FAMILY_TO_REPLACE = 'Arial';
var TARGET_FONT_FAMILY = 'BookAntiqua';
function calcFontName(originalStyle, fontName) {
    if (originalStyle === 'Regular') {
        return fontName;
    }
    else {
        return "".concat(fontName, "-").concat(originalStyle).replace(' ', '');
    }
}
function setLayersLock(doc, value) {
    for (var i = 0; i < doc.layers.length; i++) {
        var layer = doc.layers[i];
        layer.locked = value;
    }
}
function main() {
    var doc = app.activeDocument;
    if (doc === undefined) {
        alert('No active document fount.', 'No document opened.');
        return;
    }
    setLayersLock(doc, false);
    var frames = doc.textFrames;
    for (var i = 0; i < frames.length; i++) {
        var frame = frames[i];
        if (frame.textRange.characterAttributes.textFont.family !== FONT_FAMILY_TO_REPLACE)
            continue;
        var originalStyle = frame.textRange.characterAttributes.textFont.style;
        frame.textRange.characterAttributes.textFont = app.textFonts[calcFontName(originalStyle, TARGET_FONT_FAMILY)];
    }
    setLayersLock(doc, true);
}
main();
