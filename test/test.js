
const assert = require('assert').strict;
const chineseToNumber = require('../dist/chineseToNumber');

let testMap = {
    "123万": 1230000,
    "4万万": 400000000,
    "12k": 12000,
    "8m": 8000000,
    "12.34567万": 123456.7,
    "一百二十叁万": 1230000,
    "负壹佰贰拾叁万": -1230000,
    "叁拾贰万捌仟零壹拾陆元整": 328016,
    "叁拾贰万捌仟零拾陆元柒角捌分": 328016.78,
    "叁拾贰万捌仟拾陆元捌分": 328016.08,
    "叁拾贰万捌仟零陆元柒角捌分玖厘贰毫": 328006.7892,
    "二零零二": 2002,
    "二00二": 2002,
    "-0.三": -0.3,
    "零点叁": 0.3,
    "负零点叁五": -0.35
};
describe('Test', () => {
    for (let chn in testMap) {
        let result0 = testMap[chn];
        let result = chineseToNumber(chn);
        console.log(`chineseToNumber("${chn}") = ${result}`);
        assert.deepStrictEqual(result, result0);
    }
});