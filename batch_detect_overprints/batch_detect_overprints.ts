// Variables to adjust the script:
const SELECT_DIALOG_FOLDER_START_PATH: string = 'C:\\Maks-Pliki\\Skrypty\\Kod\\Illustrator\\adobe-forums\\batch_detect_overprints\\Files';

/**
 * Displays message to the user
 * @param text Text to display
 */

function displayMessage(text: string): void {
  const messageWindow = new Window('dialog', undefined, undefined, {
    borderless: true,
  });
  messageWindow.add('statictext', undefined, text);
  messageWindow.add('button', undefined, 'OK');
  messageWindow.show();
}

/**
 * Check if array contains only Files
 * @param items Array to check
 */

function isArrayOfFiles(items: (File | Folder)[]): items is File[] {
  let folderCounter: number = 0;

  for (let i = 0; i < items.length; i += 1) {
    const item: File|Folder = items[i];
    if (item instanceof Folder) {
      folderCounter += 1;
    }
  }

  if (folderCounter !== 0) {
    return null;
  }

  return items as File[] !== undefined;
}

/**
 * Returns URI for folder chosed in select dialog
 */

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

/**
 * Removes folders from array
 * @param array Array of to filter
 */

function filterArrayForFiles(array: (File | Folder)[]): File[] {
  const newArray: File[] = [];

  for (let i = 0; i < array.length; i += 1) {
    const element: File | Folder = array[i];

    if (element instanceof File) {
      newArray.push(element);
    }
  }
  return newArray;
}

/**
 * Gets files from specified folder
 * @param folderURI Uri adress for folder containing files;
 */

function getFiles(folderURI: string): File[] {
  const folder: Folder = new Folder(folderURI);
  const files: (File | Folder)[] = folder.getFiles('*.ai');

  if (isArrayOfFiles(files)) {
    return files;
  }
  return filterArrayForFiles(files);
}

function main(): void {
  const folderURI: string = getFolderURI();

  if (folderURI) {
    displayMessage('Works');
    const filesToCheck: File[] = getFiles(folderURI);
    displayMessage(filesToCheck.length);
  } else {
    displayMessage('File was not chosen, aborting script');
  }
}

main();
