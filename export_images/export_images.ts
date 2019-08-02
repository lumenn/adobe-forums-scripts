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

  name = pathToDocument.split("/").pop();
  newPath = `${pathToDocument.slice(0, - name.length)}_media` ;

  let checkFolder: Folder = new Folder(`${newPath}/`);

  if (checkFolder.exists) {
    return newPath;
  } else {
    checkFolder.create();
    return newPath;
  }
}


function createImages(document: Document, destPath: string, filename: string): void {

  let options: ExportForScreensOptionsJPEG = new ExportForScreensOptionsJPEG;
  options.compressionMethod = JPEGCompressionMethodType.BASELINESTANDARD;
  options.embedICCProfile = false;
  options.antiAliasing = AntiAliasingMethod.TYPEOPTIMIZED;
  options.scaleType = ExportForScreensScaleType.SCALEBYRESOLUTION;
  options.scaleTypeValue = 150;
  
  let prefix: string;
  prefix = `${filename.split("\.").shift()}!@#$`;

  let outputFile: File;
  outputFile = new File(`${destPath}/${filename}`);
  document.exportForScreens(outputFile, ExportForScreensType.SE_JPEG100, options, undefined, prefix);

}

function moveFilesToParentFolder(rootPath: string): void {
  const rootFolder: Folder = new Folder(rootPath);
  let filesFolder: Folder = new Folder(`${rootPath}/150ppi`);
  let files: Array<File | Folder>;
  
  files = filesFolder.getFiles("");

  for (let i = files.length; i>0 ;i--) {
    let file: File | Folder = files.pop();
    if (file.exists) {
      file.copy(`${rootFolder}/${file.displayName}`);
      file.remove();
    }
  }
  filesFolder.remove();
}

function correctFileNames(rootPath: string): void {
  const rootFolder: Folder = new Folder(`${rootPath}/150ppi`);
  let files: Array<File | Folder>;
  
  files = rootFolder.getFiles("");
  
  for (let i = 0; i<files.length; i++) {
    let file: File | Folder = files[i];
    if (file.exists) {
      let newName = `${file.displayName.split("!@#$").shift()}-${i>9 ? "" : "0"}${i}.jpg`;
      file.rename(newName);
    }
  }
}

function main(): void {
  const activeDocument: Document = getActiveDocument(app);
  let destPath: string = getDestinationPath(activeDocument.path.absoluteURI);

  createImages(activeDocument, destPath, activeDocument.fullName.displayName);
  correctFileNames(destPath);
  moveFilesToParentFolder(destPath);
  displayMessage("Files saved");
}

main();