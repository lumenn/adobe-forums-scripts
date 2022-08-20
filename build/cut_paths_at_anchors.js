var document = app.activeDocument;
var scriptLayerName = 'Center-Script';
function isPathItem(item) {
    if (item.typename === 'PathItem') {
        return item !== undefined;
    }
    return undefined;
}
function isGroupItem(item) {
    if (item.typename === 'GroupItem') {
        return item !== undefined;
    }
    return undefined;
}
function isCompoundPathItem(item) {
    if (item.typename === 'CompoundPathItem') {
        return item !== undefined;
    }
    return undefined;
}
function createScriptLayer() {
    var scriptLayer;
    try {
        scriptLayer = document.layers.getByName(scriptLayerName);
    }
    catch (error) {
        scriptLayer = document.layers.add();
        scriptLayer.name = scriptLayerName;
    }
}
function copyPathPoint(_a, newPath) {
    var anchor = _a.anchor, leftDirection = _a.leftDirection, rightDirection = _a.rightDirection;
    var newPoint = newPath.pathPoints.add();
    newPoint.anchor = anchor;
    newPoint.leftDirection = leftDirection;
    newPoint.rightDirection = rightDirection;
    return newPoint;
}
function cutPathOnAnchorPoints(item) {
    var pathPoints = item.pathPoints;
    for (var i = 0; i < pathPoints.length; i += 1) {
        var newPath = document.layers.getByName(scriptLayerName).pathItems.add();
        var pathPoint = pathPoints[i];
        copyPathPoint(pathPoint, newPath);
        if (i !== pathPoints.length - 1) {
            pathPoint = pathPoints[i + 1];
            copyPathPoint(pathPoint, newPath);
        }
        else if (item.closed === true) {
            pathPoint = pathPoints[0];
            copyPathPoint(pathPoint, newPath);
        }
    }
}
function getTDPaths(pathsToCheck) {
    for (var i = 0; i < pathsToCheck.length; i += 1) {
        var currentPageItem = pathsToCheck[i];
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
