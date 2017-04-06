TimelineInterface.Layer = function (wickEditor, timeline) {
    var that = this;

    this.elem = null

    this.wickLayer = null;

    this.build = function () {
        var wickLayers = wickEditor.project.currentObject.layers;

        this.elem = document.createElement('div');
        this.elem.className = "layer";
        this.elem.style.top = (wickLayers.indexOf(this.wickLayer) * cssVar('--layer-height')) + 'px';
        this.elem.innerHTML = this.wickLayer.identifier;
        this.elem.wickData = {wickLayer:this.wickLayer};

        var layerSelectionOverlayDiv = document.createElement('div');
        layerSelectionOverlayDiv.className = 'layer-selection-overlay';
        this.elem.appendChild(layerSelectionOverlayDiv);

        this.elem.addEventListener('mousedown', function (e) {
            wickEditor.actionHandler.doAction('movePlayhead', {
                obj: wickEditor.project.currentObject,
                newPlayheadPosition: wickEditor.project.currentObject.playheadPosition,
                newLayer: that.wickLayer
            });
            timeline.interactions.start('dragLayer', e, {layer:that});
        });
    }

    this.update = function () {
        var layerIsSelected = wickEditor.project.getCurrentLayer() === this.wickLayer;
        var selectionOverlayDiv = this.elem.getElementsByClassName('layer-selection-overlay')[0];
        selectionOverlayDiv.style.display = layerIsSelected ? 'block' : 'none';
        
        var layerDiv = this.elem;
        if (layerIsSelected === true) {
            layerDiv.className = 'layer active-layer';
        } else {
            layerDiv.className = 'layer';
        }
    }
}