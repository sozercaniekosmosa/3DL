/**
 * Created by Магистр on 04.09.2016.
 */

'use strict'

class Matrix4 extends Float32Array {

	constructor(m) {

		if (m !== undefined) {

			super(m);

		} else {

			super([
				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1
			]);

		}

		this['DEG2RAD'] = Math.PI / 180;
		this['RAD2DEG'] = 180 / Math.PI;
		this['EPSILON'] = 0.000001;
	}

	set(m) {

		let it = this;

		it[0] = m[0], it[4] = m[4], it[8] = m[8], it[12] = m[12];
		it[1] = m[1], it[5] = m[5], it[9] = m[9], it[13] = m[13];
		it[2] = m[2], it[6] = m[6], it[10] = m[10], it[14] = m[14];
		it[3] = m[3], it[7] = m[7], it[11] = m[11], it[15] = m[15];

		return this;
	}

	clone() {
		return new this.constructor(this);
	}

	copyPosition(m) {

		let it = this;
		if (m === undefined) throw new Error('Ошибка! Нет входной переменной');

		it[12] = m[12];
		it[13] = m[13];
		it[14] = m[14];

		return this;

	}

	identity() {

		let it = this;

		it[0] = 1, it[4] = 0, it[8] = 0, it[12] = 0;
		it[1] = 0, it[5] = 1, it[9] = 0, it[13] = 0;
		it[2] = 0, it[6] = 0, it[10] = 1, it[14] = 0;
		it[3] = 0, it[7] = 0, it[11] = 0, it[15] = 1;

		return this;

	}


	copyPosition(m) {

		let e = this;

		e[12] = m[12];
		e[13] = m[13];
		e[14] = m[14];

		return this;

	}

	extractRotation(m) {
		let v = new Vector3();
		let e = this;

		let scaleX = 1 / v.setFromMatrixColumn(m, 0).length();
		let scaleY = 1 / v.setFromMatrixColumn(m, 1).length();
		let scaleZ = 1 / v.setFromMatrixColumn(m, 2).length();

		e[0] = m[0] * scaleX;
		e[1] = m[1] * scaleX;
		e[2] = m[2] * scaleX;

		e[4] = m[4] * scaleY;
		e[5] = m[5] * scaleY;
		e[6] = m[6] * scaleY;

		e[8] = m[8] * scaleZ;
		e[9] = m[9] * scaleZ;
		e[10] = m[10] * scaleZ;

		return this;
	}

	transpose() {

		let e = this;
		let tmp;

		tmp = e[1], e[1] = e[4], e[4] = tmp;
		tmp = e[2], e[2] = e[8], e[8] = tmp;
		tmp = e[6], e[6] = e[9], e[9] = tmp;

		tmp = e[3], e[3] = e[12], e[12] = tmp;
		tmp = e[7], e[7] = e[13], e[13] = tmp;
		tmp = e[11], e[11] = e[14], e[14] = tmp;

		return this;

	}


	/**
	 @param {Float32Array} v
	 @return {Matrix4} out
	 */
		translate(v) {
		let it = this;

		it[12] = it[0] * v[0] + it[4] * v[1] + it[8] * v[2] + it[12];
		it[13] = it[1] * v[0] + it[5] * v[1] + it[9] * v[2] + it[13];
		it[14] = it[2] * v[0] + it[6] * v[1] + it[10] * v[2] + it[14];
		it[15] = it[3] * v[0] + it[7] * v[1] + it[11] * v[2] + it[15];


		return this;

	}

	/**
	 @param {Float32Array} v
	 @return {Matrix4} out
	 */
		setPosition(v) {

		let e = this;

		e[12] = v[0];
		e[13] = v[1];
		e[14] = v[2];

		return this;

	}

