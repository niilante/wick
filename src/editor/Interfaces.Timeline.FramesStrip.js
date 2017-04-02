TimelineInterface.FramesStrip = function (wickEditor, timeline) {
    var that = this;

    this.elem = null;

    this.wickLayer = null;

    this.build = function () {
        var wickLayers = wickEditor.project.getCurrentObject().layers;

        this.elem = document.createElement('div');
        this.elem.className = 'frames-strip';
        this.elem.style.top = (wickLayers.indexOf(this.wickLayer) * cssVar('--layer-height')) + 'px';
        this.elem.addEventListener('mousemove', function (e) {
            var px = Math.round((e.clientX - timeline.framesContainer.elem.getBoundingClientRect().left - cssVar('--frame-width')/2)      / cssVar('--frame-width'))
            var py = Math.round((e.clientY - timeline.framesContainer.elem.getBoundingClientRect().top  - cssVar('--layer-height')/2) / cssVar('--layer-height'))

            if(timeline.interactions.getCurrent()) return;
            if(wickEditor.project.getCurrentObject().layers[py].getFrameAtPlayheadPosition(px)) return;
            
            timeline.framesContainer.addFrameOverlay.elem.style.display = 'block';
            timeline.framesContainer.addFrameOverlay.elem.style.left = roundToNearestN(e.clientX - timeline.framesContainer.elem.getBoundingClientRect().left - cssVar('--frame-width')/2 - 9, cssVar('--frame-width')) + 10 + "px";
            timeline.framesContainer.addFrameOverlay.elem.style.top  = roundToNearestN(e.clientY - timeline.framesContainer.elem.getBoundingClientRect().top  - cssVar('--layer-height')/2, cssVar('--layer-height')) + "px";
        });
        this.elem.addEventListener('mouseup', function (e) {
            /*wickEditor.actionHandler.doAction('movePlayhead', {
                obj: wickEditor.project.currentObject,
                newPlayheadPosition: Math.round((e.clientX - timeline.framesContainer.elem.getBoundingClientRect().left - cssVar('--frame-width')/2) / cssVar('--frame-width')),
            });*/
            if(timeline.framesContainer.addFrameOverlay.elem.style.display === 'none') return;
            var newFrame = new WickFrame();
            newFrame.playheadPosition = Math.round((e.clientX - timeline.framesContainer.elem.getBoundingClientRect().left - cssVar('--frame-width')/2 - 9) / cssVar('--frame-width'))
            var layerIndex = Math.round((e.clientY - timeline.framesContainer.elem.getBoundingClientRect().top - cssVar('--layer-height')/2) / cssVar('--layer-height'))
            var layer = wickEditor.project.currentObject.layers[layerIndex];
            wickEditor.actionHandler.doAction('addFrame', {frame:newFrame, layer:layer});
            timeline.framesContainer.addFrameOverlay.elem.style.display = 'none';
        });
        this.elem.addEventListener('mouseout', function (e) {
            timeline.framesContainer.addFrameOverlay.elem.style.display = 'none';
        });
        for(var i = 0; i < 100; i++) {
            var framesStripCell = document.createElement('div');
            framesStripCell.className = 'frames-strip-cell';
            if(i===0){
                framesStripCell.className += " frames-strip-cell-first"
                framesStripCell.style.left = i*cssVar('--frame-width') + 'px'
            } else {
                framesStripCell.style.left = i*cssVar('--frame-width') + 5 + 'px'
            }
            
            this.elem.appendChild(framesStripCell);
        }
    }

    this.update = function () {

    }
}