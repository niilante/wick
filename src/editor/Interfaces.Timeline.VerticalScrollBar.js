TimelineInterface.VerticalScrollBar = function (wickEditor, timeline) {
    var that = this;

    this.elem = null;

    var topButton;
    var bottomButton
    var head;

    var scrollbar;

    this.build = function () {
        this.elem = document.createElement('div');
        this.elem.className = 'scrollbar vertical-scrollbar';

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

        scrollbar = new Scrollbar(10, 100, 300);
    },

    this.update = function () {
        var nLayers = wickEditor.project.getCurrentObject().layers.length;

        if(nLayers < 4) {
            this.elem.style.display = 'none';
            return;
        }
        this.elem.style.display = 'block';

        //head.style.height = parseInt(timeline.elem.style.height)/4 + 'px';
        //head.style.marginTop = scrollbar.barPosition + cssVar('--scrollbar-thickness') + cssVar('--number-line-height') + 'px';
    
        scrollbar.setScrollbarContainerSize(that.elem.offsetHeight);
        scrollbar.setViewboxSize(that.elem.offsetHeight-10);
        var contentSize = nLayers * cssVar('--layer-height');
        scrollbar.setContentSize(contentSize);
        head.style.marginTop = scrollbar.barPosition + cssVar('--scrollbar-thickness') + 'px';
        head.style.height = scrollbar.barSize - 30 + 'px';
    }

    this.scroll = function (scrollAmt) {
        scrollbar.setBarPosition(scrollbar.barPosition+scrollAmt);
        timeline.framesContainer.update();
        that.update();
    }

    this.getScrollPosition = function () {
        return scrollbar.viewboxPosition;
    }
}