	/**
	 * @param {Number} ang the angle to rotateAxis the matrix by
	 * @param {Vector3} axis the axis to rotateAxis around
	 * @returns {Matrix4} out
	 */
		rotateAxis(ang, axis) {
		let m = this;
		var x = axis[0], y = axis[1], z = axis[2],
		    len = Math.sqrt(x * x + y * y + z * z),
		    s, c, t,
		    a00, a01, a02, a03,
		    a10, a11, a12, a13,
		    a20, a21, a22, a23,
		    b00, b01, b02,
		    b10, b11, b12,
		    b20, b21, b22;

		if (Math.abs(len) < this.EPSILON) return null;

		len = 1 / len;
		x *= len, y *= len, z *= len;

		s = Math.sin(ang);
		c = Math.cos(ang);
		t = 1 - c;

		a00 = m[0];
		a01 = m[1];
		a02 = m[2];
		a03 = m[3];
		a10 = m[4];
		a11 = m[5];
		a12 = m[6];
		a13 = m[7];
		a20 = m[8];
		a21 = m[9];
		a22 = m[10];
		a23 = m[11];

		b00 = x * x * t + c;
		b01 = y * x * t + z * s;
		b02 = z * x * t - y * s;
		b10 = x * y * t - z * s;
		b11 = y * y * t + c;
		b12 = z * y * t + x * s;
		b20 = x * z * t + y * s;
		b21 = y * z * t - x * s;
		b22 = z * z * t + c;

		m[0] = a00 * b00 + a10 * b01 + a20 * b02;
		m[1] = a01 * b00 + a11 * b01 + a21 * b02;
		m[2] = a02 * b00 + a12 * b01 + a22 * b02;
		m[3] = a03 * b00 + a13 * b01 + a23 * b02;
		m[4] = a00 * b10 + a10 * b11 + a20 * b12;
		m[5] = a01 * b10 + a11 * b11 + a21 * b12;
		m[6] = a02 * b10 + a12 * b11 + a22 * b12;
		m[7] = a03 * b10 + a13 * b11 + a23 * b12;
		m[8] = a00 * b20 + a10 * b21 + a20 * b22;
		m[9] = a01 * b20 + a11 * b21 + a21 * b22;
		m[10] = a02 * b20 + a12 * b21 + a22 * b22;
		m[11] = a03 * b20 + a13 * b21 + a23 * b22;

		if (m !== m) {
			m[12] = m[12];
			m[13] = m[13];
			m[14] = m[14];
			m[15] = m[15];
		}
		return m;
	}

	/**
	 * @param {Vector3} axis the axis to scale
	 * @returns {Matrix4} out
	 */
	scale(v) {
		let x = v[0], y = v[1], z = v[2];

		this[ 0 ] *= x, this[ 4 ] *= y, this[ 8 ] *= z;
		this[ 1 ] *= x, this[ 5 ] *= y, this[ 9 ] *= z;
		this[ 2 ] *= x, this[ 6 ] *= y, this[ 10 ] *= z;
		this[ 3 ] *= x, this[ 7 ] *= y, this[ 11 ] *= z;

		return this;
	}

	/**
	 @param {Float32Array} q
	 @return {Matrix4}
	 */
		rotationFromQuaternion(q) {

		let it = this;

		let xa = q[0], ya = q[1], za = q[2], w = q[3];
		let xb = xa + xa, yb = ya + ya, zb = za + za;
		let xx = xa * xb, xy = xa * yb, xz = xa * zb;
		let yy = ya * yb, yz = ya * zb, zz = za * zb;
		let wx = w * xb, wy = w * yb, wz = w * zb;

		it[0] = 1 - ( yy + zz );
		it[4] = xy - wz;
		it[8] = xz + wy;

		it[1] = xy + wz;
		it[5] = 1 - ( xx + zz );
		it[9] = yz - wx;

		it[2] = xz - wy;
		it[6] = yz + wx;
		it[10] = 1 - ( xx + yy );

		it[3] = 0;
		it[7] = 0;
		it[11] = 0;

		it[12] = 0;
		it[13] = 0;
		it[14] = 0;
		it[15] = 1;

		return this;

	}

