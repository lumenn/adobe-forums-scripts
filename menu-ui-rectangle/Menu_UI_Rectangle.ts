/**
 * Prompts user to fill up dialog defining width, and height of the rectangle
 */

function showRectangleCreationPanel(): Array<number> {
  let x: number = 0;
  let y: number = 0;
  let unit: string;
  const units: Array<string> = ['pt', 'in', 'mm', 'cm', 'px'];
  const heightNames: Array<string> = ['A', 'B', 'C'];
  const heights: object = {
    A: 50,
    B: 70,
    C: 90
  };

  let rectanglePanel: Window = new Window("dialog", "Fill fill rectangle data", undefined, {borderless: true});

  let widthTextField: EditText = rectanglePanel.add("edittext");
  widthTextField.characters = 4;

  let unitDropDown: DropDownList = rectanglePanel.add("dropdownlist", undefined, units);
  unitDropDown.selection = unitDropDown.items[0];

  let heightDropDown: DropDownList = rectanglePanel.add("dropdownlist", undefined, heightNames);
  heightDropDown.selection = heightDropDown.items[0];

  rectanglePanel.add("button", undefined, "OK");
  rectanglePanel.add("button", undefined, "Cancel");

  rectanglePanel.show();

  unit = unitDropDown.selection.text;
  x = Number(new UnitValue(`${widthTextField.text} ${unit}`).as('pt'));
  y = Number(new UnitValue(`${heights[heightDropDown.selection.text]} ${unit}`).as('pt'));

  return [x, y]
}

/**
 * Draws rectangle on center of screen
 * @param [] Array containing width and height of the rectangle
 */

function createRectangle([x,y]: Array<number>): PathItem {
  let rectangle: PathItem;
  let document: Document = app.activeDocument;
  let top: number = document.activeView.centerPoint[1];
  let left: number = document.activeView.centerPoint[0];
  let height: number = y;
  let width: number = x;


  rectangle = document.activeLayer.pathItems.rectangle(top + height/2, left - width/2, width, height);
  
  return rectangle; 
}

let rectangleSize: Array<number> = showRectangleCreationPanel();
createRectangle(rectangleSize);
