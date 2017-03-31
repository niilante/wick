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

var InspectorInterface = function (wickEditor) {

    var inspectorDiv;
    var inputs;

    var StringInput = function (getValueFn, onChangeFn) {

        var self = this;
        var elem = document.createElement('input');
        elem.class = 'inspector-string-input';

        self.sync = function () {
            elem.value = self.getValueFn();
        }
        elem.onchange = function (e) {
            self.onChangeFn(e.val);
        }

        self.getValueFn = getValueFn;
        self.onChangeFn = onChangeFn;

        inspectorDiv.addChild(elem);

    }

    this.setup = function () {
        inspectorDiv = document.getElementById('inspector');
        inputs = [];

        inputs.push(new StringInput(
            function () {
                return wickEditor.project.getSelectedObject().name;
            }, 
            function (val) {
                wickEditor.project.getSelectedObject().name = val;
            }
        ));
    }

    this.syncWithEditorState = function () {
        inputs.forEach(function (input) {
            input.sync();
        });
    }

}