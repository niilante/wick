TimelineInterface.LayersContainer = function (wickEditor, timeline) {
    var that = this;

    this.elem = null;

    this.layers = null;

    this.build = function () {
        this.elem = document.createElement('div');
        this.elem.className = 'layers-container';

        this.rebuild();
    }

    this.rebuild = function () {
        this.layers = [];

        this.elem.innerHTML = "";

        var wickLayers = wickEditor.project.currentObject.layers;
        wickLayers.forEach(function (wickLayer) {
            var layer = new TimelineInterface.Layer(wickEditor, timeline);

            layer.wickLayer = wickLayer;
            layer.build();
            layer.update();

            that.elem.appendChild(layer.elem);
            that.layers.push(layer);                
        });
    }

    this.update = function () {
        this.layers.forEach(function (layer) {
            layer.update();
        })
    }
}