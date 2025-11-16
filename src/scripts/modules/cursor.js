import { module as modujs } from "modujs";

import { gsap } from "gsap";

export default class extends modujs {
	constructor(m) {
		super(m);

		this.queue = [];
		this.isTyping = false;
		this.typingSpeed = 30; // chars per second
		this.pauseChars = { ",": 200, ".": 250, "?": 1000 };
		this.erasingSpeed = 500; // total time
		this.eraseDelay = 250;
		this.queueDelay = 1000;
	}

	init() {
		this.$text = this.$("text")[0];

		this._mousemoveHandler = this.mousemove.bind(this);
		window.addEventListener("mousemove", this._mousemoveHandler);

		gsap.set(this.el, {
			yPercent: -100,
		});

		this.xTo = gsap.quickTo(this.el, "x", { duration: 0.4, ease: "expo.out" });
		this.yTo = gsap.quickTo(this.el, "y", { duration: 0.4, ease: "expo.out" });

		this.log("hi there, nice to see you");
		this.log("im cursor, i’ll show you around");
		this.log("you ever think about why there’s something rather than nothing? if I was a human this thought would f%$k me up");
		this.log("im cursor, i’ll show you around");
		this.log("hi there, nice to see you");
	}

	mousemove(e) {
		this.x = e.clientX + 4;
		this.y = e.clientY - 4;

		this.xTo(this.x);
		this.yTo(this.y);
	}

	log(message) {
		this.queue.push(message);

		if (!this.isTyping) {
			this.type();
		}
	}

	async type() {
		const message = this.queue.shift();

		if (!message) {
			this.isTyping = false;
			return;
		}

		this.isTyping = true;

		await this.erase();

		let i = 0;

		const tick = () => {
			this.$text.textContent += message[i];
			const char = message[i];
			i++;

			if (i < message.length) {
				if (char == " ") {
					tick();
				} else {
					const pause = this.pauseChars[char] || 0;
					setTimeout(tick, (1 / this.typingSpeed) * 1000 + pause);
				}
			} else {
				setTimeout(() => {
					this.type();
				}, this.queueDelay);
			}
		};

		tick();
	}

	async erase() {
		return new Promise((resolve) => {
			const text = this.$text.textContent;
			const length = text.trim().length;
			const timeout = this.erasingSpeed / length;

			const tick = () => {
				if (this.$text.textContent.length === 0) {
					setTimeout(() => {
						resolve();
					}, this.eraseDelay);

					return;
				}

				this.$text.textContent = this.$text.textContent.slice(0, -1);

				if (this.$text.textContent.slice(-1) == " ") {
					tick();
				} else {
					setTimeout(tick, timeout);
				}
			};

			tick();
		});
	}

	destroy() {}
}