	/**
	 @param {Float32Array} eye
	 @param {Float32Array} target
	 @param {Float32Array} up
	 @return {Matrix4}
	 */
		lookAt(eye, trg, up) {
		let x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
		eyeX = eye[0],
		eyeY = eye[1],
		eyeZ = eye[2],
		upX = up[0],
		upY = up[1],
		upZ = up[2],
		trgX = trg[0],
		trgY = trg[1],
		trgZ = trg[2];

		if (Math.abs(eyeX - trgX) < this.EPSILON &&
			Math.abs(eyeY - trgY) < this.EPSILON &&
			Math.abs(eyeZ - trgZ) < this.EPSILON) {
			return this.identity();
		}

		z0 = eyeX - trgX;
		z1 = eyeY - trgY;
		z2 = eyeZ - trgZ;

		len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
		z0 *= len;
		z1 *= len;
		z2 *= len;

		x0 = upY * z2 - upZ * z1;
		x1 = upZ * z0 - upX * z2;
		x2 = upX * z1 - upY * z0;
		len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
		if (!len) {
			x0 = 0;
			x1 = 0;
			x2 = 0;
		} else {
			len = 1 / len;
			x0 *= len;
			x1 *= len;
			x2 *= len;
		}

		y0 = z1 * x2 - z2 * x1;
		y1 = z2 * x0 - z0 * x2;
		y2 = z0 * x1 - z1 * x0;

		len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
		if (!len) {
			y0 = 0;
			y1 = 0;
			y2 = 0;
		} else {
			len = 1 / len;
			y0 *= len;
			y1 *= len;
			y2 *= len;
		}

		let it = this;

		it[0] = x0;
		it[1] = y0;
		it[2] = z0;
		it[3] = 0;
		it[4] = x1;
		it[5] = y1;
		it[6] = z1;
		it[7] = 0;
		it[8] = x2;
		it[9] = y2;
		it[10] = z2;
		it[11] = 0;
		it[12] = -(x0 * eyeX + x1 * eyeY + x2 * eyeZ);
		it[13] = -(y0 * eyeX + y1 * eyeY + y2 * eyeZ);
		it[14] = -(z0 * eyeX + z1 * eyeY + z2 * eyeZ);
		it[15] = 1;

		return it;
	}

	/**
	 @param {Float32Array} a
	 @param {Float32Array} b
	 @return {Matrix4}
	 */
		mul(a, b) {

		let A = a;
		let B = (b === undefined) ? this.clone() : b;
		let it = this;

		it[0] = A[0] * B[0] + A[4] * B[1] + A[8] * B[2] + A[12] * B[3];
		it[4] = A[0] * B[4] + A[4] * B[5] + A[8] * B[6] + A[12] * B[7];
		it[8] = A[0] * B[8] + A[4] * B[9] + A[8] * B[10] + A[12] * B[11];
		it[12] = A[0] * B[12] + A[4] * B[13] + A[8] * B[14] + A[12] * B[15];

		it[1] = A[1] * B[0] + A[5] * B[1] + A[9] * B[2] + A[13] * B[3];
		it[5] = A[1] * B[4] + A[5] * B[5] + A[9] * B[6] + A[13] * B[7];
		it[9] = A[1] * B[8] + A[5] * B[9] + A[9] * B[10] + A[13] * B[11];
		it[13] = A[1] * B[12] + A[5] * B[13] + A[9] * B[14] + A[13] * B[15];

		it[2] = A[2] * B[0] + A[6] * B[1] + A[10] * B[2] + A[14] * B[3];
		it[6] = A[2] * B[4] + A[6] * B[5] + A[10] * B[6] + A[14] * B[7];
		it[10] = A[2] * B[8] + A[6] * B[9] + A[10] * B[10] + A[14] * B[11];
		it[14] = A[2] * B[12] + A[6] * B[13] + A[10] * B[14] + A[14] * B[15];

		it[3] = A[3] * B[0] + A[7] * B[1] + A[11] * B[2] + A[15] * B[3];
		it[7] = A[3] * B[4] + A[7] * B[5] + A[11] * B[6] + A[15] * B[7];
		it[11] = A[3] * B[8] + A[7] * B[9] + A[11] * B[10] + A[15] * B[11];
		it[15] = A[3] * B[12] + A[7] * B[13] + A[11] * B[14] + A[15] * B[15];

		return this;

	}

