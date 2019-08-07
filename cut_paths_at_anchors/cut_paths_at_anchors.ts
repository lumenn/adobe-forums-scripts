const document: Document = app.activeDocument;
const scriptLayerName: string = 'Center-Script';

function isPathItem(item : PageItem): item is PathItem {
  if (item.typename === 'PathItem') {
    return item as PathItem !== undefined;
  }

  return undefined;
}
function isGroupItem(item : PageItem): item is GroupItem {
  if (item.typename === 'GroupItem') {
    return item as GroupItem !== undefined;
  }

  return undefined;
}
function isCompoundPathItem(item : PageItem): item is CompoundPathItem {
  if (item.typename === 'CompoundPathItem') {
    return item as CompoundPathItem !== undefined;
  }

  return undefined;
}

function createScriptLayer() {
  let scriptLayer: Layer;
  try {
    scriptLayer = document.layers.getByName(scriptLayerName);
  } catch (error) {
    scriptLayer = document.layers.add();
    scriptLayer.name = scriptLayerName;
  }
}

function copyPathPoint(
  { anchor, leftDirection, rightDirection }: PathPoint, newPath: PathItem,
): PathPoint {
  const newPoint = newPath.pathPoints.add();
  newPoint.anchor = anchor;
  newPoint.leftDirection = leftDirection;
  newPoint.rightDirection = rightDirection;
  return newPoint;
}

function cutPathOnAnchorPoints(item: PathItem) {
  const { pathPoints }: PathItem = item;
  for (let i = 0; i < pathPoints.length; i += 1) {
    const newPath: PathItem = document.layers.getByName(scriptLayerName).pathItems.add();
    let pathPoint = pathPoints[i];
    copyPathPoint(pathPoint, newPath);

    if (i !== pathPoints.length - 1) {
      pathPoint = pathPoints[i + 1];
      copyPathPoint(pathPoint, newPath);
    } else if (item.closed === true) {
      [pathPoint] = pathPoints;
      copyPathPoint(pathPoint, newPath);
    }
  }
}

function getTDPaths(pathsToCheck: PageItems) {
  for (let i = 0; i < pathsToCheck.length; i += 1) {
    const currentPageItem: PageItem = pathsToCheck[i];
    if (isPathItem(currentPageItem)) {
      cutPathOnAnchorPoints(currentPageItem);
    }

    if (isCompoundPathItem(currentPageItem)) {
      getTDPaths(currentPageItem.pathItems);
    }

    if (isGroupItem(currentPageItem)) {
      getTDPaths(currentPageItem.pageItems);
    }
  }
}


createScriptLayer();

getTDPaths(document.layers.getByName('Siatka').pageItems);
