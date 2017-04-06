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
    
var WickEditorSettings = function () {

    if(localStorage.wickEditorSettings) {

        this.setDefaults();
        this.load();

    } else {

        this.setDefaults();
        this.save();

    }

}

WickEditorSettings.prototype.setDefaults = function () {

    this.brushThickness = 5;
    this.brushSmoothness = 5;

    this.drawingColor = "#000000";

    this.shapeFillColor = "#FF0000";

    this.rectangleRoundCornersAmount = 0;

    this.lineThickness = 1;
    this.endpointShape = "circles";

}

WickEditorSettings.prototype.save = function () {

    localStorage.wickEditorSettings = JSON.stringify(this);

};

WickEditorSettings.prototype.load = function () {

    var savedSettings = JSON.parse(localStorage.wickEditorSettings);

    for (key in savedSettings) {
        this[key] = savedSettings[key];
    }

}

