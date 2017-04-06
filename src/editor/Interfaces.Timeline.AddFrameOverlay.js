TimelineInterface.AddFrameOverlay = function () {
    this.elem = null;

    var that = this;

    this.build = function () {
        this.elem = document.createElement('div');
        this.elem.className = 'add-frame-overlay';
        this.elem.style.display = 'none';

        var addFrameOverlayImg = document.createElement('img');
        addFrameOverlayImg.className = 'add-frame-overlay-img';
        addFrameOverlayImg.src = 'http://iconshow.me/media/images/Mixed/Free-Flat-UI-Icons/png/512/plus-24-512.png';
        this.elem.appendChild(addFrameOverlayImg);
    }

    this.update = function () {
        
    }
}