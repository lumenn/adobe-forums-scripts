function showRectangleCreationPanel() {
    var x = 0;
    var y = 0;
    var units = ['pt', 'in', 'mm', 'cm', 'px'];
    var heightNames = ['A', 'B', 'C'];
    var heights = {
        A: 50,
        B: 70,
        C: 90
    };
    var rectanglePanel = new Window('dialog', 'Fill fill rectangle data', undefined, { borderless: true });
    var widthGroup = rectanglePanel.add('group', undefined);
    widthGroup.orientation = 'row';
    var widthTextField = widthGroup.add('edittext');
    widthTextField.characters = 4;
    var unitDropDown = widthGroup.add('dropdownlist', undefined, units);
    unitDropDown.selection = unitDropDown.items[0];
    var heightDropDown = rectanglePanel.add('dropdownlist', undefined, heightNames);
    heightDropDown.selection = heightDropDown.items[0];
    rectanglePanel.add('button', undefined, 'OK');
    rectanglePanel.add('button', undefined, 'Cancel');
    rectanglePanel.show();
    var unit = unitDropDown.selection.text;
    x = Number(new UnitValue("".concat(widthTextField.text, " ").concat(unit)).as('pt'));
    y = Number(new UnitValue("".concat(heights[heightDropDown.selection.text], " ").concat(unit)).as('pt'));
    return [x, y];
}
function createRectangle(_a) {
    var x = _a[0], y = _a[1];
    var document = app.activeDocument;
    var top = document.activeView.centerPoint[1];
    var left = document.activeView.centerPoint[0];
    var height = y;
    var width = x;
    var rectangle = (document.activeLayer.pathItems.rectangle(top + height / 2, left - width / 2, width, height));
    return rectangle;
}
var rectangleSize = showRectangleCreationPanel();
createRectangle(rectangleSize);
