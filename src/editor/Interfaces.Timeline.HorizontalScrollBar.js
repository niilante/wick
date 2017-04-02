TimelineInterface.HorizontalScrollBar = function (wickEditor, timeline) {
    var that = this;

    this.elem = null;

    var leftButton;
    var rightButton;
    var head;

    this.scrollAmount;

    this.build = function () {
        this.elem = document.createElement('div');
        this.elem.className = 'scrollbar horizontal-scrollbar';

        that.scrollAmount = 0;

        head = document.createElement('div');
        head.className = 'scrollbar-head scrollbar-head-horizontal';
        head.addEventListener('mousedown', function (e) {
            timeline.interactions.start('dragHorizontalScrollbarHead')
        })
        this.elem.appendChild(head);

        leftButton = document.createElement('div');
        leftButton.className = 'scrollbar-button scrollbar-button-left';
        leftButton.addEventListener('mousedown', function (e) {
            that.scroll(20);
        });
        this.elem.appendChild(leftButton);

        rightButton = document.createElement('div');
        rightButton.className = 'scrollbar-button scrollbar-button-right';
        rightButton.addEventListener('mousedown', function (e) {
            that.scroll(-20);
        });
        this.elem.appendChild(rightButton);
    }

    this.update = function () {
        head.style.marginLeft = -that.scrollAmount + cssVar('--scrollbar-thickness') + 'px';
    }

    this.scroll = function (scrollAmt) {
        that.scrollAmount = Math.min(that.scrollAmount + scrollAmt, 0);
        timeline.framesContainer.update();
        timeline.numberLine.update();
        that.update();
    }
}