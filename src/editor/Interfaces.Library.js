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
    
var LibraryInterface = function (wickEditor) {

    this.setup = function () {
        $("#tree").fancytree();
    }

    this.syncWithEditorState = function () {
        this.clear();
        this.populate();
    }

    this.populate = function () {

        var newTreeChildren = [];

        var library = wickEditor.project.library;
        for (uuid in library.assets) {
            var asset = library.assets[uuid];
            newTreeChildren.push({ title: asset.filename });
        }

        $("#tree").fancytree("getRootNode").addChildren(newTreeChildren);

    }

    this.clear = function () {

        var node = $("#tree").fancytree("getRootNode");

        while( node.hasChildren() ) {
            node.getFirstChild().remove();
        }
        
    }

}