	/**
	 @param {Float} s
	 @return {Matrix4}
	 */
		mulScalar(s) {

		let it = this;

		it[0] *= s, it[4] *= s, it[8] *= s, it[12] *= s;
		it[1] *= s, it[5] *= s, it[9] *= s, it[13] *= s;
		it[2] *= s, it[6] *= s, it[10] *= s, it[14] *= s;
		it[3] *= s, it[7] *= s, it[11] *= s, it[15] *= s;

		return this;

	}

	/**
	 @param {Matrix4} m
	 @return {Matrix4}
	 */
		inverse() {

		let m = this;

		var a00 = m[0], a01 = m[1], a02 = m[2], a03 = m[3],
		    a10 = m[4], a11 = m[5], a12 = m[6], a13 = m[7],
		    a20 = m[8], a21 = m[9], a22 = m[10], a23 = m[11],
		    a30 = m[12], a31 = m[13], a32 = m[14], a33 = m[15],

		    b00 = a00 * a11 - a01 * a10,
		    b01 = a00 * a12 - a02 * a10,
		    b02 = a00 * a13 - a03 * a10,
		    b03 = a01 * a12 - a02 * a11,
		    b04 = a01 * a13 - a03 * a11,
		    b05 = a02 * a13 - a03 * a12,
		    b06 = a20 * a31 - a21 * a30,
		    b07 = a20 * a32 - a22 * a30,
		    b08 = a20 * a33 - a23 * a30,
		    b09 = a21 * a32 - a22 * a31,
		    b10 = a21 * a33 - a23 * a31,
		    b11 = a22 * a33 - a23 * a32,

		    // Calculate the determinant
		    det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

		if (!det) {
			return null;
		}
		det = 1.0 / det;

		var out = new Matrix4();

		out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
		out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
		out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
		out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
		out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
		out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
		out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
		out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
		out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
		out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
		out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
		out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
		out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
		out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
		out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
		out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

		return out;

	}

	/**
	 @param {Float} left
	 @param {Float} right
	 @param {Float} bottom
	 @param {Float} top
	 @param {Float} near
	 @param {Float} far
	 @return {Matrix4}
	 */
		frustum(left, right, bottom, top, near, far) {

		let it = this;
		let x = 2 * near / ( right - left );
		let y = 2 * near / ( top - bottom );

		let a = ( right + left ) / ( right - left );
		let b = ( top + bottom ) / ( top - bottom );
		let c = -( far + near ) / ( far - near );
		let d = -2 * far * near / ( far - near );

		it[0] = x, it[4] = 0, it[8] = a, it[12] = 0;
		it[1] = 0, it[5] = y, it[9] = b, it[13] = 0;
		it[2] = 0, it[6] = 0, it[10] = c, it[14] = d;
		it[3] = 0, it[7] = 0, it[11] = -1, it[15] = 0;

		return this;

	}

	/**
	 @param {Float} left
	 @param {Float} right
	 @param {Float} bottom
	 @param {Float} top
	 @param {Float} near
	 @param {Float} far
	 @return {Matrix4}
	 */
		orthographic(left, right, top, bottom, near, far) {

		let it = this;
		let w = 1.0 / ( right - left );
		let h = 1.0 / ( top - bottom );
		let p = 1.0 / ( far - near );

		let x = ( right + left ) * w;
		let y = ( top + bottom ) * h;
		let z = ( far + near ) * p;

		it[0] = 2 * w, it[4] = 0, it[8] = 0, it[12] = -x;
		it[1] = 0, it[5] = 2 * h, it[9] = 0, it[13] = -y;
		it[2] = 0, it[6] = 0, it[10] = -2 * p, it[14] = -z;
		it[3] = 0, it[7] = 0, it[11] = 0, it[15] = 1;

		return this;

	}

