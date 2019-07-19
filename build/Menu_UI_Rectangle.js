function showRectangleCreationPanel() {
    var x = 0;
    var y = 0;
    var unit;
    var units = ['pt', 'in', 'mm', 'cm', 'px'];
    var heightNames = ['A', 'B', 'C'];
    var heights = {
        A: 50,
        B: 70,
        C: 90
    };
    var rectanglePanel = new Window("dialog", "Fill fill rectangle data", undefined, { borderless: true });
    var widthTextField = rectanglePanel.add("edittext");
    widthTextField.characters = 4;
    var unitDropDown = rectanglePanel.add("dropdownlist", undefined, units);
    unitDropDown.selection = unitDropDown.items[0];
    var heightDropDown = rectanglePanel.add("dropdownlist", undefined, heightNames);
    heightDropDown.selection = heightDropDown.items[0];
    rectanglePanel.add("button", undefined, "OK");
    rectanglePanel.add("button", undefined, "Cancel");
    rectanglePanel.show();
    unit = unitDropDown.selection.text;
    x = Number(new UnitValue(widthTextField.text + " " + unit).as('pt'));
    y = Number(new UnitValue(heights[heightDropDown.selection.text] + " " + unit).as('pt'));
    return [x, y];
}
function createRectangle(_a) {
    var x = _a[0], y = _a[1];
    var rectangle;
    var document = app.activeDocument;
    var top = document.activeView.centerPoint[1];
    var left = document.activeView.centerPoint[0];
    var height = y;
    var width = x;
    rectangle = document.activeLayer.pathItems.rectangle(top + height / 2, left - width / 2, width, height);
    return rectangle;
}
var rectangleSize = showRectangleCreationPanel();
createRectangle(rectangleSize);
