/*    scrollbar code      */
/*     just for fun       */
/* for late night sadness */

var Scrollbar = function (viewboxSize, contentSize) {

	this.viewboxSize = viewboxSize;
	this.viewboxPosition - undefined;

	this.barSize = undefined;
	this.barPosition = 0;

	this.contentSize = contentSize;

	this._recalcBarSize();
	this._recalcViewboxPosition();

};

Scrollbar.prototype._recalcBarSize = function () {
	this.barSize = this.viewboxSize * (this.viewboxSize / this.contentSize);
};

Scrollbar.prototype._recalcBarPosition = function () {
	this.barPosition = this.viewboxSize * (this.viewboxPosition / this.contentSize);
};

Scrollbar.prototype._recalcViewboxPosition = function (val) {
	this.viewboxPosition = (this.barPosition / this.viewboxSize) * this.contentSize;
};

Scrollbar.prototype.setViewboxSize = function (val) {
	this.viewboxSize = val;
	this._recalcBarSize();
	this._recalcBarPosition();
	this._recalcViewboxPosition();
};

Scrollbar.prototype.setContentSize = function (val) {
	this.contentSize = val;
	this._recalcBarSize();
	this._recalcBarPosition();
	this._recalcViewboxPosition();
};

Scrollbar.prototype.setBarPosition = function (val) {
	this.barPosition = val;
	this._recalcViewboxPosition();
};

Scrollbar.prototype.setViewboxPosition = function (val) {
	this.viewboxPosition = val;
	this._recalcBarPosition();
};