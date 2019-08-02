function displayMessage(text: string): void {
  const messageWindow = new Window('dialog', undefined, undefined, {
    borderless: true,
  });
  messageWindow.add('statictext', undefined, text);
  messageWindow.add('button', undefined, 'OK');
  messageWindow.show();
}

function getActiveDocument(app: Application): Document {
  let result: Document;

  if (app.documents.length < 0) {
    displayMessage('There are no opened documents');
    result = null;
  } else {
    result = app.activeDocument;
  }

  return result;
}

function getDestinationPath(pathToDocument: string): string {
  const name: string = pathToDocument.split('/').pop();
  const newPath: string = `${pathToDocument.slice(0, -name.length)}_media`;

  const checkFolder: Folder = new Folder(`${newPath}/`);

  if (!checkFolder.exists) {
    checkFolder.create();
  }

  return newPath;
}


function createImages(document: Document, destPath: string, filename: string): void {
  const options: ExportForScreensOptionsJPEG = new ExportForScreensOptionsJPEG();
  options.compressionMethod = JPEGCompressionMethodType.BASELINESTANDARD;
  options.embedICCProfile = false;
  options.antiAliasing = AntiAliasingMethod.TYPEOPTIMIZED;
  options.scaleType = ExportForScreensScaleType.SCALEBYRESOLUTION;
  options.scaleTypeValue = 150;

  const prefix: string = `${filename.split('.').shift()}!@#$`;

  const outputFile: File = new File(`${destPath}/${filename}`);

  document.exportForScreens(
    outputFile, ExportForScreensType.SE_JPEG100, options, undefined, prefix,
  );
}

function moveFilesToParentFolder(rootPath: string): void {
  const rootFolder: Folder = new Folder(rootPath);
  const filesFolder: Folder = new Folder(`${rootPath}/150ppi`);
  const files: Array<File | Folder> = filesFolder.getFiles('');

  for (let i = files.length; i > 0; i -= 1) {
    if (files.pop() instanceof File) {
      const file: File = files.pop();
      if (file.exists) {
        file.copy(`${rootFolder}/${file.displayName}`);
        file.remove();
      }
    }
  }
  filesFolder.remove();
}

function correctFileNames(rootPath: string): void {
  const rootFolder: Folder = new Folder(`${rootPath}/150ppi`);
  const files: Array<File | Folder> = rootFolder.getFiles('');

  for (let i = 0; i < files.length; i += 1) {
    const file: File | Folder = files[i];
    if (file.exists) {
      const newName = `${file.displayName.split('!@#$').shift()}-${i > 9 ? '' : '0'}${i}.jpg`;
      file.rename(newName);
    }
  }
}

function main(): void {
  const activeDocument: Document = getActiveDocument(app);
  const destPath: string = getDestinationPath(activeDocument.path.absoluteURI);

  createImages(activeDocument, destPath, activeDocument.fullName.displayName);
  correctFileNames(destPath);
  moveFilesToParentFolder(destPath);
  displayMessage('Files saved');
}

main();
