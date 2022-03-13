/**
 * Chekcs if text contains content requiring update
 * @param text String to check
 * @returns true or false
 */

function isValidStreetContent(text: string): boolean {
  return text.search(/\s-\s/) > 0;
}

/**
 * Cleans street text from characters after a quantifier
 * @param text String to clean
 * @returns String with removed characters after first occurance of quantifier
 */

function cleanStreetText(text: string): string {
  return text.split(' - ')[0];
}

function main(): void {
  const document: Document = app.activeDocument;

  for (let i = 0; i < document.textFrames.length; i++) {
    const textFrame: TextFrameItem = document.textFrames[i];

    if (isValidStreetContent(textFrame.contents)) {
      textFrame.contents = cleanStreetText(textFrame.contents);
    }
  }
}

main();