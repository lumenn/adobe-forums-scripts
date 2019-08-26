function getDataFile(): File {
  let chosedFile: File = new File();

  chosedFile = chosedFile.openDlg('Chose text file, to read paths', '*.txt', false);
  if (chosedFile.exists) {
    return chosedFile;
  }

  return undefined;
}

function readPaths(fileToRead: File): string[] {
  const paths: string[] = [];
  fileToRead.open('read');
  while (!fileToRead.eof) {
    const textLine: string = fileToRead.readln();
    paths.push(textLine);
  }

  fileToRead.close();
  return paths;
}

function replaceLinks(documentWithLinks: Document, newLinkFile: File): void {
  for (let i = 0; i < documentWithLinks.placedItems.length; i += 1) {
    const item: PlacedItem = documentWithLinks.placedItems[i];

    if (item.locked) {
      item.locked = false;
    }
    if (newLinkFile.exists) {
      item.relink(newLinkFile);
    }
  }
}

function saveFile(documentToSave: Document, pathToSave: string, fileName: string): File {
  const fileToSave: File = new File(pathToSave + fileName);
  documentToSave.saveAs(fileToSave);
  return fileToSave;
}

function main():void {
  const paths: string[] = readPaths(getDataFile());
  const document: Document = app.activeDocument;
  const savePath: string = 'C:\\Maks-Pliki\\Skrypty\\Kod\\Illustrator\\adobe-forums\\relink_files_txt_file_paths\\Files\\Merged With Spaces\\';

  for (let i = 0; i < paths.length; i += 1) {
    const path = paths[i];
    const textToChange: TextFrameItem = document.textFrames[0];
    const newLink: File = File(path);
    const fileName: string = path.split('\\').pop();
    replaceLinks(document, newLink);
    textToChange.contents = path.split('\\').pop().split('.').shift();
    saveFile(document, savePath, fileName);
  }
}

main();