	/**
	 @param {Float} fov
	 @param {Float} aspect
	 @param {Float} near
	 @param {Float} far
	 @return {Matrix4}
	 */
// perspective(fov, aspect, near, far) {
//
//		let tanHalfFOV = near * Math.tan(this.DEG2RAD * fov / 2);
//		let range = near - far;
//
//		this[0] = 1.0 / (tanHalfFOV * aspect);
//		this[1] = 0.0;
//		this[2] = 0.0;
//		this[3] = 0.0;
//
//		this[4] = 0.0;
//		this[5] = 1.0 / tanHalfFOV;
//		this[6] = 0.0;
//		this[7] = 0.0;
//
//		this[8] = 0.0;
//		this[9] = 0.0;
//		this[10] = (-near - far) / range;
//		this[11] = 2.0 * far * near / range;
//
//		this[12] = 0.0;
//		this[13] = 0.0;
//		this[14] = 1.0;
//		this[15] = 0.0;
//
//		return this;
//
//	}
		perspective(fov, aspect, near, far) {

		let ymx = near * Math.tan(this.DEG2RAD * fov / 2);
		let ymn = -ymx;
		let xmn = ymn * aspect;
		let xmx = ymx * aspect;

		return this.frustum(xmn, xmx, ymn, ymx, near, far);
	}

//	perspective(fov, aspect, near, far) {
//		var f = 1.0 / Math.tan(this.DEG2RAD * fov / 2);
//		var nf = 1 / (near - far);
//
//		this[0] = f / aspect;
//		this[1] = 0;
//		this[2] = 0;
//		this[3] = 0;
//		this[4] = 0;
//		this[5] = f;
//		this[6] = 0;
//		this[7] = 0;
//		this[8] = 0;
//		this[9] = 0;
//		this[10] = (far + near) * nf;
//		this[11] = -1;
//		this[12] = 0;
//		this[13] = 0;
//		this[14] = (2 * far * near) * nf;
//		this[15] = 0;
//		return this;
//	}


	viewport(w, h, zmn, zmx) {

		this[0] = w / 2;
		this[1] = 0;
		this[2] = 0;
		this[3] = 0;
		this[4] = 0;
		this[5] = -h / 2;
		this[6] = 0;
		this[7] = 0;
		this[8] = 0;
		this[9] = 0;
		this[10] = zmx - zmn;
		this[11] = 0;
		this[12] = w / 2;
		this[13] = h / 2;
		this[14] = zmn;
		this[15] = 1;
		return this;
	}

}

class Quaternion extends Float32Array {

	constructor(q) {

		super((q !== undefined) ? q : [0, 0, 0, 1]);

	}

	toString() {
		return ' x:' + Math.floor(this[0] * 100) / 100 + ' y:' + Math.floor(this[1] * 100) / 100 + ' z:' + Math.floor(this[2] * 100) / 100 + ' w:' + Math.floor(this[3] * 100) / 100;
	}

	clone() {
		return new this.constructor(this);
	}

	copy(q) {
		this[0] = q[0];
		this[1] = q[1];
		this[2] = q[2];
		this[3] = q[3];

		return this;
	}

	fromVector(v) {
		this[0] = v[0];
		this[1] = v[1];
		this[2] = v[2];
		this[3] = 0;

		return this;
	}

	fromAxisAngle(axis, ang) {

		let hAng = ang / 2;
		let s = Math.sin(hAng);

		this[0] = axis[0] * s;
		this[1] = axis[1] * s;
		this[2] = axis[2] * s;
		this[3] = Math.cos(hAng);

		return this;
	}


	fromUnitVectors(a, b) {

		let EPS = 0.000001;
		let v = new Vector3();
		let r = a.dot(b) + 1;

		if (r < EPS) {
			r = 0;
			v.set((Math.abs(a[0]) > Math.abs(a[2])) ? [-a[1], a[0], 0] : [0, -a[2], a[1]]);
		} else {
			v.crossVectors(a, b);
		}

		this[0] = v[0];
		this[1] = v[1];
		this[2] = v[2];
		this[3] = r;

		return this.normalize();

	}

