// let dbg = document.getElementById("debug_");
let zoom = 8.0;
let ang = 0.0;
let canvas = document.getElementById("game");
gfx.create(canvas);
input.create(canvas);

function tankConstructor(e, args) {
	e.body = new CANNON.Body({ mass: 1, shape: new CANNON.Box(new CANNON.Vec3(0.75, 0.16, 1.0)) });
	e.body.position.x = args.position ? args.position[0] : 0;
	e.body.position.y = args.position ? args.position[1] : 0;
	e.body.position.z = args.position ? args.position[2] : 0;
	e.body.entity = e;
	engine.physics().addBody(e.body);

	e.types.push("physics", "tank");
	if (args.player) {
		e.types.push("player");
		e.types.push("player_team");
	}
	if (args.friend) {
		e.types.push("player_team");
		e.types.push("friend");
	} else {
		e.types.push("enemy_team");
		e.types.push("enemy");
	}
	if (args.ai) {
		e.state = "";
		e.target = null;
		e.types.push("ai");
	}
//	e.types.push("tank");

	e.color = [
		0.5 + Math.random() * 0.5,
		0.5 + Math.random() * 0.5,
		0.5 + Math.random() * 0.5,
		1.0
	];

	e.rot = 0.0;
	e.rotSpeed = 0.0;
	e.speed = 0.0;
	e.vel = 0.0;
	e.angVel = 0.0;

	// Shooting
	e.ammo = 100;
	e.reloadTime = 0.0;

	e.health = 100;
}

function bulletConstructor(e, args) {
	e.body = new CANNON.Body({ mass: 0, shape: new CANNON.Sphere(0.5) });
	e.body.position.x = args.position[0];
	e.body.position.y = args.position[1];
	e.body.position.z = args.position[2];
	e.body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), args.rot);
	e.body.entity = e;
	engine.physics().addBody(e.body);

	e.types.push("physics", "bullet");
	if (args.type) {
		e.types.push(args.type);
	}

	e.body.addEventListener("collide", function(ev) {
		let ent = ev.body.entity;
		let is_friend = ent.types.indexOf("friend") !== -1;
		let from_friend = e.types.indexOf("player_team") !== -1;

		if (!is_friend && from_friend) {
			engine.destroy(e);
			ent.health -= 1;
		} else if (is_friend && !from_friend) {
			engine.destroy(e);
			ent.health -= 1;
		}

		if (ent.health <= 0) {
			engine.destroy(ent);
		}
	});

	e.speed = 20.0;
	e.deathTimer = 0.5;
}

function flashConstructor(e, args) {
	e.types.push("billboard");
	e.sprite = res.get("blast.png");
	e.size = args.size || 1.2;
	e.position = args.position;
	e.deathTimer = 0.1;
	e.mode = "add";
	e.animateScale = true;
}

engine.registerType("billboard",
	function(e, dt) {
		if (e.deathTimer <= 0.1 && e.animateScale) {
			let t = e.deathTimer / 0.1;
			e.size = t;
		}
	},
	function(e, xform) {
		if (!e.sprite) return;

		let is = [ 0, 1, 2, 0, 2, 3 ];

		let view = gfx.view();
		let center = e.position.slice();
		let size = e.size || 2.0;

		let camRight = [view[0] * size, view[4] * size, view[8] * size];
		let camUp = [view[1] * size, view[5] * size, view[9] * size];

		let rpu = math.add(camRight, camUp);
		let rmu = math.sub(camRight, camUp);

		let a = math.sub(center, rpu);
		let b = math.add(center, rmu);
		let c = math.add(center, rpu);
		let d = math.sub(center, rmu);

		let vs = [
			[a,  [0.0, 0.0], [1.0, 1.0, 1.0, 1.0], [1.0, 1.0, 1.0]],
			[b,  [1.0, 0.0], [1.0, 1.0, 1.0, 1.0], [1.0, 1.0, 1.0]],
			[c,  [1.0, 1.0], [1.0, 1.0, 1.0, 1.0], [1.0, 1.0, 1.0]],
			[d,  [0.0, 1.0], [1.0, 1.0, 1.0, 1.0], [1.0, 1.0, 1.0]]
		];

		gfx.enableBlending();
		if (e.mode) {
			if (e.mode === "add") {
				gfx.blendFunction(gfx.GL().ONE, gfx.GL().ONE);
			} else if (e.mode === "alpha") {
				gfx.blendFunction(gfx.GL().SRC_ALPHA, gfx.GL().ONE_MINUS_SRC_ALPHA);
			} else {
				gfx.disableBlending();
			}
		}
		gfx.draw(e.sprite, vs, is, null, e.color);
		gfx.disableBlending();
	}
);

