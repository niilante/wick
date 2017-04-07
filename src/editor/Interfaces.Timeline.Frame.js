TimelineInterface.Frame = function (wickEditor, timeline) {
    var that = this;

    var selectionOverlayDiv = null;
    var thumbnailDiv = null;

    this.wickFrame = null;
    this.wickLayer = null;

    this.build = function () {
        var wickLayers = wickEditor.project.getCurrentObject().layers;

        this.elem = document.createElement('div');
        this.elem.className = "frame";
        this.elem.style.left = (that.wickFrame.playheadPosition * cssVar('--frame-width')) - 4 + 'px';
        this.elem.style.top = (wickLayers.indexOf(that.wickLayer) * cssVar('--layer-height')) + 'px';
        this.elem.style.width = (that.wickFrame.length * cssVar('--frame-width') - cssVar('--common-padding')/2) + 'px';
        this.elem.style.height = cssVar('--layer-height')-cssVar('--common-padding')+'px'
        this.elem.wickData = {wickFrame:that.wickFrame};
        this.elem.addEventListener('mouseup', function (e) {
            /*wickEditor.actionHandler.doAction('movePlayhead', {
                obj: wickEditor.project.currentObject,
                newPlayheadPosition: that.wickFrame.playheadPosition,
                newLayer: that.wickFrame.parentLayer
            });
            wickEditor.project.clearSelection()
            wickEditor.project.selectObject(that.wickFrame)
            timeline.framesContainer.update();*/
        });
        this.elem.addEventListener('mousedown', function (e) {

            wickEditor.actionHandler.doAction('movePlayhead', {
                obj: wickEditor.project.currentObject,
                newPlayheadPosition: that.wickFrame.playheadPosition + Math.floor(e.offsetX / cssVar('--frame-width')),
                newLayer: that.wickFrame.parentLayer
            });
            if(!wickEditor.project.isObjectSelected(that.wickFrame)) {
                wickEditor.project.clearSelection();
                wickEditor.project.selectObject(that.wickFrame);
                wickEditor.syncInterfaces();
            }

            timeline.interactions.start("dragFrame", e, {
                frames: timeline.framesContainer.getFrames(wickEditor.project.getSelectedObjects())
            });
            
            if(e.button === 2) {
                wickEditor.rightclickmenu.openMenu();
            } else {
                wickEditor.rightclickmenu.closeMenu();
            }

            e.stopPropagation();
        });

        thumbnailDiv = document.createElement('img');
        thumbnailDiv.className = "frame-thumbnail";
        this.elem.appendChild(thumbnailDiv);

        selectionOverlayDiv = document.createElement('div');
        selectionOverlayDiv.className = "selection-overlay";
        this.elem.appendChild(selectionOverlayDiv);

        var extenderHandleRight = document.createElement('div');
        extenderHandleRight.className = "frame-extender-handle frame-extender-handle-right";
        extenderHandleRight.addEventListener('mousedown', function (e) {
            timeline.interactions.start("dragFrameWidth", e, {frame:that});
            e.stopPropagation();
        });
        this.elem.appendChild(extenderHandleRight);
        
        var extenderHandleLeft = document.createElement('div');
        extenderHandleLeft.className = "frame-extender-handle-left";
        extenderHandleLeft.addEventListener('mousedown', function (e) {
            timeline.interactions.start("dragFrameWidth", e, {frame:that});
            e.stopPropagation();
        });
        that.elem.appendChild(extenderHandleLeft);
//        @Todo Help me get Left handle working 
    }

    this.update = function () {
        var src = this.wickFrame.thumbnail;
        if(src) {
            thumbnailDiv.src = src;
        } else {
            thumbnailDiv.src = 'https://www.yireo.com/images/stories/joomla/whitepage.png';
        }

        if (wickEditor.project.isObjectSelected(this.wickFrame)) {
            selectionOverlayDiv.style.display = 'block';
        } else {
            selectionOverlayDiv.style.display = 'none';
        }
    }
}