	fromRotationMatrix(m) {

		let m11 = m[0], m12 = m[4], m13 = m[8];
		let m21 = m[1], m22 = m[5], m23 = m[9];
		let m31 = m[2], m32 = m[6], m33 = m[10];

		let trace = m11 + m22 + m33;

		let s;

		if (trace > 0) {

			s = 0.5 / Math.sqrt(trace + 1.0);

			this[3] = 0.25 / s;
			this[0] = ( m32 - m23 ) * s;
			this[1] = ( m13 - m31 ) * s;
			this[2] = ( m21 - m12 ) * s;

		} else if (m11 > m22 && m11 > m33) {

			s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);

			this[3] = ( m32 - m23 ) / s;
			this[0] = 0.25 * s;
			this[1] = ( m12 + m21 ) / s;
			this[2] = ( m13 + m31 ) / s;

		} else if (m22 > m33) {

			s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);

			this[3] = ( m13 - m31 ) / s;
			this[0] = ( m12 + m21 ) / s;
			this[1] = 0.25 * s;
			this[2] = ( m23 + m32 ) / s;

		} else {

			s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);

			this[3] = ( m21 - m12 ) / s;
			this[0] = ( m13 + m31 ) / s;
			this[1] = ( m23 + m32 ) / s;
			this[2] = 0.25 * s;

		}

		return this;

	}

	length() {

		return Math.sqrt(this[0] * this[0] + this[1] * this[1] + this[2] * this[2] + this[3] * this[3]);

	}

	conjugate() {

		this[0] *= -1;
		this[1] *= -1;
		this[2] *= -1;

		return this;

	}

	normalize() {

		let len = this.length();

		if (len === 0) {

			this[0] = 0;
			this[1] = 0;
			this[2] = 0;
			this[3] = 1;

		} else {

			len = 1 / len;

			this[0] = this[0] * len;
			this[1] = this[1] * len;
			this[2] = this[2] * len;
			this[3] = this[3] * len;

		}

		return this;

	}

	inverse() {
		return this.conjugate().normalize();
	}

	mul(a, b) {

		if (b == undefined) b = this.clone();

		let qax = a[0], qay = a[1], qaz = a[2], qaw = a[3];
		let qbx = b[0], qby = b[1], qbz = b[2], qbw = b[3];

		this[0] = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
		this[1] = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
		this[2] = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
		this[3] = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

		return this;

	}

	slerp(q, t) {

		if (t === 0) return this;
		if (t === 1) return this.copy(q);

		let x = this[0], y = this[1], z = this[2], w = this[3];

		// http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

		let cosHalfTheta = w * q[3] + x * q[0] + y * q[1] + z * q[2];

		if (cosHalfTheta < 0) {

			this[3] = -q[3];
			this[0] = -q[0];
			this[1] = -q[1];
			this[2] = -q[2];

			cosHalfTheta = -cosHalfTheta;

		} else {

			this.copy(q);

		}

		if (cosHalfTheta >= 1.0) {

			this[3] = w;
			this[0] = x;
			this[1] = y;
			this[2] = z;

			return this;

		}

		let sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);

		if (Math.abs(sinHalfTheta) < 0.001) {

			this[3] = 0.5 * ( w + this[3] );
			this[0] = 0.5 * ( x + this[0] );
			this[1] = 0.5 * ( y + this[1] );
			this[2] = 0.5 * ( z + this[2] );

			return this;

		}

		let halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
		let ratioA = Math.sin(( 1 - t ) * halfTheta) / sinHalfTheta;
		let ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

		this[3] = ( w * ratioA + this[3] * ratioB );
		this[0] = ( x * ratioA + this[0] * ratioB );
		this[1] = ( y * ratioA + this[1] * ratioB );
		this[2] = ( z * ratioA + this[2] * ratioB );

		return this;

	}

}

class Vector3 extends Float32Array {

	constructor(v) {

		super((v !== undefined) ? v : [0, 0, 0, 1]);

	}

	set(v) {
		this[0] = v[0];
		this[1] = v[1];
		this[2] = v[2];

		return this;
	}

	toString() {
		return ' x:' + Math.floor(this[0] * 100) / 100 + ' y:' + Math.floor(this[1] * 100) / 100 + ' z:' + Math.floor(this[2] * 100) / 100;
	}

