/**
 * Created by Магистр on 14.09.2016.
 */

class camera extends Matrix4 {

	constructor(eye, target, up) {


		super(eye.length>4?eye:undefined);

		this.vtmp = new Vector3();

		this.vFRW = new Vector3();
		this.vLEFT = new Vector3();
		this.vUP = new Vector3();

		this.EPS = 0.000001;
		this.sign = 1;
		this.theta = 0;
		this.phi = 0;
		this.r = 0;

		this.eye = new Vector3(eye);
		this.target = new Vector3(target);
		this.up = new Vector3((up == undefined) ? [0, -1, 0] : up);

		// выставляем правильный угол наблюдения
		let vec = this.eye.clone().sub(this.target);
		let len = Math.sqrt(vec[0] * vec[0] + vec[2] * vec[2]);
		this.theta = Math.atan2(vec[0], vec[2]);
		this.phi = Math.atan2(vec[1], len) + Math.PI / 2;

		this.lookAt(this.eye, this.target, this.up);
	}

	orbitControl(input) {

		if (input.isPress(input.KEY_SHIFT)) {
			if (input.wheelDelta)
				this.zoom(-input.wheelDelta / 500);

			if (input.mbDown[2])
				this.zoom(input.dy / 100);

			if (input.mbDown[1])
				this.orbitRotate(-input.dx / 100, input.dy / 100);

			if (input.mbDown[3])
				this.pan(-input.dx / 100, input.dy / 100);
		}

		return this;
	}

	zoom(dxd) {
		this.vFRW.sub(this.target, this.eye);
		this.eye.add(this.vFRW.mulScalar(dxd));

		this.lookAt(this.eye, this.target, this.up);
	}

	orbitRotate(dx, dy) {
		this.theta -= dx * this.sign;
		this.phi -= dy;

		if (this.phi > Math.PI * 2) this.phi = this.EPS;
		if (this.phi < 0) this.phi = Math.PI * 2;
		if (this.phi == 0) this.phi = this.EPS;
		if (this.phi == Math.PI * 2) this.phi = (Math.PI * 2) - this.EPS;

		this.r = this.vtmp.sub(this.eye, this.target).length();

		let x = this.r * Math.sin(this.phi) * Math.sin(this.theta);
		let z = this.r * Math.sin(this.phi) * Math.cos(this.theta);
		let y = this.r * Math.cos(this.phi);

		this.eye.set([x + this.target[0], y + this.target[1], z + this.target[2]]);

		if ((this.phi >= 0) && (this.phi < Math.PI)) {
			this.up.set([0, 1, 0]);
			this.sign = 1;
		}
		if ((this.phi > Math.PI) && (this.phi <= Math.PI * 2 - this.EPS)) {
			this.up.set([0, -1, 0]);
			this.sign = -1;
		}

		this.lookAt(this.eye, this.target, this.up);
	}

	pan(dx, dy) {
		this.vFRW.sub(this.eye, this.target);
		this.vLEFT.cross(this.vFRW, this.up);
		this.vLEFT.normalize();

		this.vUP.cross(this.vFRW, this.vLEFT);
		this.vUP.normalize();

		let leftOff = this.vLEFT.mulScalar(-dx);
		let upOff = this.vUP.mulScalar(dy);

		this.target.sub(leftOff);
		this.eye.sub(leftOff);

		this.target.sub(upOff);
		this.eye.sub(upOff);

		this.lookAt(this.eye, this.target, this.up);
	}

}