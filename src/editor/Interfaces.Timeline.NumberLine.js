TimelineInterface.NumberLine = function (wickEditor, timeline) {
    var that = this;

    this.elem = null;

    this.playRanges = null;

    this.build = function () {
        this.elem = document.createElement('div');
        this.elem.className = 'number-line';

        this.elem.addEventListener('mousedown', function (e) {
            var start = Math.round((e.clientX - timeline.framesContainer.elem.getBoundingClientRect().left - cssVar('--frame-width')/2) / cssVar('--frame-width'));
            
            var playRange = new WickPlayRange(start, start+1, "");
            wickEditor.actionHandler.doAction('addPlayRange', {playRange: playRange});
            e.stopPropagation();
        });

        this.playRanges = [];
    }

    this.update = function () {
        this.elem.style.left = timeline.horizontalScrollBar.scrollAmount+cssVar('--layers-width')+'px';

        this.playRanges.forEach(function (playRange) {
            playRange.update();
        });
    }

    this.rebuild = function () {

        this.elem.innerHTML = ''

        for(var i = 0; i < 100; i++) {
            var numberLineCell = document.createElement('div');
            numberLineCell.className = 'number-line-cell';
            numberLineCell.style.left = i*cssVar('--frame-width') +cssVar('--frames-cell-first-padding') + 'px'
            
            var bar = document.createElement('div');
            bar.className = 'number-line-cell-bar';
            numberLineCell.appendChild(bar);

            var number = document.createElement('div');
            number.className = 'number-line-cell-number';
            number.innerHTML = (i+1);
            numberLineCell.appendChild(number);
            
            this.elem.appendChild(numberLineCell);
        }

        /*this.playRanges.forEach(function (playrange) {
            that.elem.removeChild(playrange.elem);
        });*/

        this.playRanges = [];

        wickEditor.project.getCurrentObject().playRanges.forEach(function (wickPlayrange) {
            var newPlayrange = new TimelineInterface.PlayRange(wickEditor, timeline);
            newPlayrange.wickPlayrange = wickPlayrange;
            newPlayrange.build();
            that.elem.appendChild(newPlayrange.elem);
            that.playRanges.push(newPlayrange)
        });
    }
}