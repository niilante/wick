/* Wick - (c) 2017 Zach Rispoli, Luca Damasco, and Josh Rispoli */

/*  This file is part of Wick. 
    
    Wick is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Wick is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Wick.  If not, see <http://www.gnu.org/licenses/>. */
    
var TimelineInterface = function (wickEditor) {

    var self = this;

    var lastObject;

    var timeline;

    //var cssVars;
    //var cssVar;

    self.setup = function () {

        // Load style vars from CSS
        window.cssVars = window.getComputedStyle(document.body);
        window.cssVar = function (varName) {
            return parseInt(cssVars.getPropertyValue(varName));
        }

        // Build timeline in DOM
        timeline = new TimelineInterface.Timeline(wickEditor);
        timeline.build();
    }

    self.syncWithEditorState = function () {

        if (lastObject !== wickEditor.project.currentObject || wickEditor.project.currentObject.framesDirty) {
            wickEditor.project.currentObject.framesDirty = false;
            lastObject = wickEditor.project.currentObject;

            timeline.rebuild();
        }

        timeline.update();

    }

}

TimelineInterface.Timeline = function (wickEditor) {
    this.elem = null;

    this.layersContainer = new TimelineInterface.LayersContainer(wickEditor, this);
    this.framesContainer = new TimelineInterface.FramesContainer(wickEditor, this);
    this.horizontalScrollBar = new TimelineInterface.HorizontalScrollBar(wickEditor, this);
    this.verticalScrollBar = new TimelineInterface.VerticalScrollBar(wickEditor, this);
    this.numberLine = new TimelineInterface.NumberLine(wickEditor, this);

    this.interactions = new TimelineInterface.Interactions(wickEditor, this);
    this.interactions.setup();

    this.build = function () {
        this.elem = document.createElement('div');
        document.getElementById('timelineGUI').appendChild(this.elem);

        this.framesContainer.build();
        this.elem.appendChild(this.framesContainer.elem);

        this.layersContainer.build();
        this.elem.appendChild(this.layersContainer.elem);

        this.numberLine.build();
        this.elem.appendChild(this.numberLine.elem);

        var hideNumberlinePiece = document.createElement('div');
        hideNumberlinePiece.className = 'hide-number-line-piece';
        this.elem.appendChild(hideNumberlinePiece);
        
        var hideLayersPiece = document.createElement('div');
        hideLayersPiece.className = 'layer-toolbar';
        this.elem.appendChild(hideLayersPiece);

        var addLayerButton = document.createElement('div');
        addLayerButton.className = 'layer-tools-button add-layer-button tooltipElem';
        addLayerButton.setAttribute('alt', "Add Layer");
        addLayerButton.addEventListener('mousedown', function (e) {
            wickEditor.guiActionHandler.doAction('addLayer');
        });
        hideLayersPiece.appendChild(addLayerButton);

        var deleteLayerButton = document.createElement('div');
        deleteLayerButton.className = 'layer-tools-button delete-layer-button tooltipElem';
        deleteLayerButton.setAttribute('alt', "Delete Layer");
        deleteLayerButton.addEventListener('mousedown', function (e) {
            wickEditor.guiActionHandler.doAction('removeLayer');
        });
        hideLayersPiece.appendChild(deleteLayerButton);

        this.horizontalScrollBar.build();
        this.elem.appendChild(this.horizontalScrollBar.elem);

        var hideScrollbarConnectPiece  = document.createElement('div'); 
        hideScrollbarConnectPiece.className = 'hide-scrollbar-connect-piece';
        this.elem.appendChild(hideScrollbarConnectPiece); 

        this.verticalScrollBar.build();
        this.elem.appendChild(this.verticalScrollBar.elem);
    }
    
    this.rebuild = function () {
        this.layersContainer.rebuild();
        this.framesContainer.rebuild();
        this.numberLine.rebuild();
    }

    this.update = function () {
        this.layersContainer.update();
        this.framesContainer.update();
        this.elem.style.height = this.calculateHeight() + "px";

        this.numberLine.update();

        this.horizontalScrollBar.update();
        this.verticalScrollBar.update();
    }

    this.calculateHeight = function () {
        var maxTimelineHeight = cssVar("--max-timeline-height");
        var expectedTimelineHeight = this.layersContainer.layers.length * cssVar("--layer-height") + 44; 
        return Math.min(expectedTimelineHeight, maxTimelineHeight); 
    }
}
