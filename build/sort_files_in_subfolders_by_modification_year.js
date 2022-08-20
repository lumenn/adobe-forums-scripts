var ROOT_FOLDER_PATH = 'C:/Users/maksymilian.stachowi/Downloads/test/';
var rootFolder = new Folder(ROOT_FOLDER_PATH);
var files = rootFolder.getFiles('');
for (var i = files.length; i >= 0; i -= 1) {
    var element = files[i];
    if (element instanceof File) {
        var year = element.modified.getFullYear();
        $.writeln("".concat(i, " of ").concat(files.length, " remaining, current file ").concat(element.displayName));
        if (!Folder("".concat(ROOT_FOLDER_PATH).concat(year)).exists) {
            var yearFolder = new Folder("".concat(ROOT_FOLDER_PATH).concat(year));
            yearFolder.create();
            $.writeln("Created: ".concat(yearFolder.path));
        }
        element.copy("".concat(ROOT_FOLDER_PATH).concat(year, "/").concat(element.displayName));
        element.remove();
    }
}
