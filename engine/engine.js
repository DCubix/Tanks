"use strict";

/**
 * MATHS
 */
var math = {
	radians: function(deg) {
		return deg * Math.PI / 180.0;
	},
	chainMul: function(arr) {
		let inp = arr[0];
		for (let i = 1; i < arr.length; i++) {
			inp = math.mul(inp, arr[i]);
		}
		return inp;
	},
	mul: function(a, b) {
		if (a.length <= 4 && b instanceof Number) {
			let ret = new Array(a.length);
			for (let i = 0; i < ret.length; i++) ret[i] = a[i] * b;
			return ret;
		} else if (a.length <= 4 && b.length <= 4 && a.length === b.length) {
			let ret = new Array(a.length);
			for (let i = 0; i < ret.length; i++) ret[i] = a[i] * b[i];
			return ret;
		} else if (a.length === 16 && b.length === 4) { // MAT4 * VEC4
			let c0r0 = a[ 0], c1r0 = a[ 1], c2r0 = a[ 2], c3r0 = a[ 3];
			let c0r1 = a[ 4], c1r1 = a[ 5], c2r1 = a[ 6], c3r1 = a[ 7];
			let c0r2 = a[ 8], c1r2 = a[ 9], c2r2 = a[10], c3r2 = a[11];
			let c0r3 = a[12], c1r3 = a[13], c2r3 = a[14], c3r3 = a[15];

			let x = b[0];
			let y = b[1];
			let z = b[2];
			let w = b[3];

			let resultX = (x * c0r0) + (y * c0r1) + (z * c0r2) + (w * c0r3);
			let resultY = (x * c1r0) + (y * c1r1) + (z * c1r2) + (w * c1r3);
			let resultZ = (x * c2r0) + (y * c2r1) + (z * c2r2) + (w * c2r3);
			let resultW = (x * c3r0) + (y * c3r1) + (z * c3r2) + (w * c3r3);

			return [resultX, resultY, resultZ, resultW];
		} else if (a.length === 16 && b.length === 16) { // MAT4 * MAT4
			let result = new Array(16);

			let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
				a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
				a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
				a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

			let b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
			result[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
			result[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
			result[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
			result[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

			b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
			result[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
			result[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
			result[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
			result[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

			b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
			result[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
			result[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
			result[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
			result[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

			b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
			result[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
			result[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
			result[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
			result[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

			return result;
		}
		return a;
	},
	add: function(a, b) {
		if (a.length !== b.length) return a;
		let ret = new Array(a.length);
		for (let i = 0; i < ret.length; i++) ret[i] = a[i] + b[i];
		return ret;
	},
	sub: function(a, b) {
		if (a.length !== b.length) return a;
		let ret = new Array(a.length);
		for (let i = 0; i < ret.length; i++) ret[i] = a[i] - b[i];
		return ret;
	},
	dot: function(a, b) {
		if (a.length !== b.length) return 0;
		let sum = 0.0;
		for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
		return sum + 0.0001;
	},
	cross: function(a, b) {
		if (a.length !== 3 || b.length !== 3) return a;
		return [
			a[1] * b[2] - a[2] * b[1],
			a[2] * b[0] - a[0] * b[2],
			a[0] * b[1] - a[1] * b[0]
		];
	},
	lengthSqr: function(a) {
		return math.dot(a, a);
	},
	length: function(a) { return Math.sqrt(math.lengthSqr(a)); },
	normalize: function(a) {
		let len = math.length(a);
		let ret = new Array(a.length);
		for (let i = 0; i < ret.length; i++) ret[i] = a[i] / len;
		return ret;
	},
	translation: function(x, y, z) {
		return [
			1.0, 0.0, 0.0, 0.0,
			0.0, 1.0, 0.0, 0.0,
			0.0, 0.0, 1.0, 0.0,
			  x,   y,   z, 1.0
		];
	},
	scale: function(x, y, z) {
		return [
			  x, 0.0, 0.0, 0.0,
			0.0,   y, 0.0, 0.0,
			0.0, 0.0,   z, 0.0,
			0.0, 0.0, 0.0, 1.0
		];
	},
	rotationX: function(rad) {
		let s = Math.sin(rad), c = Math.cos(rad);
		return [
			1.0, 0.0, 0.0, 0.0,
			0.0,   c,  -s, 0.0,
			0.0,   s,   c, 0.0,
			0.0, 0.0, 0.0, 1.0
		];
	},
	rotationY: function(rad) {
		let s = Math.sin(rad), c = Math.cos(rad);
		return [
			  c, 0.0,   s, 0.0,
			0.0, 1.0, 0.0, 0.0,
			 -s, 0.0,   c, 0.0,
			0.0, 0.0, 0.0, 1.0
		];
	},
	rotationZ: function(rad) {
		let s = Math.sin(rad), c = Math.cos(rad);
		return [
			  c,  -s, 0.0, 0.0,
			  s,   c, 0.0, 0.0,
			0.0, 0.0, 1.0, 0.0,
			0.0, 0.0, 0.0, 1.0
		];
	},
	ortho: function(left, right, bottom, top, near, far) {
		let lr = 1 / (left - right);
		let bt = 1 / (bottom - top);
		let nf = 1 / (near - far);

		let row4col1 = (left + right) * lr;
		let row4col2 = (top + bottom) * bt;
		let row4col3 = (far + near) * nf;

		return [
			 -2 * lr,        0,        0, 0,
			       0,  -2 * bt,        0, 0,
			       0,        0,   2 * nf, 0,
			row4col1, row4col2, row4col3, 1
		];
	},
	perspective: function(fov, aspect, near, far) {
		let f = 1.0 / Math.tan(fov / 2);
		let rangeInv = 1 / (near - far);

		return [
			f / aspect, 0,                         0,  0,
			         0, f,                         0,  0,
			         0, 0,   (near + far) * rangeInv, -1,
			         0, 0, near * far * rangeInv * 2,  0
		];
	},
	rotation: function(f, u, r) {
		if (r) {
			return [
				r[0], r[1], r[2], 0.0,
				u[0], u[1], u[2], 0.0,
				f[0], f[1], f[2], 0.0,
				0.0, 0.0, 0.0, 1.0,
			];
		} else {
			let fw = math.normalize(f);
			let r = math.normalize(u);
			r = math.cross(r, fw);

			let up = math.cross(fw, r);
			return math.rotation(fw, up, r);
		}
	},
	axisAngle: function(axis, angle) {
		let sa = Math.sin(angle), ca = Math.cos(angle);
		let ax = math.normalize(axis);
		let x = ax[0], y = ax[1], z = ax[2];

		let xx = x * x, yy = y * y, zz = z * z;
		let xy = x * y, xz = x * z, yz = y * z;

		return [
			xx + ca * (1.0 - xx), xy - ca * xy + sa * z, xz - ca * xz - sa * y, 0.0,
			xy - ca * xy - sa * z, yy + ca * (1.0 - yy), yz - ca * yz + sa * x, 0.0,
			xz - ca * xz + sa * y, yz - ca * yz - sa * x, zz + ca * (1.0 - zz), 0.0,
			0.0, 0.0, 0.0, 1.0
		];
	},
	lookAt: function(eye, at, up) {
		let z = math.normalize(math.sub(eye, at));
		let x = math.normalize(math.cross(math.normalize(up), z));
		let y = math.cross(z, x);

		let R = [
			x[0], y[0], z[0], 0.0,
			x[1], y[1], z[1], 0.0,
			x[2], y[2], z[2], 0.0,
			0.0, 0.0, 0.0, 1.0
		];
		return math.mul(R, math.translation(-eye[0], -eye[1], -eye[2]));
	},
	inverse: function(matrix) {
		if (matrix.length !== 16) return matrix;
		let result = [];

		let n11 = matrix[0], n12 = matrix[4], n13 = matrix[ 8], n14 = matrix[12];
		let n21 = matrix[1], n22 = matrix[5], n23 = matrix[ 9], n24 = matrix[13];
		let n31 = matrix[2], n32 = matrix[6], n33 = matrix[10], n34 = matrix[14];
		let n41 = matrix[3], n42 = matrix[7], n43 = matrix[11], n44 = matrix[15];

		result[ 0] = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
		result[ 4] = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
		result[ 8] = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
		result[12] = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
		result[ 1] = n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44;
		result[ 5] = n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44;
		result[ 9] = n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44;
		result[13] = n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34;
		result[ 2] = n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44;
		result[ 6] = n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44;
		result[10] = n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44;
		result[14] = n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34;
		result[ 3] = n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43;
		result[ 7] = n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43;
		result[11] = n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43;
		result[15] = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;

		let determinant = n11 * result[0] + n21 * result[4] + n31 * result[8] + n41 * result[12];

		if (determinant === 0) {
			throw new Error("Can't invert matrix, determinant is 0");
		}

		for (let i = 0; i < result.length; i++) {
			result[i] /= determinant;
		}

		return result;
	},
	makeVertex: function(x, y, z,  u, v,  r, g, b, a,  nx, ny, nz) {
		nx = nx || 0;
		ny = ny || 0;
		nz = nz || 0;
		return [[x, y, z], [u, v], [r, g, b, a], [nx, ny, nz]];
	},
	lerp: function(a, b, t) {
		return (1 - t) * a + b * t;
	},
	matString: function(a, colSize) {
		function pad(v, num) {
			let count = num - v.length;
			let ret = v;
			for (let i = 0; i < count; i++) {
				ret = " " + ret;
			}
			return ret;
		}
		colSize = colSize || 4;
		let str = "[ ";
		for (let i = 0; i < a.length; i++) {
			if (i % colSize == 0 && i > 0) {
				str += "]\n[ ";
			}
			let v = Math.round(a[i] * 100000) / 100000;
			str += pad(v.toString(), 10) + " ";
			if (i % colSize < colSize-1)
				str += "| ";
		}
		str += "]";
		return str;
	}
};

/**
 * GRAPHICS ENGINE
 */
var gfx = {
	__VS:
`#define PIXEL_SIZE 0.84

precision highp float;

attribute vec3 vPosition;
attribute vec3 vNormal;
attribute vec2 vUV;
attribute vec4 vColor;

uniform mat4 uProjView;
uniform vec2 uResolution;

varying vec2 oUV;
varying vec4 oColor;
varying vec3 oNormal;

void main() {
	vec2 hres = uResolution * 0.25;
	vec4 pos = uProjView * vec4(vPosition, 1.0);
	vec4 vertex = pos;
	vertex.xyz = pos.xyz / pos.w;
	vertex.x = floor(hres.x * vertex.x) / hres.x;
	vertex.y = floor(hres.y * vertex.y) / hres.y;
	vertex.xyz *= pos.w;
	gl_Position = vertex;

	oUV = vUV;
	oColor = vColor;
	oNormal = normalize(vNormal);
}`,

	__FS:
`precision mediump float;
uniform sampler2D uTexture;
varying vec2 oUV;
varying vec4 oColor;
varying vec3 oNormal;
void main() {
	//float nl = clamp(dot(oNormal, vec3(-1.0, 1.0, -1.0)) + 0.5, 0.0, 1.0);
	vec4 col = texture2D(uTexture, oUV);
	float a = col.a * oColor.a;
	gl_FragColor = vec4(col.rgb * oColor.rgb, a);
}`,

	_canvas: null,
	_gl: null,
	_shader: null,
	_vbo: null,
	_ibo: null,
	_vboSize: 0,
	_iboSize: 0,
	_vertices: [],
	_indices: [],

	_texture: null,
	_defaultTexture: null,

	_projection: [],
	_view: [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	],

	_uProjView: 0,
	_uTexture: 0,
	_uResolution: 0,
	_aPosition: 0,
	_aUV: 0,
	_aColor: 0,
	_aNormal: 0,
	_drawing: false,
	_blendSrc: null,
	_blendDest: null,
	_blending: false,
	create: function(canvas) {
		gfx._canvas = canvas;
		gfx._gl = canvas.getContext("webgl");

		// Setup GL
		let gl = gfx._gl;
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.enable(gl.DEPTH_TEST);

		let vs = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(vs, gfx.__VS);
		gl.compileShader(vs);
		if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
			console.error(gl.getShaderInfoLog(vs));
			return;
		}

		let fs = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(fs, gfx.__FS);
		gl.compileShader(fs);
		if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
			console.error(gl.getShaderInfoLog(fs));
			return;
		}

		gfx._shader = gl.createProgram();
		gl.attachShader(gfx._shader, vs);
		gl.attachShader(gfx._shader, fs);
		gl.linkProgram(gfx._shader);

		gl.useProgram(gfx._shader);
		gfx._uProjView = gl.getUniformLocation(gfx._shader, "uProjView");
		gfx._uTexture = gl.getUniformLocation(gfx._shader, "uTexture");
		gfx._uResolution = gl.getUniformLocation(gfx._shader, "uResolution");
		gfx._aPosition = gl.getAttribLocation(gfx._shader, "vPosition");
		gfx._aUV = gl.getAttribLocation(gfx._shader, "vUV");
		gfx._aColor = gl.getAttribLocation(gfx._shader, "vColor");
		gfx._aNormal = gl.getAttribLocation(gfx._shader, "vNormal");

		gl.uniform2f(gfx._uResolution, gfx._canvas.width, gfx._canvas.height);

		// Buffers
		gfx._vbo = gl.createBuffer();
		gfx._ibo = gl.createBuffer();

		gfx._projection = [1, 0, 0, 0,  0, 1, 0, 0,  0, 0, 1, 0,  0, 0, 0, 1];

		// Default texture
		let texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

		gl.texImage2D(
			gl.TEXTURE_2D,
			0, gl.RGBA, 1, 1, 0, gl.RGBA,
			gl.UNSIGNED_BYTE,
			new Uint8Array([255, 255, 255, 255])
		);
		gfx._defaultTexture = texture;
		gfx._texture = texture;
	},
	_setupMatrices: function() {
		let gl = gfx._gl;
		let pv = math.mul(gfx._projection, gfx._view);
		gl.uniformMatrix4fv(gfx._uProjView, false, pv);
		gl.uniform1i(gfx._uTexture, 0);
		gl.uniform2f(gfx._uResolution, gfx._canvas.width, gfx._canvas.height);
	},
	clear: function(r, g, b) {
		let gl = gfx._gl;
		r = r || 0;
		g = g || 0;
		b = b || 0;
		gl.clearColor(r, g, b, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.viewport(0, 0, gfx._canvas.width, gfx._canvas.height);
	},
	begin: function() {
		let gl = gfx._gl;
		if (gfx._drawing) return;
		gfx._setupMatrices();
		gfx._drawing = true;
	},
	flush: function() {
		let gl = gfx._gl;
		if (gfx._vertices.length === 0) return;
		if (gfx._texture !== null) {
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, gfx._texture);
		}

		if (!gfx._blending) {
			gl.disable(gl.BLEND);
		} else {
			gl.enable(gl.BLEND);
			if (gfx._blendSrc !== null && gfx._blendDest !== null)
				gl.blendFunc(gfx._blendSrc, gfx._blendDest);
		}

		let verts = new Float32Array(gfx._vertices);
		let inds = new Uint16Array(gfx._indices);

		gl.bindBuffer(gl.ARRAY_BUFFER, gfx._vbo);
		if (gfx._vboSize < gfx._vertices.length) {
			gl.bufferData(gl.ARRAY_BUFFER, verts, gl.DYNAMIC_DRAW);
			gfx._vboSize = gfx._vertices.length;
		} else {
			gl.bufferSubData(gl.ARRAY_BUFFER, 0, verts);
		}

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gfx._ibo);
		if (gfx._iboSize < gfx._indices.length) {
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, inds, gl.DYNAMIC_DRAW);
			gfx._iboSize = gfx._indices.length;
		} else {
			gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, inds);
		}

		gl.enableVertexAttribArray(gfx._aPosition);
		gl.enableVertexAttribArray(gfx._aNormal);
		gl.enableVertexAttribArray(gfx._aUV);
		gl.enableVertexAttribArray(gfx._aColor);

		gl.vertexAttribPointer(gfx._aPosition, 3, gl.FLOAT, false, 48, 0);
		gl.vertexAttribPointer(gfx._aNormal, 3, gl.FLOAT, false, 48, 12);
		gl.vertexAttribPointer(gfx._aUV, 2, gl.FLOAT, false, 48, 24);
		gl.vertexAttribPointer(gfx._aColor, 4, gl.FLOAT, false, 48, 32);

		gl.drawElements(gl.TRIANGLES, gfx._indices.length, gl.UNSIGNED_SHORT, 0);

		gfx._vertices = [];
		gfx._indices = [];
	},
	end: function() {
		let gl = gfx._gl;
		if (!gfx._drawing) return;
		if (gfx._vertices.length !== 0) gfx.flush();
		gfx._texture = null;

		if (gfx._blending) {
			gl.disable(gl.BLEND);
		}

		gfx._drawing = false;
	},
	enableBlending: function() {
		if (gfx._blending) return;
		gfx.flush();
		gfx._blending = true;
	},
	disableBlending: function() {
		if (!gfx._blending) return;
		gfx.flush();
		gfx._blending = false;
	},
	blendFunction: function(src, dest) {
		if (gfx._blendSrc === src && gfx._blendDest === dest) return;
		gfx.flush();
		gfx._blendSrc = src;
		gfx._blendDest = dest;
	},
	switchTexture: function(tex) {
		gfx.flush();
		gfx._texture = tex;
	},
	projection: function(v) {
		v = v || null;
		if (v !== null) {
			gfx._projection = v;
			gfx._setupMatrices();
		} else {
			return gfx._projection;
		}
	},
	view: function(v) {
		v = v || null;
		if (v !== null) {
			gfx._view = v;
			gfx._setupMatrices();
		} else {
			return gfx._view;
		}
	},
	draw: function(texture, vertices, indices, transform, tint) {
		if (!gfx._drawing) gfx.flush();

		tint = tint || [1, 1, 1, 1];
		texture = texture || gfx._defaultTexture;
		transform = transform || [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

		if (texture != gfx._texture) {
			gfx.switchTexture(texture);
		} else if (gfx._vertices >= 100000) {
			gfx.flush();
		}

		let off = ~~(gfx._vertices.length / 9);

		// transform
		for (let v of vertices) {
			let pos = [v[0][0], v[0][1], v[0][2], 1.0];
			let nrm = [v[3][0], v[3][1], v[3][2], 0.0];
			let t = math.mul(transform, pos);
			let n = math.mul(transform, nrm);
			gfx._vertices.push(t[0], t[1], t[2]);
			gfx._vertices.push(n[0], n[1], n[2]);
			gfx._vertices.push(v[1][0], v[1][1]);
			gfx._vertices.push(v[2][0] * tint[0], v[2][1] * tint[1], v[2][2] * tint[2], v[2][3] * tint[3]);
		}

		for (let i of indices) {
			gfx._indices.push(i + off);
		}
	},
	GL: function() { return gfx._gl; }
};

/**
 * STRING READER UTIL
 */
function Scanner(str) {
	this.input = (str || "").split(/[ \n\t\r]/);
	this.peek = function() { if (this.input.length === 0) return null; return this.input[0]; };
	this.scan = function() {
		if (this.input.length === 0) return null;
		let v = this.peek();
		this.input.shift();
		return v.trim();
	};
	this.number = function() {
		return parseFloat(this.scan());
	};
}

/**
 * RESOURCE MANAGER
 */
var res = {
	_queue: [],
	_loaded: {},
	add: function(path, type) {
		res._queue.push([ path, type ]);
	},
	_createTexture: function(image) {
		let gl = gfx.GL();
		function isPowerOf2(value) {
			return (value & (value - 1)) == 0;
		}

		let texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		if (!isPowerOf2(image.width) || !isPowerOf2(image.height)) {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		}

		gl.texImage2D(
			gl.TEXTURE_2D,
			0, gl.RGBA, gl.RGBA,
			gl.UNSIGNED_BYTE,
			image
		);

		return texture;
	},
	_createModel: function(str) {
		// Parse PLY file
		let sc = new Scanner(str);

		let vertexCount = 0;
		let indexCount = 0;
		let fmt = [];
		let readData = false;

		let vertices = [];
		let indices = [];

		while (sc.input.length > 0) {
			if (/[a-zA-Z]/.test(sc.peek()) && !readData) { // Is a keyword
				let kw = sc.scan();
				if (kw === "element") {
					let type = sc.scan();
					if (type === "vertex") {
						vertexCount = sc.number();
					} else if (type === "face") {
						indexCount = sc.number();
					}
				} else if (kw === "property") {
					let type = sc.scan();
					if (type === "float" || type === "uchar") {
						fmt.push(sc.scan());
					}
				} else if (kw === "end_header") {
					readData = true;
				}
			} else if (readData) {
				for (let v = 0; v < vertexCount; v++) {
					let vert = [[0, 0, 0], [0, 0], [1, 1, 1, 1], [0, 0, 0]];
					for (let p = 0; p < fmt.length; p++) {
						let f = fmt[p];
						if		(f === "x")		vert[0][0] = sc.number();
						else if (f === "y")		vert[0][1] = sc.number();
						else if (f === "z")		vert[0][2] = sc.number();
						else if (f === "s")		vert[1][0] = sc.number();
						else if (f === "t")		vert[1][1] = -sc.number();
						else if (f === "red")	vert[2][0] = sc.number() / 255;
						else if (f === "green")	vert[2][1] = sc.number() / 255;
						else if (f === "blue")	vert[2][2] = sc.number() / 255;
						else if (f === "alpha")	vert[2][3] = sc.number() / 255;
						else if (f === "nx")	vert[3][0] = sc.number();
						else if (f === "ny")	vert[3][1] = sc.number();
						else if (f === "nz")	vert[3][2] = sc.number();
					}
					vertices.push(vert);
				}
				for (let i = 0; i < indexCount; i++) {
					let sz = sc.number();
					if (sz > 3 || sz < 3) continue;
					for (let k = 0; k < sz; k++) indices.push(sc.number());
				}
			} else sc.scan();
		}
		// console.log(fmt, vertexCount, indexCount);
		return { vertices: vertices, indices: indices };
	},
	get: function(path) {
		return res._loaded[path];
	},
	load: function(callback) {
		let err = 0, ok = 0;

		function success() {
			ok++;
			if (err + ok >= res._queue.length) {
				callback();
			}
		}

		function error() {
			err++;
			// if (err + ok >= res._queue.length) {
			// 	callback();
			// }
		}

		for (let i of res._queue) {
			let path = i[0];
			let type = i[1];
			if (type === "texture") {
				let img = new Image();
				img.onload = function() {
					res._loaded[path] = res._createTexture(img);
					success();
				};
				img.onerror = function() {
					console.error("Failed to load " + path);
					error();
				};
				img.src = path;
			} else if (type === "model") {
				let xhr = new XMLHttpRequest();
				xhr.open('GET', path);
				xhr.onload = function() {
					let status = xhr.status;
					if (status === 200) {
						res._loaded[path] = res._createModel(xhr.responseText);
						success();
					} else {
						console.error("Failed to load " + path);
						error();
					}
				};
				xhr.send();
			}
		}
	}
};

var _ID = 0;
function Ent(name) {
	this.name = name;
	this.position = [0.0, 0.0, 0.0];
	this.rotation = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
	this.scale = [1.0, 1.0, 1.0];
	this.origin = [0.0, 0.0, 0.0];
	this.types = [];
	this.active = true;
	this.visible = true;
	this.deathTimer = null;
	this.body = null;
	this.id = _ID++;

	this.is = function(name) {
		for (let t of this.types) if (t === name) return true;
		return false;
	};

	this.same = function(ent) {
		if (this.types.length !== ent.types.length) return false;
		let same = true;
		for (let i = 0; i < this.types.length; i++) {
			if (this.types[i] !== ent.types[i]) {
				same = false;
				break;
			}
		}
		return same;
	};

}

/**
 * INPUT MANAGER
 */
var input = {
	_keyboard: {},
	_mouse: {},
	_pos: [0, 0],
	create: function(canvas) {
		window.onkeydown = function(e) {
			if (!input._keyboard[e.key])
				input._keyboard[e.key] = { pressed: false, released: false, held: false };
			input._keyboard[e.key].pressed = true;
			input._keyboard[e.key].held = true;
		};

		window.onkeyup = function(e) {
			if (!input._keyboard[e.key])
				input._keyboard[e.key] = { pressed: false, released: false, held: false };
			input._keyboard[e.key].released = true;
			input._keyboard[e.key].held = false;
		};

		canvas.onmousedown = function(e) {
			let btn = e.button.toString();
			if (!input._mouse[btn])
				input._mouse[btn] = { pressed: false, released: false, held: false };
			input._mouse[btn].pressed = true;
			input._mouse[btn].held = true;
		};

		canvas.onmouseup = function(e) {
			let btn = e.button.toString();
			if (!input._mouse[btn])
				input._mouse[btn] = { pressed: false, released: false, held: false };
			input._mouse[btn].released = true;
			input._mouse[btn].held = false;
		};

		canvas.onmousemove = function(e) {
			let rect = canvas.getBoundingClientRect();
			let x = e.clientX - rect.left;
			let y = e.clientY - rect.top;
			input._pos = [x, y];
		};
	},
	keyPressed: function(k) {
		return input._keyboard[k] && input._keyboard[k].pressed;
	},
	keyReleased: function(k) {
		return input._keyboard[k] && input._keyboard[k].released;
	},
	keyHeld: function(k) {
		return input._keyboard[k] && input._keyboard[k].held;
	},
	mousePressed: function(k) {
		return input._mouse[k] && input._mouse[k].pressed;
	},
	mouseReleased: function(k) {
		return input._mouse[k] && input._mouse[k].released;
	},
	mouseHeld: function(k) {
		return input._mouse[k] && input._mouse[k].held;
	},
	mousePosition: function() { return input._pos; },
	update: function() {
		for (let k in input._keyboard) {
			input._keyboard[k].pressed = false;
			input._keyboard[k].released = false;
		}
		for (let k in input._mouse) {
			input._mouse[k].pressed = false;
			input._mouse[k].released = false;
		}
	}
};

/**
 * ENGINE
 */
var engine = {
	_renderers: {},
	_behaviors: {},
	_world: [],
	_createQueue: [],
	_physicsWorld: null,
	registerType: function(name, behavior, renderer) {
		engine._renderers[name] = renderer || null;
		engine._behaviors[name] = behavior || function(){};
	},
	get: function(name) {
		for (let ent of engine._world) {
			if (ent.name === name) return ent;
		}
		return null;
	},
	create: function(name, ctor, args) {
		let ent = new Ent(name);
		engine._createQueue.push([ent, ctor, args]);
	},
	destroy: function(name, timeout) {
		timeout = timeout || 0;
		if (typeof name === "string") {
			for (let ent of engine._world) {
				if (ent.name === name) {
					ent.deathTimer = timeout;
					break;
				}
			}
		} else {
			name.deathTimer = timeout;
		}
	},
	update: function(ts) {
		ts = ts || (1.0 / 60.0);

		if (CANNON && engine._physicsWorld === null) { // cannon.js physics!
			engine._physicsWorld = new CANNON.World();
			engine._physicsWorld.gravity.set(0, -11, 0);

			engine.registerType("physics", function(e) {
				if (e.body === null) return;
				let pos = e.body.position;
				let rot = e.body.quaternion.toAxisAngle();
				let axis = rot[0], angle = rot[1];
				e.position = [pos.x, pos.y, pos.z];
				e.rotation = math.axisAngle([axis.x, axis.y, axis.z], angle);
			}, null);
		}

		for (let ent of engine._createQueue) {
			let e = ent[0];
			let ctor = ent[1];
			let args = ent[2];
			if (ctor) {
				ctor(e, args);
			}
			engine._world.push(e);
		}
		engine._createQueue = [];

		if (CANNON) {
			engine._physicsWorld.step(ts);
		}

		let rem = [];
		for (let ent of engine._world) {
			if (!ent.types) continue;
			for (let type of ent.types) {
				if (engine._behaviors[type]) engine._behaviors[type](ent, ts, engine._world);
			}
			if (ent.deathTimer !== null) {
				if (ent.deathTimer > 0.0) {
					ent.deathTimer -= ts;
				} else {
					rem.push(ent);
				}
			}
		}
		for (let ent of rem) {
			if (ent.body) {
				engine._physicsWorld.removeBody(ent.body);
			}
			engine._world.splice(engine._world.indexOf(ent), 1);
		}
		input.update();
	},
	render: function() {
		gfx.begin();
		for (let ent of engine._world) {
			if (!ent.types) continue;
			for (let type of ent.types) {
				if (engine._renderers[type]) {
					let p = math.translation(ent.position[0], ent.position[1], ent.position[2]);
					let o = math.translation(-ent.origin[0], -ent.origin[1], -ent.origin[2]);
					let t = math.mul(p, o);
					let r = ent.rotation;
					let s = math.scale(ent.scale[0], ent.scale[1], ent.scale[2]);
					let xform = math.mul(t, math.mul(r, s));
					engine._renderers[type](ent, xform, engine._world);
				}
			}
		}
		gfx.end();
	},
	physics: function() { return engine._physicsWorld; }
};
