import { module as modujs } from "modujs";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default class extends modujs {
	constructor(m) {
		super(m);

		this.gsapInstances = [];
		this.distance = 100;
	}

	init() {
		this.speed = this.getData("speed") ?? 1;
		this.direction = this.getData("direction") ?? "up";

		if (this.direction == "down") {
			this.distance = this.distance * -1;
		}

		this.gsapInstances.push(
			gsap.fromTo(
				this.el,
				{
					y: this.distance * this.speed,
				},
				{
					scrollTrigger: {
						trigger: this.el,
						scrub: 1,
						end: "bottom+=" + -this.distance * this.speed * 2 + " top",
					},
					ease: "none",
					y: -this.distance * this.speed,
				}
			)
		);
	}

	destroy() {
		window.swup.hooks.once("content:replace", () => {
			this.gsapInstances.forEach((instance) => {
				if (instance) {
					if (instance.scrollTrigger) {
						instance.scrollTrigger.kill();
					}
					instance.kill();
				}
			});

			this.gsapInstances = [];
		});
	}
}
