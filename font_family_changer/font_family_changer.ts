const FONT_FAMILY_TO_REPLACE: string = 'Arial';
const TARGET_FONT_FAMILY: string = 'BookAntiqua'; 
//Illustrator keeps some internal font names, try removing spaces from the name, if not use debug tools.

/**
 * Creates string to get correct font.
 * @param originalStyle Name of the style/face which should be used.
 * @param fontName Name of the font - illustrator keeps internal names - make sure it's correct.
 * @returns Concatenated font name with style.
 */
function calcFontName(originalStyle: string, fontName: string) {
  if (originalStyle === 'Regular') {
    return fontName;
  } else {
    return `${fontName}-${originalStyle}`.replace(' ', '');
  }
}

/**
 * Locks/unlocks all top level layers in document.
 * @param doc Document on which actions should be performed.
 * @param value True for locking, false for unlocking.
 */
function setLayersLock(doc: Document, value: boolean): void {
  for (let i = 0; i < doc.layers.length; i++) {
    const layer: Layer = doc.layers[i];
    layer.locked = value;
  }
}

/**
 * Looks for font family to replace.
 */
function main(): void {
  let doc: Document = app.activeDocument;
  
  if (doc === undefined) {
    alert('No active document fount.', 'No document opened.');
    return;
  }

  setLayersLock(doc, false);

  let frames: TextFrameItems = doc.textFrames;

  for (let i = 0; i < frames.length; i++) {
    const frame: TextFrameItem = frames[i];
    if (frame.textRange.characterAttributes.textFont.family !== FONT_FAMILY_TO_REPLACE) continue;
    
    const originalStyle: string = frame.textRange.characterAttributes.textFont.style;
    frame.textRange.characterAttributes.textFont = app.textFonts[calcFontName(originalStyle, TARGET_FONT_FAMILY)]; 
  }

  setLayersLock(doc, true);
}

main(); 