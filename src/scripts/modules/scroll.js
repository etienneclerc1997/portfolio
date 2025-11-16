import { module as modujs } from "modujs";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export default class extends modujs {
	constructor(m) {
		super(m);

		this.events = {
			click: {
				anchor: "anchorClick",
			},
		};
	}

	init() {
		this.lenis = new Lenis({
			lerp: 0.2,
			duration: 0.6,
		});

		window.lenis = this.lenis;

		this.lenis.on("scroll", (e) => {
			if (e.direction == 1) {
				document.querySelector("html").classList.remove("is-scroll-up");
				document.querySelector("html").classList.add("is-scroll-down");
			} else {
				document.querySelector("html").classList.remove("is-scroll-down");
				document.querySelector("html").classList.add("is-scroll-up");
			}
		});

		this.lenis.on("scroll", ScrollTrigger.update);

		this._rafCallback = (time) => this.lenis.raf(time * 1000);
		gsap.ticker.add(this._rafCallback);

		gsap.ticker.lagSmoothing(0);
	}

	anchorClick(e) {
		e.preventDefault();
		this.scrollTo(document.querySelector(e.target.hash));
	}

	scrollTo(target) {
		this.lenis.scrollTo(target, {
			offset: -document.querySelector(".c-header").getBoundingClientRect().height,
		});
	}

	destroy() {
		this.lenis.destroy();
		gsap.ticker.remove(this._rafCallback);
	}
}