engine.registerType("terrain", null, function(e, xform) {
	let obj = res.get("terrain.ply");
	gfx.draw(res.get("ground.png"), obj.vertices, obj.indices, xform);
});

engine.registerType("bullet",
	function(e, dt) {
		let dir = math.normalize(math.mul(e.rotation, [0.0, 0.0, 1.0, 0.0]));
		e.body.position.x += dir[0] * e.speed * dt;
		e.body.position.z += dir[2] * e.speed * dt;
		if (e.deathTimer <= 0.05) {
			let pos = [e.body.position.x, e.body.position.y, e.body.position.z];
			engine.create("spark__", flashConstructor, { position: pos, size: 1.0 });
		}
	},
	function(e, xform) {
		let obj = res.get("bullet.ply");
		let tex = res.get("blast.png");
		gfx.enableBlending();
		gfx.blendFunction(gfx.GL().ONE, gfx.GL().ONE);
		gfx.draw(tex, obj.vertices, obj.indices, xform);
		gfx.disableBlending();
	}
);

function shoot(e, type) {
	type = type || "player_team";
	let dir = math.normalize(math.mul(e.rotation, [0.0, 0.0, 1.0, 0.0]));
	let x = e.position[0] + dir[0] * 1.0;
	let z = e.position[2] + dir[2] * 1.0;
	engine.create("_bullet_"+e.ammo, bulletConstructor, { position: [x, 0.65, z], rot: e.rot, type: type });
	engine.create("_spark_"+e.ammo, flashConstructor, { position: [x, 0.65, z], type: type });
	e.ammo--;

	e.body.applyLocalForce(new CANNON.Vec3(0, 0, -800.0), new CANNON.Vec3(0, 0, 0));
}

engine.registerType("ai", function(e, dt, world) {
	if (e.state === undefined || e.state === null) return;

	if (e.state === "looking_for_target") {
		let playerTeam = world.filter(function(e) { return e.is("player_team"); });
		let enemyTeam = world.filter(function(e) { return e.is("enemy_team"); });
		let _world = e.is("enemy_team") ? playerTeam : enemyTeam;
		for (let obj of _world) {
			if (obj === e) continue;
			if (obj.types.indexOf("tank") === -1) continue;

			let dist = math.length(math.sub(obj.position, e.position));
			if (dist <= 12.0) {
				e.target = obj;
				console.log("TARGET ACQUIRED: " + obj.name);
				e.state = "run_towards";
				break;
			}
		}
	} else if (e.state === "run_towards" && e.target) {
		let vec = math.sub(e.target.position, e.position);
		let right = math.normalize(math.mul(e.rotation, [1.0, 0.0, 0.0, 0.0]));
		let side = math.dot([right[0], right[1], right[2]], math.normalize(vec));
		let len = math.length(vec);
		if (len <= 6.0) {
			if (e.reloadTime <= 0.0 && e.ammo > 0 && side >= -0.4 && side <= 0.4) {
				e.reloadTime = 0.25;
				shoot(e, e.is("player_team") ? "player_team" : "enemy_team");
			}
			e.speed = 2.0;
		} else if (len > 12.0) {
			e.speed = 0;
			e.rotSpeed = 0;
			e.state = "looking_for_target";
		} else {
			if (side < -0.1) {
				e.rotSpeed = -1.2;
			} else if (side > 0.1) {
				e.rotSpeed = 1.2;
			} else {
				e.rotSpeed = 0.0;
			}
			e.speed = 2.5;
		}
	} else if (e.target === null) {
		e.state = "looking_for_target";
	}
});

