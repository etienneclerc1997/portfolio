import { module as modujs } from "modujs";

import { gsap } from "gsap";

export default class extends modujs {
	constructor(m) {
		super(m);

		this.gsapInstances = [];
	}

	init() {
		this.$line = this.$("line");
		this.$grid = this.$("grid");
		this.$cols = this.$("col");

		gsap.set(this.el, {
			autoAlpha: 1,
		});

		this.centerLineTween = gsap.fromTo(
			this.$line,
			{
				scaleY: 0,
				transformOrigin: "bottom",
			},
			{
				scaleY: 1,
				duration: 1.6,
				ease: "expo.inOut",
				paused: true,
			}
		);

		this.gsapInstances.push(this.centerLineTween);

		if (this.getCookie("dev_utils_show_center_line") == "true") {
			this.centerLineTween.progress(1);
		}

		this.gridTween = gsap.fromTo(
			this.$cols,
			{
				scaleY: 0,
				transformOrigin: "bottom",
			},
			{
				scaleY: 1,
				duration: 1.6,
				ease: "expo.inOut",
				stagger: 0.025,
				paused: true,
			}
		);

		this.gsapInstances.push(this.gridTween);

		if (this.getCookie("dev_utils_show_grid") == "true") {
			this.gridTween.progress(1);
		}

		this._keydownHandler = this.keydown.bind(this);
		document.addEventListener("keydown", this._keydownHandler);
	}

	keydown(event) {
		if (event.shiftKey && event.key === "C") {
			this.toggleCenterLine();
		} else if (event.shiftKey && event.key === "G") {
			this.toggleGrid();
		}
	}

	toggleCenterLine() {
		if (this.centerLineTween.reversed() || (this.centerLineTween.paused() && this.centerLineTween.progress() != 1)) {
			this.centerLineTween.play();
			this.setCookie("dev_utils_show_center_line", "true");
		} else {
			this.centerLineTween.reverse();
			this.setCookie("dev_utils_show_center_line", "false");
		}
	}

	toggleGrid() {
		if (this.gridTween.reversed() || (this.gridTween.paused() && this.gridTween.progress() != 1)) {
			this.gridTween.play();
			this.setCookie("dev_utils_show_grid", "true");
		} else {
			this.gridTween.reverse();
			this.setCookie("dev_utils_show_grid", "false");
		}
	}

	setCookie(cname, cvalue) {
		document.cookie = cname + "=" + cvalue + ";" + ";path=/";
	}

	getCookie(cname) {
		let name = cname + "=";
		let decodedCookie = decodeURIComponent(document.cookie);
		let ca = decodedCookie.split(";");
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) == " ") {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}

	destroy() {
		document.removeEventListener("keydown", this._keydownHandler);

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
