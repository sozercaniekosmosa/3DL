/**
 * Created by admin on 23.11.13.
 */

class input {

	constructor(DOM) {

		var _this = this;
		var DOM = this.DOM = document.querySelectorAll(DOM)[0];
		this.enable = true;

// MOUSE
		this.rc = 3;
		this.isMove = this.rc;
		var offset = getOffset(DOM);

// coord range[-1;+1]
		this.x = 0;
		this.y = 0;

//  screen coord
		this.xs = 0;
		this.ys = 0;

//  delta screen coord
		this.dx = 0;
		this.dy = 0;

		this.modeGreed = true;  // greed detected mbClick
		this.isEqual = false;   //

// events mouse
		this.mbClick = [0, 0, 0, 0];
		this.mbDown = [false, false, false, false];
		this.mbDownNow = [0, 0, 0, 0]; // Срабатывает один раз
		this.mbUp = [true, true, true, true];
		this.wheelDelta = 0;

// screen coord befor change
		this.xLast = 0;
		this.yLast = 0;

// objects belong DOM
		this.over = false;
		this.out = false;
		this.it = null;

//skip mbClick
		this.skipClick = 0;

		this.under = {};

		var width = DOM.clientWidth;
		var height = DOM.clientHeight;

		DOM.addEventListener('contextmenu', function (e) {
			e.preventDefault();
		}, false);
		DOM.addEventListener('mousemove', mMove, false);
		DOM.addEventListener('mouseup', mUp, false);
		DOM.addEventListener('mousedown', mDown, false);
		DOM.addEventListener('mouseover', mOver, false);
		DOM.addEventListener('mouseout', mOut, false);

		document.addEventListener('mousewheel', mWheel, false);
		document.addEventListener('DOMMouseScroll', mWheel, false); // firefox
		document.addEventListener('mouseup', function () {
			_this.isMove = _this.rc;
		}, false);
		document.addEventListener('mousedown', function () {
			_this.isMove = _this.rc;
		}, false);


// KEY
		this.pressed = {};
		this.released = 0;
		this.key_release = 0;
		this.pressNow = 0;

		this.event = {};
// key  map
		this.KEY_BACKSPASE = 8;
		this.KEY_DELETE = 46;
		this.KEY_ENTER = 13;
		this.KEY_ALT = 18;
		this.KEY_CTRL = 17;
		this.KEY_SHIFT = 16;
		this.KEY_PAGE_UP = 33;
		this.KEY_PAGE_DOWN_ = 34;
		this.KEY_END = 35;
		this.KEY_HOME = 36;
		this.KEY_A = 65;
		this.KEY_W = 87;
		this.KEY_D = 68;
		this.KEY_S = 83;
		this.KEY_SPACE = 32;
		this.KEY_ARROW_LEFT = 37;
		this.KEY_ARROW_UP = 38;
		this.KEY_ARROW_RIGHT = 39;
		this.KEY_ARROW_DOWN = 40;

		this[""] = 31;
		this[" "] = 32;
		this["!"] = 33;
		this["\""] = 34;
		this["#"] = 35;
		this["$"] = 36;
		this["%"] = 37;
		this["&"] = 38;
		this["'"] = 39;
		this["("] = 40;
		this[")"] = 41;
		this["*"] = 42;
		this["+"] = 43;
		this[","] = 44;
		this["-"] = 45;
		this["."] = 46;
		this["/"] = 47;
		this["0"] = 48;
		this["1"] = 49;
		this["2"] = 50;
		this["3"] = 51;
		this["4"] = 52;
		this["5"] = 53;
		this["6"] = 54;
		this["7"] = 55;
		this["8"] = 56;
		this["9"] = 57;
		this["="] = 58;
		this[";"] = 59;
		this["<"] = 60;
		this["="] = 61;
		this[">"] = 62;
		this["?"] = 63;
		this["@"] = 64;
		this["A"] = 65;
		this["B"] = 66;
		this["C"] = 67;
		this["D"] = 68;
		this["E"] = 69;
		this["F"] = 70;
		this["G"] = 71;
		this["H"] = 72;
		this["I"] = 73;
		this["J"] = 74;
		this["K"] = 75;
		this["L"] = 76;
		this["M"] = 77;
		this["N"] = 78;
		this["O"] = 79;
		this["P"] = 80;
		this["Q"] = 81;
		this["R"] = 82;
		this["S"] = 83;
		this["P"] = 84;
		this["U"] = 85;
		this["V"] = 86;
		this["W"] = 87;
		this["X"] = 88;
		this["Y"] = 89;
		this["Z"] = 90;
		this["["] = 91;
		this["\\"] = 92;
		this["]"] = 93;
		this["^"] = 94;
		this["_"] = 95;
		this["`"] = 96;
		this["a"] = 97;
		this["b"] = 98;
		this["c"] = 99;
		this["d"] = 100;
		this["e"] = 101;
		this["f"] = 102;
		this["g"] = 103;
		this["h"] = 104;
		this["i"] = 105;
		this["j"] = 106;
		this["k"] = 107;
		this["l"] = 108;
		this["m"] = 109;
		this["n"] = 110;
		this["o"] = 111;
		this["p"] = 112;
		this["q"] = 113;
		this["r"] = 114;
		this["s"] = 115;
		this["t"] = 116;
		this["u"] = 117;
		this["v"] = 118;
		this["w"] = 119;
		this["x"] = 120;
		this["y"] = 121;
		this["z"] = 122;
		this["{"] = 123;
		this["|"] = 124;
		this["}"] = 125;

		document.addEventListener('keydown', onKeyDown, false);
		document.addEventListener('keyup', onKeyUp, false);

		function onKeyDown(e) {
			if (!_this.enable) return;
			_this.event = e;
			_this.pressed[e.keyCode] = true;
			_this.pressNow = 1;
			_this.isMove = _this.rc;
		}

		function onKeyUp(e) {
			if (!_this.enable) return;
			_this.pressed[e.keyCode] = false;
			_this.key_release = e.keyCode;
			_this.released = 2;
			_this.isMove = _this.rc;
		}

		function mMove(e) {
			offset = getOffset(DOM);
			_this.x = ((e.pageX - offset.left) / DOM.clientWidth * 2 - 1);
			_this.y = -((e.pageY - offset.top) / DOM.clientHeight * 2 - 1);
			_this.xs = e.pageX - offset.left;
			_this.ys = e.pageY - offset.top;

			_this.isMove = _this.rc;
		}

		function mDown(e) {
			if (_this.skipClick)  return;

			var mb = e.which;
			_this.mbDown[mb] = true;
			_this.mbUp[mb] = false;
			_this.mbClick[mb] = 0;
			_this.mbDownNow[mb] = 3;
			_this.objDown = _this.under;
		}

		function mUp(e) {

			if (_this.skipClick) {
				_this.skipClick = 0;
				return;
			}

			var mb = e.which;
			_this.mbDown[mb] = false;
			_this.mbUp[mb] = true;
			_this.objUp = _this.under;
			if (_this.modeGreed) {
				_this.mbClick[mb] = _this.isEqual ? 2 : 0;
			} else {
				_this.mbClick[mb] = 2;
			}
		}

		function mOver(e) {
			_this.over = true;
			_this.out = false;
			_this.it = _this.DOM;
		}

		function mWheel(e) {
			_this.isMove = _this.rc;
			_this.wheelDelta = e.wheelDelta ? e.wheelDelta : -e.detail;
		}

		function mOut(e) {
			_this.over = false;
			_this.it = null;
			_this.out = true;

//	    _this.mbClick = [0,0,0,0];
//	    _this.mbDown = [false,false,false,false];
//	    _this.mbDownNow = [0,0,0,0];
//	    _this.mbUp = [true,true,true,true];
		}

		function getOffset(elem) {
			if (elem.getBoundingClientRect) {
				// "правильный" вариант
				return getOffsetRect(elem)
			} else {
				// пусть работает хоть как-то
				return getOffsetSum(elem)
			}
		}

		function getOffsetSum(elem) {
			var top = 0, left = 0
			while (elem) {
				top = top + parseInt(elem.offsetTop)
				left = left + parseInt(elem.offsetLeft)
				elem = elem.offsetParent
			}

			return {top: top, left: left}
		}

		function getOffsetRect(element) {
			var box = element.getBoundingClientRect()

			var body = document.body
			var docElem = document.documentElement

			var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop
			var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft

			var clientTop = docElem.clientTop || body.clientTop || 0
			var clientLeft = docElem.clientLeft || body.clientLeft || 0

			var top = box.top + scrollTop - clientTop
			var left = box.left + scrollLeft - clientLeft

			return { top: Math.round(top), left: Math.round(left) }
		}

	}

