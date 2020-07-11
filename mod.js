import { curry } from "./curry.js";
import { split } from "./stringy.js";
import { reduce } from "./arrays.js";
export {
  curry,
  split,
  reduce,
};

const l = console.log;
if (import.meta.main) {
  ex_ch4();
}
function ex_ch4() {
  const match = curry((what, s) => s.match(what));
  const replace = curry((what, replacement, s) => s.replace(what, replacement));
  const filter = curry((f, xs) => xs.filter(f));
  const map = curry((f, xs) => xs.map(f));
  l(match(/r/g, "hello world")); // [ 'r' ]

  const hasLetterR = match(/r/g); // x => x.match(/r/g)
  l(hasLetterR("hello world")); // [ 'r' ]
  l(hasLetterR("just j and s and t etc")); // null

  l(filter(hasLetterR, ["rock and roll", "smooth jazz"])); // ['rock and roll']

  const removeStringsWithoutRs = filter(hasLetterR); // xs => xs.filter(x => x.match(/r/g))
  l(removeStringsWithoutRs(["rock and roll", "smooth jazz", "drum circle"])); // ['rock and roll', 'drum circle']

  const noVowels = replace(/[aeiou]/ig); // (r,x) => x.replace(/[aeiou]/ig, r)
  const censored = noVowels("*"); // x => x.replace(/[aeiou]/ig, '*')
  l(censored("Chocolate Rain")); // 'Ch*c*l*t* R**n'

  // Refactor to remove the string argument by partially applying the functions.
  // words :: String -> [String]
  const words = (str) => split(" ", str);
  const $words = split(" ");
  l(words("asd wer eeee"));
  l($words("asd wer eeee"));

  // Refactor to remove all arguments by partially applying the functions.
  // filterQs :: [String] -> [String]
  const filterQs = (xs) => filter((x) => x.match(/q/i), xs);
  const $filterQs = filter((x) => x.match(/q/i));
  l(filterQs(["asdf", "qwer", "trq0", "234ç"]));
  l($filterQs(["asdf", "qwer", "trq0", "234ç"]));

  // Considering the following function:
  //   const keepHighest = (x, y) => (x >= y ? x : y);
  // Refactor `max` to not reference any arguments using the helper function `keepHighest`.
  // max :: [Number] -> Number
  const max = (xs) => reduce((acc, x) => (x >= acc ? x : acc), -Infinity, xs);
  const keepHighest = (x, y) => (x >= y ? x : y);
  const $max = reduce(keepHighest, -Infinity);
  l(max([1, 4, 7, 9, 3, 0]));
  l($max([1, 4, 7, 9, 3, 0]));
  
}
