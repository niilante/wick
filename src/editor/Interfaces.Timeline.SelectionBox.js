TimelineInterface.SelectionBox = function (wickEditor, timeline) {
    this.elem = null;

    this.build = function () {
        this.elem = document.createElement('div');
        this.elem.className = "selection-box";
        this.elem.style.display = 'none';
    }

    this.update = function () {
        
    }
}
