// Variables to adjust the script:
const SELECT_DIALOG_FOLDER_START_PATH: string = 'C:\\Maks-Pliki\\Skrypty\\Kod\\Illustrator\\adobe-forums\\batch_detect_overprints\\Files';

function isArrayOfFiles(item: (File | Folder)[]): item is File[] {
  displayMessage(item.type);
}

function displayMessage(text: string): void {
  const messageWindow = new Window('dialog', undefined, undefined, {
    borderless: true,
  });
  messageWindow.add('statictext', undefined, text);
  messageWindow.add('button', undefined, 'OK');
  messageWindow.show();
}

function getFolderURI(): string {
  const tempFolder = new Folder(SELECT_DIALOG_FOLDER_START_PATH);
  let folderURI: string;

  try {
    folderURI = tempFolder.selectDlg('Choose folder with .ai files').absoluteURI;
  } catch (error) {
    folderURI = null;
  }

  return folderURI;
}

function processFiles(files: File[]): void {

}

function getFiles(folderURI: string): File[] {
  const folder: Folder = new Folder(folderURI);
  const files: (File | Folder)[] = folder.getFiles();

  if (isArrayOfFiles(files)) {
    for (let i = 0; i < files.length; i = i + 1) {
      const file: File = files[i];
      displayMessage(file.name);
    }
    return files;
  }
}

function main(): void {
  const folderURI: string = getFolderURI();

  if (folderURI) {
    displayMessage('Works');
    getFiles(folderURI);
  } else {
    displayMessage('File was not chosen, aborting script');
  }
}

main();