	equal(v) {
		return this[0] == v[0] && this[1] == v[1] && this[2] == v[2];
	}

	clone() {
		return new this.constructor(this);
	}

	copy(v) {

		this[0] = v[0];
		this[1] = v[1];
		this[2] = v[2];

		return this;

	}

	setFromMatrixColumn(m, index) {

		index *= 4;

		this[0] = m[index + 0];
		this[1] = m[index + 1];
		this[2] = m[index + 2];

		return this;

	}

	add(a, b) {

		b = (b === undefined) ? this.clone() : b;

		this[0] = b[0] + a[0];
		this[1] = b[1] + a[1];
		this[2] = b[2] + a[2];

		return this;

	}

	addScalar(s) {

		this[0] += s;
		this[1] += s;
		this[2] += s;

		return this;

	}

	sub(a, b) {

		b = (b === undefined) ? this.clone() : b;

		this[0] = b[0] - a[0];
		this[1] = b[1] - a[1];
		this[2] = b[2] - a[2];

		return this;

	}

	mul(a, b) {

		b = (b === undefined) ? this.clone() : b;

		this[0] = b[0] * a[0];
		this[1] = b[1] * a[1];
		this[2] = b[2] * a[2];

		return this;
	}

	mulMat4(m) {

		let x = this[0], y = this[1], z = this[2];

		this[0] = m[0] * x + m[4] * y + m[8] * z + m[12];
		this[1] = m[1] * x + m[5] * y + m[9] * z + m[13];
		this[2] = m[2] * x + m[6] * y + m[10] * z + m[14];

		return this;

	}

	mulScalar(scalar) {

		if (isFinite(scalar)) {

			this[0] *= scalar;
			this[1] *= scalar;
			this[2] *= scalar;

		} else {

			this[0] = 0;
			this[1] = 0;
			this[2] = 0;

		}

		return this;

	}

	mulQuat(q) {

		let x = this[0], y = this[1], z = this[2];
		let qx = q[0], qy = q[1], qz = q[2], qw = q[3];

		let ix = qw * x + qy * z - qz * y;
		let iy = qw * y + qz * x - qx * z;
		let iz = qw * z + qx * y - qy * x;
		let iw = -qx * x - qy * y - qz * z;

		this[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
		this[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
		this[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;

		return this;

	}

	divScalar(scalar) {

		return this.mulScalar(1 / scalar);

	}

	applyMatrix4(m) {

		let v = this;

		this[0] = m[0] * v[0] + m[4] * v[1] + m[8] * v[2] + m[12];
		this[1] = m[1] * v[0] + m[5] * v[1] + m[9] * v[2] + m[13];
		this[2] = m[2] * v[0] + m[6] * v[1] + m[10] * v[2] + m[14];

		return this;

	}

	negate() {

		this[0] = -this[0];
		this[1] = -this[1];
		this[2] = -this[2];

		return this;

	}

	dot(v) {

		return this[0] * v[0] + this[1] * v[1] + this[2] * v[2];

	}

	lengthSq() {

		return this[0] * this[0] + this[1] * this[1] + this[2] * this[2];

	}

	length() {

		return Math.sqrt(this[0] * this[0] + this[1] * this[1] + this[2] * this[2]);

	}

	lengthManhattan() {

		return Math.abs(this[0]) + Math.abs(this[1]) + Math.abs(this[2]);

	}

	normalize() {

		return this.divScalar(this.length());

	}

	setLength(length) {

		return this.mulScalar(length / this.length());

	}

	lerp(v, alpha) {

		this[0] += ( v[0] - this[0] ) * alpha;
		this[1] += ( v[1] - this[1] ) * alpha;
		this[2] += ( v[2] - this[2] ) * alpha;

		return this;

	}

	cross(a, b) {

		b = (b === undefined) ? this.clone() : b;

		this[0] = b[1] * a[2] - b[2] * a[1];
		this[1] = b[2] * a[0] - b[0] * a[2];
		this[2] = b[0] * a[1] - b[1] * a[0];

		return this;

	}
}

