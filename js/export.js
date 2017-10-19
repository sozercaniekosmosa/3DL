/**
 * Created by Магистр on 21.09.2016.
 */


let exporter = {}
exporter.ajax = function (uri, callback) {

	var http = new XMLHttpRequest();

	http.onreadystatechange = function () {
		if (http.readyState == 4 && http.status == 200) callback(http.responseText);
	}
	http.open("GET", uri, true);
	http.send();

}
exporter.parseAsObj = function (data, tempRes) {
	let val;
	let et = {};
	let inx = 0;
	let struct = '';

	let regPatt = {
		vpos:     /v( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/g,
		npos:     /vn( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/g,
		tpos:     /vt( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/g,
		face_v:   /f( +-?\d+)( +-?\d+)( +-?\d+)/g,
		face_vt:  /f +(-?\d+)\/(-?\d+) +(-?\d+)\/(-?\d+) +(-?\d+)\/(-?\d+)/g,
		face_vn:  /f +(-?\d+)\/\/(-?\d+) +(-?\d+)\/\/(-?\d+) +(-?\d+)\/\/(-?\d+)/g,
		face_vtn: /f +(-?\d+)\/(-?\d+)\/(-?\d+) +(-?\d+)\/(-?\d+)\/(-?\d+) +(-?\d+)\/(-?\d+)\/(-?\d+)/g
	}

	let fill = (dest, src, face, field, beginIndex, countItem) => {
		for (let ptr = beginIndex; ptr < beginIndex + countItem * 3; ptr += countItem)
			dest[field].push(src[field][face[ptr] - 1]);
	}

	let tempVTN = {vpos: [], npos: [], tpos: []};
	let tempRawVTN = {
		vpos: [],
		tpos: [],
		npos: [],
		face: []
	};

	tempRes.vpos = [];
	tempRes.tpos = [];
	tempRes.npos = [];
	tempRes.face = [];

	for (let reg in regPatt) {
		while (val = regPatt[reg].exec(data)) {

			switch (reg) {
				case 'vpos':
					tempVTN[reg].push({x: val[1], y: val[2], z: val[3]});
					break;
				case 'npos':
					tempVTN[reg].push({x: val[1], y: val[2], z: val[3]});
					break;
				case 'tpos':
					tempVTN[reg].push({x: val[1], y: val[2]});
					break;
				case 'face_v':
					struct = 'face_v';
					fill(tempRawVTN, tempVTN, val, 'vpos', 1, 3);
					break;
				case 'face_vt':
					struct = 'face_vt';
					fill(tempRawVTN, tempVTN, val, 'vpos', 1, 3);
					fill(tempRawVTN, tempVTN, val, 'tpos', 2, 3);
					break;
				case 'face_vn':
					struct = 'face_vn';
					fill(tempRawVTN, tempVTN, val, 'vpos', 1, 3);
					fill(tempRawVTN, tempVTN, val, 'tpos', 2, 3);
					break;
				case 'face_vtn':
					struct = 'face_vtn';
					fill(tempRawVTN, tempVTN, val, 'vpos', 1, 3);
					fill(tempRawVTN, tempVTN, val, 'tpos', 2, 3);
					fill(tempRawVTN, tempVTN, val, 'npos', 3, 3);
					break;
			}
		}
	}

	for (let i = 0; i < tempRawVTN.vpos.length; i++) {
		let v = tempRawVTN.vpos[i];
		let t = tempRawVTN.tpos[i];
		let n = tempRawVTN.npos[i];

		let field = v.x + v.y + v.z + t.x + t.y + n.x + n.y + n.z;

		if (et[field] == undefined) {
			et[field] = inx;
			tempRes.face.push(inx);

			switch (struct) {
				case 'face_v':
					tempRes['vpos'].push(parseFloat(v.x), parseFloat(v.y), parseFloat(v.z));
					break;
				case 'face_vt':
					tempRes['vpos'].push(parseFloat(v.x), parseFloat(v.y), parseFloat(v.z));
					tempRes['tpos'].push(parseFloat(t.x), parseFloat(t.y));
					break;
				case 'face_vn':
					tempRes['vpos'].push(parseFloat(v.x), parseFloat(v.y), parseFloat(v.z));
					tempRes['npos'].push(parseFloat(n.x), parseFloat(n.y), parseFloat(n.z));
					break;
				case 'face_vtn':
					tempRes['vpos'].push(parseFloat(v.x), parseFloat(v.y), parseFloat(v.z));
					tempRes['tpos'].push(parseFloat(t.x), parseFloat(t.y));
					tempRes['npos'].push(parseFloat(n.x), parseFloat(n.y), parseFloat(n.z));
					break;
			}

			inx++;
		} else {
			tempRes.face.push(et[field]);
		}

	}

	return tempRes;
},

/**
 * @param {String} uri
 */
exporter.loadObject = function (uri) {
	let res = [];
	let ix = 0;
	let len;

	if (uri instanceof Array) {
		len = uri.length;
	} else {
		len = 1;
		uri = [uri];
	}

	for (var i = 0; i < len; i++) res[i] = new Object({export:true});

	iterCallback();

	function iterCallback(data) {
		if (data) {
			exporter.parseAsObj(data, res[ix]);//TODO: сделать определение парсера по расширению
			if(res[ix].callback) res[ix].callback(res[ix]);
			ix++
		}
		if (len--) {
			exporter.ajax(uri.shift(), iterCallback);
		}
	}

	return (res.length==1)?res[0]:res;

}

/**
 * @param {String} uri
 * @param {Array} callback
 */
exporter.loadObjectCall = function (uri, callback) {
	let res = [];
	let len;

	if (uri instanceof Array) {
		len = uri.length;
		iterCallback();
	} else {
		len = 1;
		uri = [uri];
		iterCallback();
	}


	function iterCallback(data) {
		if (data){
			let tempRes = {};
			exporter.parseAsObj(data, tempRes)
			res.push(tempRes); //TODO: сделать определение парсера по расширению
		}
		if (len--) {
			exporter.ajax(uri.shift(), iterCallback);
		} else {
			callback(res);
		}
	}

}
