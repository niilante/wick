TimelineInterface.Playhead = function (wickEditor, timeline) {
    this.elem = null;

    this.x = null;

    this.build = function () {
        this.elem = document.createElement('div');
        this.elem.className = 'playhead';
    }

    this.update = function () {
        this.x = wickEditor.project.currentObject.playheadPosition * cssVar('--frame-width') + cssVar('--frame-width')/2 - cssVar('--playhead-width')/2 + 9;
        this.elem.style.left = this.x + 'px';
    }
}