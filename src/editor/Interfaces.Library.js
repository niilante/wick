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

        var obj = [
            { title: "Lazy node 1", lazy: true },
            { title: "Lazy node 2", lazy: true },
            { title: "Folder node 3", folder: true,
              children: [
                { title: "node 3.1" },
                { title: "node 3.2",
                  children: [
                    { title: "node 3.2.1" },
                    { title: "node 3.2.2",
                      children: [
                        { title: "node 3.2.2.1" }
                      ]
                    }
                  ]
                }
              ]
            }
        ];
        $("#tree").fancytree("getRootNode").addChildren(obj);
    }

    this.syncWithEditorState = function () {
        
    }

}