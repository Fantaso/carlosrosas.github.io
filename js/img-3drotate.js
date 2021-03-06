"use strict";

var MAX_ROT = 30;
var ANIM_SPEED = 0.075;

var frame = void 0,
    card = void 0,
    img = void 0,
    mouse = void 0,
    userPos = void 0,
    hover = void 0,
    padding = void 0,
    center = void 0;

function lerp(n1, n2, speed) {
	return (1 - speed) * n1 + speed * n2;
}

Array.prototype.lerp = function (target, speed) {
	var _this = this;

	this.forEach(function (n, i) {
		return _this[i] = lerp(n, target[i], speed);
	});
};

function resize() {
	var rect = card.getBoundingClientRect();
	center = [0.5 * card.clientWidth + rect.left, 0.5 * card.clientHeight + rect.top];
	userPos = [center[0], center[1]];
}

function loop() {
	var xPosNorm = void 0,
	    yPosNorm = void 0,
	    mouseDistNorm = void 0,
	    theta = void 0,
	    xRot = void 0,
	    yRot = void 0,
	    imgX = void 0,
	    imgY = void 0;

	userPos.lerp(hover ? mouse : center, ANIM_SPEED);

	xPosNorm = (center[0] - userPos[0]) / center[0];
	yPosNorm = (center[1] - userPos[1]) / center[1];

	imgX = xPosNorm * padding[0];
	imgY = yPosNorm * padding[1];

	mouseDistNorm = Math.sqrt(xPosNorm * xPosNorm + yPosNorm * yPosNorm);
	theta = Math.atan2(userPos[1] - center[1], userPos[0] - center[0]);

	xRot = Math.sin(-theta) * MAX_ROT * mouseDistNorm; //card x-axis rotation based on mouse y-axis position
	yRot = Math.cos(theta) * MAX_ROT * mouseDistNorm;

	card.style.transform = "rotateX(" + xRot + "deg) rotateY(" + yRot + "deg)";
	img.style.transform = "translateX(" + imgX + "px) translateY(" + imgY + "px)";
	window.requestAnimationFrame(loop);
}

function init() {
	frame = document.querySelector(".frame");
	card = document.querySelector(".card");
	img = document.querySelector(".background-img");
	mouse = [0, 0];
	hover = false;
	padding = [0.5 * (img.clientWidth - card.clientWidth), 0.5 * (img.clientHeight - card.clientHeight)];

	resize();

	frame.addEventListener("mousemove", function (e) {
		mouse[0] = e.clientX;
		mouse[1] = e.clientY;
		hover = true;
	});

	frame.addEventListener("mouseleave", function () {
		hover = false;
	});
	loop();
}

window.onresize = resize;
window.onload = init;