function selectPageItemsByName(items, name) {
    for (var i = 0; i < items.length; i += 1) {
        var item = items[i];
        if (item.name === name) {
            item.selected = true;
        }
    }
}
function main() {
    var document = app.activeDocument;
    var name = 'Top Eyelet';
    document.selection = null;
    selectPageItemsByName(document.pageItems, name);
}
main();
