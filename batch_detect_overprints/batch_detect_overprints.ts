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

/**
 * Searches for given text in array of texts
 * @param text Text to search for in array
 * @param arr Array with texts
 */

function findStringInArray(text: string, arr: string[]) {
  if (arr.length !== 0) {
    for (let i = 0; i < arr.length; i += 1) {
      const currentString: string = arr[i];
      if (currentString === text) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Returns true if there are overprints in document, false if there aren't
 * @param doc Document to search for overprints
 */

function checkDocumentForOverprints(doc: Document): string[] {
  const paths: PathItems = doc.pathItems;
  const texts: TextFrameItems = doc.textFrames;
  const rasters: RasterItems = doc.rasterItems;
  const layerNamesWithOverprintedItems: string[] = [];

  for (let i = 0; i < rasters.length; i += 1) {
    const raster: RasterItem = rasters[i];
    if (raster.overprint) {
      if (!findStringInArray(raster.layer.name, layerNamesWithOverprintedItems)) {
        layerNamesWithOverprintedItems.push(raster.layer.name);
      }
    }
  }

  for (let i = 0; i < paths.length; i += 1) {
    const path: PathItem = paths[i];
    if (path.fillOverprint || path.strokeOverprint) {
      if (!findStringInArray(path.layer.name, layerNamesWithOverprintedItems)) {
        layerNamesWithOverprintedItems.push(path.layer.name);
      }
    }
  }

  for (let i = 0; i < texts.length; i += 1) {
    const text: TextFrameItem = texts[i];

    if (!findStringInArray(text.layer.name, layerNamesWithOverprintedItems)) {
      const { characters }: TextFrameItem = text;

      for (let c = 1; c < characters.length; c += 1) {
        const character = characters[c];

        if (character.overprintFill || character.overprintStroke) {
          if (!findStringInArray(text.layer.name, layerNamesWithOverprintedItems)) {
            layerNamesWithOverprintedItems.push(text.layer.name);
          } else {
            break;
          }
        }
      }
    }
  }
  if (layerNamesWithOverprintedItems.length > 0) {
    return layerNamesWithOverprintedItems;
  }
  return undefined;
}

/**
 * Loops through all files, opens them, and run a check overprint function
 * @param files Files to check
 */

function processFiles(files: File[]): object {
  const data: object = {};

  const progressWindow: Window = new Window('palette', 'Processing files');
  const progressBar: Progressbar = progressWindow.add('progressbar', undefined, 0, files.length);
  progressBar.preferredSize = [300, undefined];
  progressWindow.show();

  for (let i = 0; i < files.length; i += 1) {
    progressBar.value = i + 1;
    const currentDocument: Document = app.open(files[i]);
    const layerNames: string[] = checkDocumentForOverprints(currentDocument);
    if (layerNames) {
      data[`${currentDocument.name}`] = {
        overprint: true,
        layers: layerNames,
      };
    } else {
      data[`${currentDocument.name}`] = {
        overprint: false,
        layers: undefined,
      };
    }
    currentDocument.close(SaveOptions.DONOTSAVECHANGES);
  }
  progressWindow.close();
  return data;
}

/**
 * Creates a log file.
 * @param data Object with properties to save
 * @param files Files, which names ar e keys in data object
 * @param destinationFolderURI Folder, where te .log File should be saved
 */

function createLog(data: object, files: File[], destinationFolderURI: string): File {
  const logFile: File = new File(`${destinationFolderURI}/log.txt`);

  logFile.encoding = 'UTF-8';
  logFile.open('w');

  for (let i = 0; i < files.length; i += 1) {
    const fileName: string = files[i].displayName;
    logFile.writeln(`Overprints: ${data[fileName].overprint ? 'YES' : 'NO\t'} \t ${fileName}`);

    if (data[fileName].overprint) {
      const layerNames: string[] = data[fileName].layers;
      let layers: string = '\t Layers with overprints: ';

      for (let j = 0; j < layerNames.length; j += 1) {
        layers = `${layers} ${layerNames[j]},`;
      }

      logFile.writeln(`${layers}\n`);
    }
  }
  logFile.close();

  return logFile;
}

/**
 * Main function, which controls the script flow
 */
function main(): void {
  app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;
  const folderURI: string = getFolderURI();

  if (folderURI) {
    const filesToCheck: File[] = getFiles(folderURI);
    const result: object = processFiles(filesToCheck);
    createLog(result, filesToCheck, folderURI);
    displayMessage('Log file created');
  } else {
    displayMessage('File was not chosen, aborting script');
  }
}

main();
