var SELECT_DIALOG_FOLDER_START_PATH = 'C:\\Maks-Pliki\\Skrypty\\Kod\\Illustrator\\adobe-forums\\batch_detect_overprints\\Files';
function displayMessage(text) {
    var messageWindow = new Window('dialog', undefined, undefined, {
        borderless: true
    });
    messageWindow.add('statictext', undefined, text);
    messageWindow.add('button', undefined, 'OK');
    messageWindow.show();
}
function isArrayOfFiles(items) {
    var folderCounter = 0;
    for (var i = 0; i < items.length; i += 1) {
        var item = items[i];
        if (item instanceof Folder) {
            folderCounter += 1;
        }
    }
    if (folderCounter !== 0) {
        return null;
    }
    return items !== undefined;
}
function getFolderURI() {
    var tempFolder = new Folder(SELECT_DIALOG_FOLDER_START_PATH);
    var folderURI;
    try {
        folderURI = tempFolder.selectDlg('Choose folder with .ai files').absoluteURI;
    }
    catch (error) {
        folderURI = null;
    }
    return folderURI;
}
function filterArrayForFiles(array) {
    var newArray = [];
    for (var i = 0; i < array.length; i += 1) {
        var element = array[i];
        if (element instanceof File) {
            newArray.push(element);
        }
    }
    return newArray;
}
function getFiles(folderURI) {
    var folder = new Folder(folderURI);
    var files = folder.getFiles('*.ai');
    if (isArrayOfFiles(files)) {
        return files;
    }
    return filterArrayForFiles(files);
}
function findStringInArray(text, arr) {
    if (arr.length !== 0) {
        for (var i = 0; i < arr.length; i += 1) {
            var currentString = arr[i];
            if (currentString === text) {
                return true;
            }
        }
    }
    return false;
}
function checkDocumentForOverprints(doc) {
    var paths = doc.pathItems;
    var texts = doc.textFrames;
    var rasters = doc.rasterItems;
    var layerNamesWithOverprintedItems = [];
    for (var i = 0; i < rasters.length; i += 1) {
        var raster = rasters[i];
        if (raster.overprint) {
            if (!findStringInArray(raster.layer.name, layerNamesWithOverprintedItems)) {
                layerNamesWithOverprintedItems.push(raster.layer.name);
            }
        }
    }
    for (var i = 0; i < paths.length; i += 1) {
        var path = paths[i];
        if (path.fillOverprint || path.strokeOverprint) {
            if (!findStringInArray(path.layer.name, layerNamesWithOverprintedItems)) {
                layerNamesWithOverprintedItems.push(path.layer.name);
            }
        }
    }
    for (var i = 0; i < texts.length; i += 1) {
        var text = texts[i];
        if (!findStringInArray(text.layer.name, layerNamesWithOverprintedItems)) {
            var characters = text.characters;
            for (var c = 1; c < characters.length; c += 1) {
                var character = characters[c];
                if (character.overprintFill || character.overprintStroke) {
                    if (!findStringInArray(text.layer.name, layerNamesWithOverprintedItems)) {
                        layerNamesWithOverprintedItems.push(text.layer.name);
                    }
                    else {
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
function processFiles(files) {
    var data = {};
    var progressWindow = new Window('palette', 'Processing files');
    var progressBar = progressWindow.add('progressbar', undefined, 0, files.length);
    progressBar.preferredSize = [300, undefined];
    progressWindow.show();
    for (var i = 0; i < files.length; i += 1) {
        progressBar.value = i + 1;
        var currentDocument = app.open(files[i]);
        var layerNames = checkDocumentForOverprints(currentDocument);
        if (layerNames) {
            data["".concat(currentDocument.name)] = {
                overprint: true,
                layers: layerNames
            };
        }
        else {
            data["".concat(currentDocument.name)] = {
                overprint: false,
                layers: undefined
            };
        }
        currentDocument.close(SaveOptions.DONOTSAVECHANGES);
    }
    progressWindow.close();
    return data;
}
function createLog(data, files, destinationFolderURI) {
    var logFile = new File("".concat(destinationFolderURI, "/log.txt"));
    logFile.encoding = 'UTF-8';
    logFile.open('w');
    for (var i = 0; i < files.length; i += 1) {
        var fileName = files[i].displayName;
        logFile.writeln("Overprints: ".concat(data[fileName].overprint ? 'YES' : 'NO\t', " \t ").concat(fileName));
        if (data[fileName].overprint) {
            var layerNames = data[fileName].layers;
            var layers = '\t Layers with overprints: ';
            for (var j = 0; j < layerNames.length; j += 1) {
                layers = "".concat(layers, " ").concat(layerNames[j], ",");
            }
            logFile.writeln("".concat(layers, "\n"));
        }
    }
    logFile.close();
    return logFile;
}
function main() {
    app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;
    var folderURI = getFolderURI();
    if (folderURI) {
        var filesToCheck = getFiles(folderURI);
        var result = processFiles(filesToCheck);
        createLog(result, filesToCheck, folderURI);
        displayMessage('Log file created');
    }
    else {
        displayMessage('File was not chosen, aborting script');
    }
}
main();
