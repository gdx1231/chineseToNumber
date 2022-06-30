(function (global, factory) {
	if (typeof module === "object" && typeof module.exports === "object") {
		module.exports = factory();
	} else {
		factory(global);
	}
})(typeof window !== "undefined" ? window : this, function (global) {
	let chnNumChar = {
		'零': 0, '0': 0, "０": 0, 'o': 0, 'O': 0,
		'一': 1, '壹': 1, '1': 1, "１": 1,
		'二': 2, '贰': 2, '2': 2, "２": 2, '两': 2, '俩': 2,
		'三': 3, '叁': 3, '3': 3, "３": 3,
		'四': 4, '肆': 4, '4': 4, "４": 4,
		'五': 5, '伍': 5, '5': 5, "５": 5,
		'六': 6, '陆': 6, '6': 6, "６": 6,
		'七': 7, '柒': 7, '7': 7, "７": 7,
		'八': 8, '捌': 8, '8': 8, "８": 8,
		'九': 9, '玖': 9, '9': 9, "９": 9
	};
	let chnNameValue = {
		'十': { value: 10, first: true },
		'拾': { value: 10, first: true },
		'什': { value: 10, first: true },
		'百': { value: 100 },
		'佰': { value: 100 },
		'陌': { value: 100 },
		'千': { value: 1000 },
		'阡': { value: 1000 },
		'仟': { value: 1000 },
		'k': { value: 1000, stop: true },
		'K': { value: 1000, stop: true },
		'万': { value: 10000, stop: true },
		'萬': { value: 10000, stop: true },
		'M': { value: 1000 * 1000, stop: true }, // million
		'm': { value: 1000 * 1000, stop: true },
		'亿': { value: 100000000, stop: true },
		'b': { value: 1000 * 1000 * 1000, stop: true }, //billion
		'B': { value: 1000 * 1000 * 1000, stop: true }
	};
	let negatives = {
		'-': true,
		'负': true,
		'－': true
	};
	let positives = {
		'+': true,
		'正': true
	};
	let skipTails = {
		'整': true
	};
	function newPart() {
		return { number: 0, scale: 1, items: [] };
	}

	function convertToParts(strs) {
		let parts = [newPart()];
		let prevName = null;
		for (let i = 0; i < strs.length; i++) {
			let alpha = strs[i];

			let name = chnNameValue[alpha];
			let num = chnNumChar[alpha];
			parts[parts.length - 1].items.push([alpha, name, num]);
			if (name) {
				if ((i == 0) && name.first) { //十
					let number = 10;
					parts[parts.length - 1].number = number;
				} else if (name.stop) {
					parts[parts.length - 1].scale = name.value || 1;
					// 创建新的片段
					parts.push(newPart());
					scale = 1;
					prevName = null;
				} else {
					if (i == strs.length - 1) {
						console.log(name)
						parts[parts.length - 1].number.scale = name.value;
					}
					prevName = name;
				}
				continue;
			}

			if (num == null) {
				throw '非数字或单位：' + alpha;
			}
			num = (num);

			let nextChar = i == strs.length - 1 ? null : strs[i + 1];
			let nextName = i == strs.length - 1 ? null : chnNameValue[nextChar];
			let nextNum = chnNumChar[nextChar];

			if (nextName && nextName.stop) {
				nextName = null;
			}
			let lastNum = parts[parts.length - 1].number;
			let number;

			let items = parts[parts.length - 1].items;
			let itemPre = items[items.length - 2];//上一个
			let itemPrePre = items[items.length - 3];// 上上个
			if (nextName == null) {
				if (prevName == null) {//连续的数字，例如 203
					let skipTen = false;
					if (itemPre && itemPre[2] === 0) {
						if (itemPrePre && itemPrePre[1] != null/*是单位 */) {//捌仟零六 的零
							skipTen = true;
						}
					} else if (itemPre && itemPre[1] && itemPre[1].value === 10) { //十六
						skipTen = true;
					}

					if (skipTen) {
						number = lastNum + num;
					} else {
						number = lastNum * 10 + num;
					}
				} else {// 例如 二千五，运算到五
					if (itemPre && itemPre[1] && itemPre[1].value === 10 && (itemPrePre == null || itemPrePre[2] === 0 || itemPrePre[1] != null)) { //十六
						number = lastNum + num + 10;
					} else {
						number = lastNum + num;
					}
				}
			} else {
				if (prevName == null) { // 例如 二千零五十
					number = lastNum + num * (nextName.value);
				} else {
					number = lastNum + num * (nextName.value);
				}
			}
			parts[parts.length - 1].number = number;
			prevName = null;
			//console.log(`num=${num},  number=${number}`);
		}
		//console.log(parts)
		return parts;
	}
	function convertJflhNum(strs, alpha, loc) {
		let fenv = strs[loc - 1];
		let fenNum = chnNumChar[fenv];
		if (!fenNum) {
			return -1;
		}
		//一元=10角，一元=100分，一元=1000厘，一元=10000毫
		if (alpha == '角') {
			return ("0." + fenNum) * 1;
		} else if (alpha == '分') {
			return ("0.0" + fenNum) * 1;
		} else if (alpha == '厘') {
			return ("0.00" + fenNum) * 1;
		} else if (alpha == '毫') {
			return ("0.000" + fenNum) * 1;
		} else {
			return -1;
		}
	}
	function convertJflh(strs) { // 角分厘毫
		let sum = 0;
		let inc = 0;
		for (let i = strs.length - 1; i >= 0; i -= 2) {
			let alpha = strs[i];
			let num = convertJflhNum(strs, alpha, i);
			if (num === -1) {
				break;

			} else {
				sum += num;
				inc++;
			}
		}
		return {
			sum: sum,
			inc: inc,
			strs: strs.splice(0, strs.length - inc * 2)
		};
	}
	/**
	 * 处理整数部分
	 * @param {*} strs 字符串
	 * @returns 整数
	 */
	function convert(strs) {
		let jiaofen = convertJflh(strs);
		// console.log(jiaofen);

		strs = jiaofen.strs;

		let parts = convertToParts(strs);
		let last = 0;
		let scale1 = 1;
		for (let i = parts.length - 1; i >= 0; i--) {
			let part = parts[i];
			let p = part.number;
			scale1 = scale1 * part.scale;
			last += p * scale1;
		}
		return last + jiaofen.sum;
	}
	/**
	 * 处理·小数部分
	 * @param {*} strs 字符串
	 * @returns 小数
	 */
	function convertDot(strs) {
		let scale = 1;
		let skip = 0;
		for (let i = strs.length - 1; i >= 0; i--) {
			let alpha = strs[i];
			let name = chnNameValue[alpha]; // 结尾的连续单位，例如 0.35百万
			if (!name) {
				break;
			}
			scale *= name.value;
			skip++;
		}
		let newStrs = scale == 1 ? strs : strs.splice(0, strs.length - skip);

		let parts = convertToParts(newStrs);
		let last = 0;
		let scale1 = 1;
		for (let i = parts.length - 1; i >= 0; i--) {
			let part = parts[i];
			let p = part.number;
			scale1 = scale1 * part.scale;
			last += p * scale1;
		}
		let last1 = ("0." + last) * 1;

		return [last1, scale, newStrs.length];
	}
	function chineseToNumber(chnStr) {
		if (!chnStr) {
			return chnStr;
		}
		if (!isNaN(chnStr.toString())) {
			return chnStr.toString() * 1;
		}
		let chnStrs = chnStr.replace(/，|,| |元|圆/ig, '').replace(/点|。/ig, '.').split('.');
		if (chnStrs.length > 2) {
			throw '非数字表达式：' + chnStr;
		}
		let strs = chnStrs[0].split('');
		let dots = (chnStrs.length == 2 ? chnStrs[1] : "").split('');

		let isNegative = false;
		let alpha = strs[0];
		if (negatives[alpha]) { // 负，- 
			isNegative = true;
			strs = strs.splice(1);
		} else if (positives[alpha]) { // 正，+
			isNegative = false;
			strs = strs.splice(1);
		}

		let lastAlpha = strs[strs.length - 1];
		if (skipTails[lastAlpha]) { //整
			strs = strs.splice(0, strs.length - 1);
		} else if (dots.length > 1) {
			lastAlpha = dots[dots.length - 1];
			if (skipTails[lastAlpha]) { //整
				dots = dots.splice(0, dots.length - 1);
			}
		}

		let number = convert(strs); // 
		let number1 = dots.length > 0 ? convertDot(dots) : 0;
		if (number1 == 0) { // 没有小数
			return number * (isNegative ? -1 : 1);
		}

		// console.log(number, number1)

		let fixed = number1[2] < 0 ? 0 : number1[2];
		let scale = number1[1];
		return ((number + number1[0]) * scale).toFixed(fixed) * (isNegative ? -1 : 1);

	}
	if (typeof window != 'undefined' && window.EWA && window.EWA_Utils) {
		window.EWA_Utils.chineseToNumber = chineseToNumber;
	} else if (global) {
		global.chineseToNumber = chineseToNumber;
	} else {
		return chineseToNumber;
	}
});