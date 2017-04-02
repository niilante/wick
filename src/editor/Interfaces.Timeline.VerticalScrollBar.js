TimelineInterface.VerticalScrollBar = function (wickEditor, timeline) {
    var that = this;

    this.elem = null;

    var topButton;
    var bottomButton
    var head;

    that.scrollAmount;

    this.build = function () {
        this.elem = document.createElement('div');
        this.elem.className = 'scrollbar vertical-scrollbar';

        that.scrollAmount = cssVar('--number-line-height');

        head = document.createElement('div');
        head.className = 'scrollbar-head scrollbar-head-vertical';
        head.addEventListener('mousedown', function (e) {
            timeline.interactions.start('dragVerticalScrollbarHead');
        })
        this.elem.appendChild(head);

        topButton = document.createElement('div');
        topButton.className = 'scrollbar-button scrollbar-button-top';
        topButton.addEventListener('mousedown', function (e) {
            that.scroll(20)
        });
        this.elem.appendChild(topButton);

        bottomButton = document.createElement('div');
        bottomButton.className = 'scrollbar-button scrollbar-button-bottom';
        bottomButton.addEventListener('mousedown', function (e) {
            that.scroll(-20)
        });
        this.elem.appendChild(bottomButton);
    }

    this.update = function () {
        var nLayers = wickEditor.project.getCurrentObject().layers.length;

        this.elem.style.display = nLayers > 3 ? 'block' : 'none';

        head.style.height = parseInt(timeline.elem.style.height)/4 + 'px';
        head.style.marginTop = -that.scrollAmount + cssVar('--scrollbar-thickness') + cssVar('--number-line-height') + 'px';
    }

    this.scroll = function (scrollAmt) {
        if(wickEditor.project.getCurrentObject().layers.length < 4) return;

        that.scrollAmount = Math.min(that.scrollAmount + scrollAmt, cssVar('--number-line-height'));
        timeline.framesContainer.update();
        that.update();
    }
}