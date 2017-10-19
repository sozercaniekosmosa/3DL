/**
 * Created by Магистр on 17.10.2017.
 */

function setScale(obj){
	if(obj.name == 'scale-x') e.scale[0] = obj.value;
	if(obj.name == 'scale-y') e.scale[1] = obj.value;
	if(obj.name == 'scale-z') e.scale[2] = obj.value;
}

function Engine3DL() {

	var self = this;

	var scrW = window.innerWidth;
	var scrH = window.innerHeight;

	var scaleX = document.querySelector('#scale-x');
	var scaleY = document.querySelector('#scale-y');
	var scaleZ = document.querySelector('#scale-z');

	var canvas = document.getElementById('surface');
	var ctx = canvas.getContext('2d');

	ctx.canvas.width = scrW;
	ctx.canvas.height = scrH;

	var inp = new input('canvas');

	var vtx = [];
	var vecA = new Vector3();
	var vecB = new Vector3();
	var vecC = new Vector3();
	var mat = new Matrix4();
	var mObj = new Matrix4();
	var mCam = new camera([0, 0, 2], [0, 0, 0], [0, 1, 0]);
	var scale = new Vector3([1, 1, 1]);
	self.scale = scale;

	function trangel(a, b, c, ctx) {

		ctx.fillStyle = 'rgba(0,0,0,.3)';
		ctx.strokeStyle = 'black';
		ctx.beginPath();

		ctx.moveTo(a[0], a[1]);
		ctx.lineTo(b[0], b[1]);
		ctx.lineTo(c[0], c[1]);
		ctx.lineTo(a[0], a[1]);

		ctx.fill();
		ctx.stroke();

	}


	function render() {

		if(scaleX.value == 0) scaleX.value = 0.1;
		if(scaleY.value == 0) scaleY.value = 0.1;
		if(scaleZ.value == 0) scaleZ.value = 0.1;

		scale[0] = scaleX.value;
		scale[1] = scaleY.value;
		scale[2] = scaleZ.value;

		ctx.clearRect(0, 0, scrW, scrH);
		ctx.font = "30px Verdana";
		ctx.fillText('камера: shift + drag mouse', 10, 40);
		ctx.fillStyle = 'rgba(0,0,0,.4)';

		mCam.orbitControl(inp); // обновим позицию камеры

		// пройдемся по всем вершинам
		for (var i = 0; i < vtx.length; i += 3) {
			// сформируем поверхность треугольника
			vecA.set(vtx[i + 0]);
			vecB.set(vtx[i + 1]);
			vecC.set(vtx[i + 2]);

			mat.identity();
			mObj.rotateAxis(0.002, [0, 1, 0]); // повернем объект "L" на некоторый угол
			mat.mul(mCam, mObj); // применим позицию камеры к позиции объекта
			mat = mat.scale(scale); // применим масштабирование к результатирующей матрице

			// применим результ. матрицу к каждой вершине треугольника
			vecA.mulMat4(mat);
			vecB.mulMat4(mat);
			vecC.mulMat4(mat);

			// переведем однородные координаты в декартовы для проекции
			homogenToDecart(vecA);
			homogenToDecart(vecB);
			homogenToDecart(vecC);

			// переместим начало системы коорд. в центр экрана
			applyViewport(vecA);
			applyViewport(vecB);
			applyViewport(vecC);

			// отрисуем треугольник
			trangel(vecA, vecB, vecC, ctx);
		}
		inp.update(); // обновить систему ввода

		requestAnimationFrame(render, null);
	}

	function homogenToDecart(vec) {
		var dist = 300;
		var k = dist / vec[2];
		vec.mulScalar(k);
		return vec
	}

	function applyViewport(vec) {
		vec.add([scrW / 2, scrH / 2, 0]);
		return vec
	}

//  экспортер будет работать только из под сервера ограничение браузера связано с безопасностью
//	exporter.loadObjectCall('L2.obj', function (res) {
//
//		var face = res[0].face;
//		var pos = res[0].vpos;
//
//		for (var f = 0; f < face.length; f++) {
//			vtx.push([pos[face[f] * 3 + 0], pos[face[f] * 3 + 1], pos[face[f] * 3 + 2]]);
//		}
//
//		render();
//	});

	// тут задается модель символа - "L"
	vtx = [[-0.116528,-0.088745,0.133],[0.053472,0.665255,0.133],[-0.116528,0.665255,0.133],[-0.116528,-0.088745,0.133],[0.053472,0.071255,0.133],[0.053472,0.665255,0.133],[-0.116528,-0.088745,0.133],[0.361472,0.071255,0.133],[0.053472,0.071255,0.133],[-0.116528,-0.088745,0.133],[0.361472,-0.088745,0.133],[0.361472,0.071255,0.133],[0.053472,0.665255,-0.133],[-0.116528,-0.088745,-0.133],[-0.116528,0.665255,-0.133],[0.053472,0.071255,-0.133],[-0.116528,-0.088745,-0.133],[0.053472,0.665255,-0.133],[0.361472,0.071255,-0.133],[-0.116528,-0.088745,-0.133],[0.053472,0.071255,-0.133],[0.361472,-0.088745,-0.133],[-0.116528,-0.088745,-0.133],[0.361472,0.071255,-0.133],[0.389472,0.099255,-0.105],[0.389472,-0.116745,-0.105],[0.361472,-0.088745,-0.133],[0.389472,-0.116745,-0.105],[-0.144528,-0.116745,-0.105],[-0.116528,-0.088745,-0.133],[-0.144528,-0.116745,-0.105],[-0.144528,0.693255,-0.105],[-0.116528,0.665255,-0.133],[-0.144528,0.693255,-0.105],[0.081472,0.693255,-0.105],[0.053472,0.665255,-0.133],[0.081472,0.693255,-0.105],[0.081472,0.099255,-0.105],[0.053472,0.071255,-0.133],[0.081472,0.099255,-0.105],[0.389472,0.099255,-0.105],[0.361472,0.071255,-0.133],[0.389472,0.099255,0.105],[0.389472,-0.116745,0.105],[0.389472,-0.116745,-0.105],[0.389472,-0.116745,0.105],[-0.144528,-0.116745,0.105],[-0.144528,-0.116745,-0.105],[-0.144528,-0.116745,0.105],[-0.144528,0.693255,0.105],[-0.144528,0.693255,-0.105],[-0.144528,0.693255,0.105],[0.081472,0.693255,0.105],[0.081472,0.693255,-0.105],[0.081472,0.693255,0.105],[0.081472,0.099255,0.105],[0.081472,0.099255,-0.105],[0.081472,0.099255,0.105],[0.389472,0.099255,0.105],[0.389472,0.099255,-0.105],[0.361472,0.071255,0.133],[0.361472,-0.088745,0.133],[0.389472,-0.116745,0.105],[0.361472,-0.088745,0.133],[-0.116528,-0.088745,0.133],[-0.144528,-0.116745,0.105],[-0.116528,-0.088745,0.133],[-0.116528,0.665255,0.133],[-0.144528,0.693255,0.105],[-0.116528,0.665255,0.133],[0.053472,0.665255,0.133],[0.081472,0.693255,0.105],[0.053472,0.665255,0.133],[0.053472,0.071255,0.133],[0.081472,0.099255,0.105],[0.053472,0.071255,0.133],[0.361472,0.071255,0.133],[0.389472,0.099255,0.105]];
	render();

	return self;
}

e = new Engine3DL();