engine.registerType("player", function(e, dt) {
	if (input.keyHeld(" ") && e.reloadTime <= 0.0 && e.ammo > 0) {
		e.reloadTime = 0.25;
		shoot(e);
	}

	if (input.keyHeld("w")) {
		e.speed = 3.0;
	} else if (input.keyHeld("s")) {
		e.speed = -3.0;
	} else {
		e.speed = 0.0;
	}

	if (input.keyHeld("a")) {
		e.rotSpeed = 1.5;
	} else if (input.keyHeld("d")) {
		e.rotSpeed = -1.5;
	} else {
		e.rotSpeed = 0.0;
	}
});

engine.registerType("tank", function(e, dt) {
	let dir = math.normalize(math.mul(e.rotation, [0.0, 0.0, 1.0, 0.0]));

	e.rot += e.angVel * dt;

	if (e.rot >= Math.PI * 2.0) {
		e.rot -= Math.PI * 2.0;
	} else if (e.rot < 0) {
		e.rot += Math.PI * 2.0;
	}

	e.vel = math.lerp(e.vel, e.speed, 0.2);
	e.angVel = math.lerp(e.angVel, e.rotSpeed, 0.2);

	e.body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), e.rot);
	e.body.position.x += dir[0] * dt * e.vel;
	e.body.position.z += dir[2] * dt * e.vel;

	if (e.reloadTime > 0.0) {
		e.reloadTime -= dt;
	}
}, function(e, xform) {
	let obj = res.get("tank.ply");
	let plane = res.get("plane.ply");
	let shadow = res.get("shadow.png");

	let pos = e.position;
	let shadPos = math.translation(pos[0], 0.08, pos[2]);
	shadPos = math.mul(shadPos, math.scale(1.8, 1.8, 1.8));

	gfx.enableBlending();
	gfx.blendFunction(gfx.GL().DST_COLOR, gfx.GL().ONE_MINUS_SRC_ALPHA);
	gfx.draw(shadow, plane.vertices, plane.indices, shadPos);
	gfx.disableBlending();

	gfx.draw(res.get("tank.png"), obj.vertices, obj.indices, xform, e.color);
});

engine.create("ground", function(e) {
	let gs = new CANNON.Box(new CANNON.Vec3(30.0, 0.1, 30.0));
	e.body = new CANNON.Body({ mass: 0, shape: gs });
	e.body.entity = e;
	engine.physics().addBody(e.body);

	e.types.push("physics", "terrain");
});

engine.create("tank", tankConstructor, { friend: true, player: true, position: [0, 1, 0] });
engine.create("tank3", tankConstructor, { ai: true, position: [8.0, 1, -12.0] });
engine.create("tank4", tankConstructor, { ai: true, friend: true, position: [3.0, 1, 0.0] });

res.add("tank.png", "texture");
res.add("tank.ply", "model");
res.add("ground.png", "texture");
res.add("terrain.ply", "model");
res.add("plane.ply", "model");
res.add("shadow.png", "texture");
res.add("blast.png", "texture");
res.add("bullet.ply", "model");
res.load(function() {
	loop();
});

const initPos = [-zoom, zoom, zoom];
let camPos = initPos.slice();
function loop() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	engine.update();

	let tank = engine.get("tank");

	let loc = math.add(initPos, tank.position);

	camPos = [
		math.lerp(camPos[0], loc[0], 0.08),
		math.lerp(camPos[1], loc[1], 0.08),
		math.lerp(camPos[2], loc[2], 0.08)
	];

	let rot = math.lookAt(camPos, math.sub(camPos, initPos), [0, 1, 0]);
	gfx.view(rot);

	let aspect = canvas.width / canvas.height;
	gfx.projection(math.ortho(aspect * -zoom, aspect * zoom, -zoom, zoom, 0.001, 500.0));

	gfx.clear();
	engine.render();

	window.requestAnimationFrame(loop);
}
