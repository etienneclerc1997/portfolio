/**
 * Utility function to linear interpolate values.
 *
 * @param {number} start - Value to lerp.
 * @param {number} end - Target value.
 * @param {number} amount - Easing.
 *
 * @returns {number} Lerped value.
 */
export function lerp(start, end, amt) {
	return (1 - amt) * start + amt * end;
}

/**
 * Utility function to get width with margins included.
 *
 * @param {HTMLElement} el - Element you want to calculate the outer width of.
 *
 * @returns {number} - The element's outer with.
 */
export function outerWidth(el) {
	var width = el.offsetWidth;
	var style = getComputedStyle(el);

	width += parseInt(style.marginLeft) + parseInt(style.marginRight);
	return width;
}

/**
 * Shortcut for rounding number to second decimal place.
 *
 * @param {number} numer - Number to round.
 *
 * @returns {number} - Rounded number to second decimal place.
 */
export function round(number) {
	return Math.round((number + Number.EPSILON) * 100) / 100;
}

/**
 * Utility function to check of the device is a touch device.
 *
 * @returns {boolean} - If device is a touch device or not.
 */
export function isTouchDevice() {
	return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}
