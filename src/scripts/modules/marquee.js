import { module as modujs } from "modujs";

import { gsap } from "gsap";

import { outerWidth, lerp } from "../helpers";

export default class extends modujs {
	constructor(m) {
		super(m);

		this.$clones = [];

		this.defaultSpeed = 1;
		this.defaultScrollAcceleration = 0.4;
		this.defaultLerp = 0.08;
		this.defaultDirection = "left";

		this.position = 0;
		this.currentVelocity = 0;
		this.targetVelocity = 0;
	}

	init() {
		this.speed = this.getData("speed") ? parseFloat(this.getData("speed")) : this.defaultSpeed;
		this.scrollAcceleration = this.getData("scroll-acceleration") ? parseFloat(this.getData("scroll-acceleration")) : this.defaultScrollAcceleration;
		this.lerp = this.getData("lerp") ? parseFloat(this.getData("lerp")) : this.defaultLerp;
		this.direction = this.getData("direction") ? this.getData("direction") : this.defaultDirection;

		if (this.direction == "auto") {
			this.currentDirection = "left";
		} else if (this.direction == "auto-reverse") {
			this.currentDirection = "right";
		} else {
			this.currentDirection = this.direction;
		}

		this.$wrapper = this.$("wrapper")[0];
		this.$content = this.$("content")[0];
		this.$titles = this.$("title");

		document.fonts.ready.then(() => {
			this.resizeDebounce();
		});

		this._resizeHandler = this.resize.bind(this);
		window.addEventListener("resize", this._resizeHandler);

		window.lenis.on("scroll", (e) => {
			if (e.velocity != 0) {
				if (this.direction == "auto") {
					this.currentDirection = e.direction == 1 ? "left" : "right";
				} else if (this.direction == "auto-reverse") {
					this.currentDirection = e.direction == 1 ? "right" : "left";
				}
			}

			if (this.scrollAcceleration > 0) {
				this.targetVelocity = Math.max(Math.min(e.velocity * this.scrollAcceleration, 50), -50);
			}
		});

		this.resizeDebounce();

		this.observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				this.animate();
			} else {
				cancelAnimationFrame(this.raf);
			}
		});

		this.observer.observe(this.el);
	}

	resize() {
		if (this.resizeTimeout != undefined) {
			this.resizeTimeout.kill();
		}

		this.resizeTimeout = gsap.delayedCall(0.3, () => {
			this.resizeDebounce();
		});
	}

	resizeDebounce() {
		if (this.$clones) {
			this.$clones.forEach(($clone) => {
				$clone.remove();
			});
		}

		this.marqueeWidth = outerWidth(this.el);
		this.contentWidth = outerWidth(this.$content);

		if (this.contentWidth > 0) {
			var diff = this.marqueeWidth / this.contentWidth;
			var duplications = Math.ceil(diff);

			for (var x = 0; x < duplications + 1; x++) {
				var $clone = this.$wrapper.appendChild(this.$content.cloneNode(true));
				this.$clones.push($clone);
			}
		}

		this.$titles = this.el.querySelectorAll('[data-marquee="title"]');
	}

	animate() {
		this.raf = window.requestAnimationFrame(() => this.animate());

		if (this.scrollAcceleration > 0) {
			let distance = Math.abs(this.targetVelocity - this.currentVelocity);
			let lerpFactor = Math.min(this.lerp, distance * 0.02);

			this.currentVelocity = lerp(this.currentVelocity, this.targetVelocity, lerpFactor);

			this.el.style.setProperty("--velocity", this.currentVelocity);
		}

		this.position = this.currentDirection == "left" ? this.position - this.speed : this.position + this.speed;

		if (this.currentDirection == "right") {
			this.position += Math.abs(this.currentVelocity);
		} else if (this.currentDirection == "left") {
			this.position -= Math.abs(this.currentVelocity);
		}

		if (this.position >= 0 || this.position <= -this.contentWidth * 2) {
			this.position = -this.contentWidth;
		}

		this.$wrapper.style.transform = `translateX(${this.position}px)`;
	}

	destroy() {
		this.observer.unobserve(this.el);
		this.observer.disconnect();

		window.removeEventListener("resize", this._resizeHandler);

		if (this.raf) {
			window.cancelAnimationFrame(this.raf);
		}
	}
}
