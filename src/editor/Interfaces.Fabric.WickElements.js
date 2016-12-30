/* Wick - (c) 2016 Zach Rispoli, Luca Damasco, and Josh Rispoli */

var FabricWickElements = function (wickEditor, fabricInterface) {

	var that = this;

    var objectsInCanvas = [];

    this.update = function () {
        var enablePerfTests = false;

        if(enablePerfTests) console.log("-------------------");
        if(enablePerfTests) startTiming();
        if(enablePerfTests) stopTiming("init");

        var currentObject = wickEditor.project.currentObject;
        var currentFrame = currentObject.getCurrentFrame();

        // Make sure everything is deselected, mulitple selected objects cause positioning problems.
        var selectedObjects = fabricInterface.getSelectedObjects(WickObject);
        if(selectedObjects.length > 1) fabricInterface.deselectAll(true);

        var activeObjects = currentObject.getAllActiveChildObjects();
        var siblingObjects = currentObject.getAllInactiveSiblings();
        var allPaths = wickEditor.paper.getAllSVGs();
        var allObjects = allPaths.concat(siblingObjects.concat(activeObjects));

        var refreshZIndices = function (force) {
            var frameZIndex = siblingObjects.length

            // Update z-indices in order of their true positions
            allObjects.forEach(function(wickObj) {
                var fabricObj = wickObj.fabricObjectReference;

                if(wickObj.zIndicesDirty || force) {
                    var fabricZIndex = fabricInterface.canvas._objects.indexOf(fabricObj);
                    if(fabricZIndex === -1) return;
                    if(fabricZIndex > frameZIndex) fabricZIndex -= 1;
                    var trueZIndex = allObjects.indexOf(wickObj) + fabricInterface.guiElements.getNumGUIElements();

                    fabricInterface.canvas.moveTo(fabricObj, trueZIndex);
                    wickObj.zIndicesDirty = false;
                }
            });

            if (force || fabricInterface.canvas._objects.indexOf(fabricInterface.guiElements.getInactiveFrame()) !== frameZIndex) {
                fabricInterface.guiElements.setInactiveFramePosition(frameZIndex);
            }
        }

        if(enablePerfTests) stopTiming("object list generation");

        // Remove objects that don't exist anymore or need to be regenerated
        var removeTheseObjs = [];
        fabricInterface.canvas._objects.forEach(function(fabricObj) {
            if(!fabricObj || !fabricObj.wickObjectRef) return;

            var wickObj = fabricObj.wickObjectRef;

            if(allObjects.indexOf(fabricObj.wickObjectRef) == -1 || (wickObj && wickObj.forceFabricCanvasRegen) || (wickObj && wickObj.imageDirty)) {
                if(wickObj) {
                    wickObj.imageDirty = false;
                    wickObj.forceFabricCanvasRegen = false;
                    wickObj.cachedFabricObject = null;
                }
                objectsInCanvas.splice(objectsInCanvas.indexOf(fabricObj.wickObjectRef), 1);
                // Object doesn't exist in the current object anymore, remove it's fabric object.
                removeTheseObjs.push(fabricObj);
            }
        });
        removeTheseObjs.forEach(function (fabricObj) {
            if(fabricObj.type === "group") {
                fabricObj.forEachObject(function(o){ fabricObj.removeWithUpdate(o) });
                fabricInterface.canvas.remove(fabricObj);
                fabricInterface.canvas.renderAll();
            } else {
                fabricObj.remove();
            }
        });

        if(enablePerfTests) stopTiming("remove objects");

        var objectsToAdd = [];
        var selectionChanged = false;

        // Add new objects and update existing objects
        allObjects.forEach(function (child) {
            if(objectsInCanvas.indexOf(child) !== -1) {
                // Update existing object
                fabricInterface.canvas.forEachObject(function(fabricObj) {
                    if(fabricObj.group) return;
                    if(fabricObj.wickObjectRef === child) {
                        updateFabObj(fabricObj, child, activeObjects);
                        //refreshZIndices();
                    }
                });
                
            } else {
                // Add new object
                objectsInCanvas.push(child);
                objectsToAdd.push(child);
            }
        });

        var numObjectsAdded = 0;
        objectsToAdd.forEach(function (objectToAdd) {
            createFabricObjectFromWickObject(objectToAdd, function (fabricObj) {

                if(wickEditor.project.currentObject.getAllActiveChildObjects().indexOf(objectToAdd) === -1) {
                    objectsInCanvas.splice(objectsInCanvas.indexOf(objectToAdd), 1)
                    return;             
                }

                objectToAdd.fabricObjectReference = fabricObj

                // The object may have been deleted while we were generating the fabric object. 
                // Make sure we don't add it if that happened.
                if(wickEditor.project.currentObject.getAllActiveChildObjects().indexOf(objectToAdd) === -1) return;

                fabricObj.originX = 'center';
                fabricObj.originY = 'center';

                fabricObj.wickObjectRef = objectToAdd;
                fabricInterface.canvas.add(fabricObj);
                updateFabObj(fabricObj, objectToAdd, activeObjects);

                //var trueZIndex = allObjects.indexOf(objectToAdd);
                //fabricInterface.canvas.moveTo(fabricObj, trueZIndex+fabricInterface.guiElements.getNumGUIElements());

                if(objectToAdd.selectOnAddToFabric) {
                    if(!selectionChanged) {
                        selectionChanged = true;
                        selectedObjects = [];
                    }
                    selectedObjects.push(objectToAdd);
                    objectToAdd.selectOnAddToFabric = false;
                    fabricInterface.deselectAll();
                    fabricInterface.selectObjects(selectedObjects);
                }

                numObjectsAdded++;
                if(numObjectsAdded === objectsToAdd.length) {
                    //console.log("force z index update");
                    refreshZIndices(true);
                    fabricInterface.canvas.renderAll()
                }
                //refreshZIndices();
            });
        });

        if(objectsToAdd.length === 0) {
            //console.log("no objectsToAdd, unforced zindex update");
            refreshZIndices(false);
        }

        if(enablePerfTests) stopTiming("add & update objects");

        // Reselect objects that were selected before sync
        if(selectedObjects.length > 0) fabricInterface.selectObjects(selectedObjects);

        if(enablePerfTests) stopTiming("reselect");
    }

    var createFabricObjectFromWickObject = function (wickObj, callback) {

        if(wickObj.cachedFabricObject) {
            callback(wickObj.cachedFabricObject);
            return;
        }

        if(wickObj.imageData) {
            fabric.Image.fromURL(wickObj.imageData, function(newFabricImage) {
                wickObj.cachedFabricObject = newFabricImage;
                newFabricImage.wickObjReference = wickObj;
                callback(newFabricImage);
            });
        }

        if(wickObj.fontData) {
            var newFabricText = new fabric.IText(wickObj.fontData.text, wickObj.fontData);
            newFabricText.wickObjReference = wickObj;
            callback(newFabricText);
        }

        if(wickObj.audioData) {
            fabric.Image.fromURL('resources/audio.png', function(audioFabricObject) {
                audioFabricObject.wickObjReference = wickObj;
                callback(audioFabricObject);
            });
        }

        if (wickObj.isSymbol) {
            var children = wickObj.getAllActiveChildObjects();
            var group = new fabric.Group();
            var wos = {};
            for(var i = 0; i < children.length; i++) {
                
                var setupSymbol = function () {
                    //wos.forEach(function (pair) {
                    for(var i = 0; i < Object.keys(wos).length; i++) {
                        var pair = wos[i]
                        var fabricObj = pair.fo;
                        var child = pair.wo;

                        fabricObj.originX = 'centerX';
                        fabricObj.originY = 'centerY';
                        
                        updateFabObj(fabricObj, child);
                        group.addWithUpdate(fabricObj);
                    }
                    //if(group._objects.length == children.length) {
                            wickObj.width = group.width;
                            wickObj.height = group.height;
                            wickObj.symbolFabricObject = group;
                            group.wickObjReference = wickObj;
                            callback(group);
                        //}
                }
                var dothing = function (wo) {
                    createFabricObjectFromWickObject(children[wo], function(fabricObj) {
                        wos[wo] = ({fo:fabricObj,wo:children[wo]});

                        if(Object.keys(wos).length == children.length) {
                            setupSymbol();
                        }
                    });
                }
                dothing(i);
            }
        }

    }

    var updateFabObj = function (fabricObj, wickObj, activeObjects) {

        // To get pixel-perfect positioning to avoid blurry images (this happens when an image has a fractional position)
        if(wickObj.imageData) {
            wickObj.x = Math.round(wickObj.x);
            wickObj.y = Math.round(wickObj.y);
        }

        // Some wick objects don't have a defined width/height until rendered by fabric. (e.g. paths and text)
        if(!wickObj.width) wickObj.width = fabricObj.width;
        if(!wickObj.height) wickObj.height = fabricObj.height;

        // Always use length of text from fabric
        if(fabricObj.type === "i-text") {
            wickObj.width  = fabricObj.width;
            wickObj.height  = fabricObj.height;
        }

        fabricObj.left    = wickObj.getAbsolutePosition().x;
        fabricObj.top     = wickObj.getAbsolutePosition().y;
        fabricObj.width   = wickObj.width;
        fabricObj.height  = wickObj.height;
        fabricObj.scaleX  = wickObj.scaleX;
        fabricObj.scaleY  = wickObj.scaleY;
        fabricObj.angle   = wickObj.angle;
        fabricObj.flipX   = wickObj.flipX;
        fabricObj.flipY   = wickObj.flipY;
        fabricObj.opacity = wickObj.opacity;

        if(wickObj.isSymbol) {
            //var cornerPosition = wickObj.getSymbolBoundingBoxCorner();
            //fabricObj.left += cornerPosition.x;
            //fabricObj.top += cornerPosition.y;
        }

        if(wickObj.fontData) {
            fabricObj.text = wickObj.fontData.text;
            fabricObj.fontFamily = wickObj.fontData.fontFamily;
            fabricObj.setColor(wickObj.fontData.fill);
            fabricObj.fontSize = wickObj.fontData.fontSize;
            fabricObj.fontStyle = wickObj.fontData.fontStyle;
            fabricObj.fontWeight = wickObj.fontData.fontWeight;
            fabricObj.textDecoration = wickObj.fontData.textDecoration;
        } else {
            if(wickObj.opacity > 0) {
                fabricObj.perPixelTargetFind = true;
                fabricObj.targetFindTolerance = 4;
            } else {
                fabricObj.perPixelTargetFind = false;
            }
        }

        fabricObj.setCoords();

    //

        if(activeObjects) {

            var setCoords = fabricObj.setCoords.bind(fabricObj);
            fabricObj.on({
                moving: setCoords,
                scaling: setCoords,
                rotating: setCoords
            });

            if(activeObjects.indexOf(wickObj) !== -1) {
                fabricObj.hasControls = true;
                fabricObj.selectable = true;
                fabricObj.evented = true;
            } else {
                fabricObj.hasControls = false;
                fabricObj.selectable = false;
                fabricObj.evented = false;
            }

            if (!(fabricInterface.currentTool instanceof Tools.Cursor)) {
                fabricObj.hasControls = false;
                fabricObj.selectable = false;
                fabricObj.evented = false;
            }

            if (!wickObj.isOnActiveLayer()) {
                fabricObj.hasControls = false;
                fabricObj.selectable = false;
                fabricObj.evented = false;
            }
        }
    }
	
}