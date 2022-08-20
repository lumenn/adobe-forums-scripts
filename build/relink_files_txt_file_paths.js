function getDataFile() {
    var chosedFile = new File();
    chosedFile = chosedFile.openDlg('Chose text file, to read paths', '*.txt', false);
    if (chosedFile.exists) {
        return chosedFile;
    }
    return undefined;
}
function readPaths(fileToRead) {
    var paths = [];
    fileToRead.open('read');
    while (!fileToRead.eof) {
        var textLine = fileToRead.readln();
        paths.push(textLine);
    }
    fileToRead.close();
    return paths;
}
function replaceLinks(documentWithLinks, newLinkFile) {
    for (var i = 0; i < documentWithLinks.placedItems.length; i += 1) {
        var item = documentWithLinks.placedItems[i];
        if (item.locked) {
            item.locked = false;
        }
        if (newLinkFile.exists) {
            item.relink(newLinkFile);
        }
    }
}
function saveFile(documentToSave, pathToSave, fileName) {
    var fileToSave = new File(pathToSave + fileName);
    documentToSave.saveAs(fileToSave);
    return fileToSave;
}
function main() {
    var paths = readPaths(getDataFile());
    var document = app.activeDocument;
    var savePath = 'C:\\Maks-Pliki\\Skrypty\\Kod\\Illustrator\\adobe-forums\\relink_files_txt_file_paths\\Files\\Merged With Spaces\\';
    for (var i = 0; i < paths.length; i += 1) {
        var path = paths[i];
        var textToChange = document.textFrames[0];
        var newLink = File(path);
        var fileName = path.split('\\').pop();
        replaceLinks(document, newLink);
        textToChange.contents = path.split('\\').pop().split('.').shift();
        saveFile(document, savePath, fileName);
    }
}
main();
