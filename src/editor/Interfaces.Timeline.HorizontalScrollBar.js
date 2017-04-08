TimelineInterface.HorizontalScrollBar = function (wickEditor, timeline) {
    var that = this;

    this.elem = null;

    var leftButton;
    var rightButton;
    var head;

    var scrollbar;

    this.build = function () {
        this.elem = document.createElement('div');
        this.elem.className = 'scrollbar horizontal-scrollbar';

        head = document.createElement('div');
        head.className = 'scrollbar-head scrollbar-head-horizontal';
        head.addEventListener('mousedown', function (e) {
            timeline.interactions.start('dragHorizontalScrollbarHead')
        })
        this.elem.appendChild(head);

        leftButton = document.createElement('div');
        leftButton.className = 'scrollbar-button scrollbar-button-left';
        leftButton.addEventListener('mousedown', function (e) {
            that.scroll(-10);
        });
        this.elem.appendChild(leftButton);

        rightButton = document.createElement('div');
        rightButton.className = 'scrollbar-button scrollbar-button-right';
        rightButton.addEventListener('mousedown', function (e) {
            that.scroll(10);
        });
        this.elem.appendChild(rightButton);

        scrollbar = new Scrollbar(10, 20, 30);
        setTimeout(function () {
            scrollbar.setScrollbarContainerSize(that.elem.offsetWidth-30);
            scrollbar.setViewboxSize(that.elem.offsetWidth);
        }, 100);

        $(window).resize(function() {
            scrollbar.setScrollbarContainerSize(that.elem.offsetWidth-30);
            scrollbar.setViewboxSize(that.elem.offsetWidth);
            that.update()
        });
    }

    this.update = function () {
        var frameCount = wickEditor.project.getCurrentObject().getTotalTimelineLength();
        var buffer = 2000;
        var contentSize = frameCount * cssVar('--frame-width') + buffer;
        scrollbar.setContentSize(contentSize)
        head.style.marginLeft = scrollbar.barPosition + cssVar('--scrollbar-thickness') + 'px';
        head.style.width = scrollbar.barSize + 'px';
    }

    this.scroll = function (scrollAmt) {
        scrollbar.setBarPosition(scrollbar.barPosition + scrollAmt);
        timeline.framesContainer.update();
        timeline.numberLine.update();
        that.update();
    }

    this.getScrollPosition = function () {
        return scrollbar.viewboxPosition;
    }
}