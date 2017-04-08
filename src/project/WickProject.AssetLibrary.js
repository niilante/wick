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
    
var AssetLibrary = function () {

    this.assets = {};

};

AssetLibrary.prototype.addAsset = function (asset) {

    var uuid = random.uuid4();
    this.assets[uuid] = asset;

    return uuid;

}

AssetLibrary.prototype.deleteAsset = function (uuid) {

    this.assets[uuid] = null;

}

AssetLibrary.prototype.getAsset = function (uuid) {

    return this.assets[uuid];

}

AssetLibrary.addPrototypes = function (library) {

    for (assetUUID in library.assets) {
        library.assets[assetUUID].__proto__ = WickAsset.prototype;
    }

}