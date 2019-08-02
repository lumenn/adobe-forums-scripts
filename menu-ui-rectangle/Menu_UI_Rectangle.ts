/**
 * Prompts user to fill up dialog defining width, and height of the rectangle
 */

function showRectangleCreationPanel(): number[] {
  let x: number = 0;
  let y: number = 0;
  const units: Array<string> = ['pt', 'in', 'mm', 'cm', 'px'];
  const heightNames: Array<string> = ['A', 'B', 'C'];
  const heights: object = {
    A: 50,
    B: 70,
    C: 90,
  };

  const rectanglePanel: Window = new Window('dialog', 'Fill fill rectangle data', undefined, { borderless: true });

  const widthGroup: Group = rectanglePanel.add('group', undefined);
  widthGroup.orientation = 'row';

  const widthTextField: EditText = widthGroup.add('edittext');
  widthTextField.characters = 4;

  const unitDropDown: DropDownList = widthGroup.add('dropdownlist', undefined, units);
  [unitDropDown.selection] = unitDropDown.items;

  const heightDropDown: DropDownList = rectanglePanel.add('dropdownlist', undefined, heightNames);
  [heightDropDown.selection] = heightDropDown.items;

  rectanglePanel.add('button', undefined, 'OK');
  rectanglePanel.add('button', undefined, 'Cancel');

  rectanglePanel.show();

  const unit: string = unitDropDown.selection.text;
  x = Number(new UnitValue(`${widthTextField.text} ${unit}`).as('pt'));
  y = Number(new UnitValue(`${heights[heightDropDown.selection.text]} ${unit}`).as('pt'));

  return [x, y];
}

/**
 * Draws rectangle on center of screen
 * @param [] Array containing width and height of the rectangle
 */

function createRectangle([x, y]: number[]): PathItem {
  const document: Document = app.activeDocument;
  const top: number = document.activeView.centerPoint[1];
  const left: number = document.activeView.centerPoint[0];
  const height: number = y;
  const width: number = x;


  const rectangle: PathItem = (
    document.activeLayer.pathItems.rectangle(top + height / 2, left - width / 2, width, height)
  );

  return rectangle;
}

const rectangleSize: number[] = showRectangleCreationPanel();
createRectangle(rectangleSize);