	setUnder(obj) {
		this.under = obj;
	}

	reset() {
		var ode = document.createEvent('MouseEvents');
		ode.initMouseEvent('mouseup', true, true, window, 1, 0, 0, 0, 0, false, false, true, false, 0, null);
		document.dispatchEvent(ode);
	}

	update() {

		this.dx = (this.xLast - this.xs) * -1;
		this.dy = (this.yLast - this.ys) * -1;
		this.xLast = this.xs;
		this.yLast = this.ys;

		this.isEqual = this.objDown === this.under;

		if (this.mbClick[1]) this.mbClick[1]--;
		if (this.mbClick[2]) this.mbClick[2]--;
		if (this.mbClick[3]) this.mbClick[3]--;
		if (this.mbDownNow[1]) this.mbDownNow[1]--;
		if (this.mbDownNow[2]) this.mbDownNow[2]--;
		if (this.mbDownNow[3]) this.mbDownNow[3]--;
		if (this.released) this.released--; else this.key_release = 0;
		if (this.pressNow) this.pressNow--;

		if (this.isMove)
			this.isMove--;

		this.wheelDelta = 0;
	}

	isPressNow(keyCode) {
		return (this.pressNow > 0) ? this.pressed[keyCode] : 0;
	}

	isPress(keyCode) {
		return this.pressed[keyCode] == true;
	}

	isRelease(key) {
		return (this.released != 0) && (key == this.key_release);
	}

	getState(key) {
		return this.pressed[key.charCodeAt(0)];
	}

	toString() {
		return    'code: ' + this.event.keyCode + ' char: ' + String.fromCharCode(this.event.keyCode) +
			(this.event.keyCode == undefined ? 'undefined' : '') +
			(this.event.shiftKey ? ' shift' : '') +
			(this.event.ctrlKey ? ' ctrl' : '') +
			(this.event.altKey ? ' alt' : '') +
			(this.event.metaKey ? ' meta' : '');
	}

}