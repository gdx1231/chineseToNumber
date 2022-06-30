# 中英文混合数字识别

转换混合的中英文，支持阿拉伯数字、中文数字、会计数字转换为数字。这个项目是[emp-script-static]<https://github.com/gdx1231/emp-script-static>的一部分，分出来作为独立项目使用。


## 引用

```js
npm i zwsz
const chineseToNumber = require("./dist/chineseToNumber.min");
```
## 网页使用
```html
<script src="yourpath/dist/chineseToNumber.min.js"></script>

<input type="text" id="total" placeholder='输入100万试试'>
<script>
	document.getElementById('total').onblur = function(){
		if(this.value.trim() === ""){
			return;
		}
		try {
			this.value = chineseToNumber(this.value);
		} catch(e) {
			alert('非数字')
		}
	};
</script>
```
## 转换
```js
chineseToNumber("123万") = 1230000
chineseToNumber("4万万") = 400000000
chineseToNumber("12k") = 12000
chineseToNumber("8m") = 8000000
chineseToNumber("12.34567万") = 123456.7
chineseToNumber("一百二十叁万") = 1230000
chineseToNumber("负壹佰贰拾叁万") = -1230000
chineseToNumber("叁拾贰万捌仟零壹拾陆元整") = 328016
chineseToNumber("叁拾贰万捌仟零拾陆元柒角捌分") = 328016.78
chineseToNumber("叁拾贰万捌仟拾陆元捌分") = 328016.08
chineseToNumber("叁拾贰万捌仟零陆元柒角捌分玖厘贰毫") = 328006.7892
chineseToNumber("二零零二") = 2002
chineseToNumber("二00二") = 2002
chineseToNumber("-0.三") = -0.3
chineseToNumber("零点叁") = 0.3
chineseToNumber("负零点叁五") = -0.35
```
## 数字
```js
chnNumChar = {
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
```
## 单位
```js
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
```
## 负数符号
```js
	let negatives = {
		'-': true,
		'负': true,
		'－': true
	};
```
## 正数符号
```js
	let positives = {
		'+': true,
		'正': true
	};
```