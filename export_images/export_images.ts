function displayMessage(text: string): void {
  var messageWindow = new Window("dialog", undefined, undefined, {
    borderless: true
  });
  messageWindow.add("statictext", undefined, text);
  messageWindow.add("button", undefined, "OK");
  messageWindow.show();
}

function getActiveDocument(app: Application): Document {
  if(app.activeDocument) {
    return app.activeDocument
  } else {
    prompt("There are no opened documents")
  }
}

function getDestinationPath(pathToDocument: string): string {
  let newPath: string;
  let name: string;

  name = pathToDocument.split("\\").pop();
  newPath = `${pathToDocument.slice(0, -6 - (name.length + 1))}_media` ;

  return newPath;
}

function getImages(document: Document, destPath: string, filename: string): void {
  let options: ImageCaptureOptions = new ImageCaptureOptions;

  options.resolution = 150;
  options.antiAliasing = true;
  options.matte = false;

  for(let i = 0; i< document.artboards.length; i++) {
    let outputFile: File;
    outputFile = new File(`${destPath}\\${filename}${i + 1}.jpg`);
    document.imageCapture(outputFile, document.artboards[i].artboardRect, options);
  }

}

function main(): void {
  const activeDocument: Document = getActiveDocument(app);
  const destPath: string = getDestinationPath(activeDocument.fullName.fsName);
  getImages(activeDocument, destPath, activeDocument.fullName.displayName.split("\.").pop());
  displayMessage("Files saved");
}

main();