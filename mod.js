import { curry } from "./curry.js";
import { split, replace, intercalate, toLowerCase, concat } from "./stringy.js";
import { add } from "./numbers.js";
import { reduce, map, sortBy } from "./arrays.js";
import { prop } from "./objects.js";
import { compose, pipe } from "./funcs.js";
export {
  curry,
  split,
  reduce,
  compose,
  map,
  replace,
  intercalate,
  toLowerCase,
  prop,
  add,
  concat,
};

const l = console.log;
if (import.meta.main) {
  ex_ch5();
  //ex_ch4();
}

function ex_ch5() {
  const toUpperCase = (x) => x.toUpperCase();
  const exclaim = (x) => `${x}!`;
  const shout = compose(exclaim, toUpperCase);

  l(shout("send in the clowns")); // "SEND IN THE CLOWNS!"
  const head = (x) => x[0];
  const reverse = reduce((acc, x) => [x, ...acc], []);
  const last = compose(head, reverse);

  l(last(["jumpkick", "roundhouse", "uppercut"])); // 'uppercut'

  // previously we'd have to write two composes, but since it's associative,
  // we can give compose as many fn's as we like and let it decide how to group them.
  const arg = ["jumpkick", "roundhouse", "uppercut"];
  const lastUpper = compose(toUpperCase, head, reverse);
  const loudLastUpper = compose(exclaim, toUpperCase, head, reverse);

  l(lastUpper(arg)); // 'UPPERCUT'
  l(loudLastUpper(arg)); // 'UPPERCUT!'

  // pointfree
  // NOTE: we use 'intercalate' from the appendix instead of 'join' introduced in Chapter 09!
  const initials = compose(
    intercalate(". "),
    map(compose(toUpperCase, head)),
    split(" "),
  );

  l(initials("hunter stockton thompson")); // 'H. S. T'

  const trace = curry((tag, x) => {
    console.log("T >>", tag, ">>", x);
    return x;
  });
  const dasherize = compose(
    intercalate("-"),
    map(toLowerCase),
    trace("after split"),
    split(" "),
    replace(/\s{2,}/ig, " "),
  );

  l(dasherize("The world is a vampire"));
  // after split [ 'The', 'world', 'is', 'a', 'vampire' ]

  // We consider Car objects of the following shape:
  //   {
  //     name: 'Aston Martin One-77',
  //     horsepower: 750,
  //     dollar_value: 1850000,
  //     in_stock: true,
  //   }
  // Use `compose()` to rewrite the function below.

  const cars = [
    {
      name: "Aston Martin One-77",
      horsepower: 750,
      dollar_value: 1850000,
      in_stock: true,
    },
    {
      name: "Another Car",
      horsepower: 300,
      dollar_value: 10000,
      in_stock: false,
    },
  ];
  // isLastInStock :: [Car] -> Boolean
  const isLastInStock = (cars) => {
    const lastCar = last(cars);
    return prop("in_stock", lastCar);
  };
  const $isLastInStock = compose(prop("in_stock"), last);
  l(isLastInStock(cars));
  l($isLastInStock(cars));
  l(isLastInStock(reverse(cars)));
  l($isLastInStock(reverse(cars)));

  // Considering the following function:
  //   const average = xs => reduce(add, 0, xs) / xs.length;
  // Use the helper function `average` to refactor `averageDollarValue` as a composition.

  const average = (xs) => reduce(add, 0, xs) / xs.length;
  // averageDollarValue :: [Car] -> Int
  const averageDollarValue = (cars) => {
    const dollarValues = map((c) => c.dollar_value, cars);
    return average(dollarValues);
  };
  const $averageDollarValue = compose(average, map(prop("dollar_value")));
  l(averageDollarValue(cars));
  l($averageDollarValue(cars));

  // Refactor `fastestCar` using `compose()` and other functions in pointfree-style.

  // fastestCar :: [Car] -> String
  const fastestCar = (cars) => {
    const sorted = sortBy((car) => car.horsepower, cars);
    const fastest = last(sorted);
    return concat(fastest.name, " is the fastest");
  };
  const $fastestCar = compose(
    (name) => concat(name, " is the fastest"),
    prop("name"),
    last,
    sortBy(prop("horsepower")),
  );
  l(fastestCar(cars));
  l($fastestCar(cars));
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
