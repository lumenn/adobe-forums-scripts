function displayMessage(text) {
    var messageWindow = new Window('dialog', undefined, undefined, {
        borderless: true
    });
    messageWindow.add('statictext', undefined, text);
    messageWindow.add('button', undefined, 'OK');
    messageWindow.show();
}
function getActiveDocument(app) {
    var result;
    if (app.documents.length < 0) {
        displayMessage('There are no opened documents');
        result = null;
    }
    else {
        result = app.activeDocument;
    }
    return result;
}
function getDestinationPath(pathToDocument) {
    var name = pathToDocument.split('/').pop();
    var newPath = "".concat(pathToDocument.slice(0, -name.length), "_media");
    var checkFolder = new Folder("".concat(newPath, "/"));
    if (!checkFolder.exists) {
        checkFolder.create();
    }
    return newPath;
}
function createImages(document, destPath, filename) {
    var options = new ExportForScreensOptionsJPEG();
    options.compressionMethod = JPEGCompressionMethodType.BASELINESTANDARD;
    options.embedICCProfile = false;
    options.antiAliasing = AntiAliasingMethod.TYPEOPTIMIZED;
    options.scaleType = ExportForScreensScaleType.SCALEBYRESOLUTION;
    options.scaleTypeValue = 150;
    var prefix = "".concat(filename.split('.').shift(), "!@#$");
    var outputFile = new File("".concat(destPath, "/").concat(filename));
    document.exportForScreens(outputFile, ExportForScreensType.SE_JPEG100, options, undefined, prefix);
}
function moveFilesToParentFolder(rootPath) {
    var rootFolder = new Folder(rootPath);
    var filesFolder = new Folder("".concat(rootPath, "/150ppi"));
    var files = filesFolder.getFiles('');
    for (var i = files.length; i > 0; i -= 1) {
        if (typeof files.pop() === 'File') {
            var file = files.pop();
            if (file.exists) {
                file.copy("".concat(rootFolder, "/").concat(file.displayName));
                file.remove();
            }
        }
    }
    filesFolder.remove();
}
function correctFileNames(rootPath) {
    var rootFolder = new Folder("".concat(rootPath, "/150ppi"));
    var files = rootFolder.getFiles('');
    for (var i = 0; i < files.length; i += 1) {
        var file = files[i];
        if (file.exists) {
            var newName = "".concat(file.displayName.split('!@#$').shift(), "-").concat(i > 9 ? '' : '0').concat(i, ".jpg");
            file.rename(newName);
        }
    }
}
function main() {
    var activeDocument = getActiveDocument(app);
    var destPath = getDestinationPath(activeDocument.path.absoluteURI);
    createImages(activeDocument, destPath, activeDocument.fullName.displayName);
    correctFileNames(destPath);
    moveFilesToParentFolder(destPath);
    displayMessage('Files saved');
}
main();
