TimelineInterface.FramesContainer = function (wickEditor, timeline) {
    var that = this;

    this.elem = null;

    this.frames = null;
    this.frameStrips = null;

    this.addFrameOverlay = new TimelineInterface.AddFrameOverlay(wickEditor, timeline);
    this.playhead = new TimelineInterface.Playhead(wickEditor, timeline);
    this.selectionBox = new TimelineInterface.SelectionBox(wickEditor, timeline);

    this.build = function () {
        this.elem = document.createElement('div');
        this.elem.className = 'frames-container';
        this.elem.addEventListener('mousedown', function (e) {
            timeline.interactions.start('dragSelectionBox', e, {});
        });

        this.elem.addEventListener('mousedown', function (e) {
            wickEditor.project.clearSelection();
            timeline.framesContainer.update();
        });

        timeline.elem.addEventListener('mousewheel', function(e) {
            that.addFrameOverlay.elem.style.display = 'none'
            var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

            if(wickEditor.inputHandler.specialKeys["SHIFT"]) {
                var currentFrameWidth = cssVar('--frame-width');

                var newFrameWidth = currentFrameWidth + delta * 3;
                newFrameWidth = Math.min(newFrameWidth, 100)
                newFrameWidth = Math.max(newFrameWidth, 30)

                document.body.style.setProperty('--frame-width', newFrameWidth+'px');

                wickEditor.project.currentObject.framesDirty = true;
                wickEditor.syncInterfaces();
            } else if (wickEditor.inputHandler.specialKeys["SHIFT"]) {
                timeline.horizontalScrollBar.scroll(delta*15);
                that.update();
            } else {
                timeline.verticalScrollBar.scroll(-delta*10);
                that.update();
            }
        });

        this.addFrameOverlay.build();
        this.playhead.build();
        this.selectionBox.build();

        this.rebuild();
    }

    this.rebuild = function () {
        this.elem.innerHTML = "";
        this.frames = [];
        this.frameStrips = [];

        var wickLayers = wickEditor.project.currentObject.layers;
        wickLayers.forEach(function (wickLayer) {
            var framesStrip = new TimelineInterface.FramesStrip(wickEditor, timeline);
            framesStrip.wickLayer = wickLayer;
            framesStrip.build();
            framesStrip.wickLayer = wickLayer;
            that.elem.appendChild(framesStrip.elem);
            that.frameStrips.push(framesStrip)

            wickLayer.frames.forEach(function(wickFrame) {
                var frame = new TimelineInterface.Frame(wickEditor, timeline);

                frame.wickFrame = wickFrame;
                frame.wickLayer = wickLayer;
                frame.build();

                that.frames.push(frame);
                that.elem.appendChild(frame.elem);
            });
        });

        this.elem.appendChild(this.addFrameOverlay.elem);
        this.elem.appendChild(this.playhead.elem);
        this.elem.appendChild(this.selectionBox.elem);
    }

    this.update = function () {
        this.frames.forEach(function (frame) {
            frame.update();
        });
        this.playhead.update();

        $('.frames-container').css('left', timeline.horizontalScrollBar.scrollAmount+cssVar('--layers-width')+'px');
        $('.frames-container').css('top', timeline.verticalScrollBar.scrollAmount+'px');
        $('.layers-container').css('top', timeline.verticalScrollBar.scrollAmount+'px');
    }

    this.getFrames = function (wickFrames) {
        var frames = [];
        wickFrames.forEach(function (wickFrame) {
            that.frames.forEach(function (frame) {
                if(frame.wickFrame === wickFrame) {
                    frames.push(frame);
                }
            })
        });
        return frames;
    }
}