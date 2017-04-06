TimelineInterface.PlayRange = function (wickEditor, timeline) {
    var that = this;

    this.elem = null;

    this.handleRight = null;
    this.handleLeft = null;

    this.wickPlayrange = null;

    this.build = function () {
        this.elem = document.createElement('div');
        this.elem.className = 'playrange';
        this.elem.addEventListener('mousedown', function (e) {
            wickEditor.project.clearSelection()
            wickEditor.project.selectObject(that.wickPlayrange);

            timeline.interactions.start("dragPlayRange", e, {playrange:that});

            e.stopPropagation();
        });

        var label = document.createElement('div');
        label.className = 'playrange-label'
        label.innerHTML = this.wickPlayrange.identifier;
        this.elem.appendChild(label);

        var width = this.wickPlayrange.getLength()*cssVar('--frame-width');
        var widthOffset = -2;
        this.elem.style.width = width + widthOffset+'px'

        var left = this.wickPlayrange.getStart()*cssVar('--frame-width');
        var leftOffset = cssVar('--frames-cell-first-padding')*2+1;
        this.elem.style.left  = left + leftOffset + 'px';

        this.handleRight = document.createElement('div');
        this.handleRight.className = 'playrange-handle playrange-handle-right';
        this.handleRight.addEventListener('mousedown', function (e) {
            timeline.interactions.start("dragPlayRangeEnd", e, {playrange:that});
            e.stopPropagation()
        });
        this.elem.appendChild(this.handleRight)

        this.handleLeft = document.createElement('div');
        this.handleLeft.className = 'playrange-handle playrange-handle-left';
        this.handleLeft.addEventListener('mousedown', function (e) {
            timeline.interactions.start("dragPlayRangeStart", e, {playrange:that});
            e.stopPropagation()
        });
        this.elem.appendChild(this.handleLeft);
    }

    this.update = function () {
        this.elem.style.backgroundColor = this.wickPlayrange.color;

        if(wickEditor.project.isObjectSelected(this.wickPlayrange)) {
            this.elem.className = 'playrange playrange-selected'
        } else {
            this.elem.className = 'playrange'
        }
    }

    this.rebuild = function () {
        
    }
}