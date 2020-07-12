import { curry } from "./curry.js";
import {
  split,
  replace,
  intercalate,
  toLowerCase,
  toUpperCase,
  concat,
  append,
  match,
  toString,
} from "./stringy.js";
import { add } from "./numbers.js";
import { reduce, map, sortBy, head, last, find } from "./arrays.js";
import { prop, safeProp } from "./objects.js";
import { compose, pipe, eq } from "./funcs.js";
import {
  Maybe,
  Left,
  Right,
  Either,
  IO,
  Task,
  createCompose,
} from "./alg_structs.js";
import { trace } from "./impure_helpers.js";
export {
  curry,
  split,
  reduce,
  compose,
  map,
  replace,
  intercalate,
  toLowerCase,
  toUpperCase,
  prop,
  add,
  concat,
  append,
};

const l = console.log;
if (import.meta.main) {
  //ex_ch5();
  //ex_ch4();
  ex_ch8();
}

function ex_ch8() {
  class Container {
    constructor(x) {
      this.$value = x;
    }

    static of(x) {
      return new Container(x);
    }
  }
  // (a -> b) -> Container a -> Container b
  Container.prototype.map = function (f) {
    return Container.of(f(this.$value));
  };

  l(Container.of(3));
  // Container(3)
  l(Container.of("hotdogs"));
  // Container("hotdogs")
  l(Container.of(Container.of({ name: "yoda" })));
  // Container(Container({ name: 'yoda' }))
  l(Container.of(2).map((two) => two + 2));
  // Container(4)
  l(Container.of("flamethrowers").map((s) => s.toUpperCase()));
  // Container('FLAMETHROWERS')
  l(Container.of("bombs").map(append(" away")).map(prop("length")));
  // Container(10)

  l(Maybe.of("Malkovich Malkovich").map(match(/a/ig)));
  // Just(True)
  l(Maybe.of(null).map(match(/a/ig)));
  // Nothing
  l(Maybe.of({ name: "Boris" }).map(prop("age")).map(add(10)));
  // Nothing
  l(Maybe.of({ name: "Dinah", age: 14 }).map(prop("age")).map(add(10)));
  // Just(24)

  // safeHead :: [a] -> Maybe(a)
  const safeHead = (xs) => Maybe.of(xs[0]);
  // streetName :: Object -> Maybe String
  const streetName = compose(map(prop("street")), safeHead, prop("addresses"));
  l(streetName({ addresses: [] }));
  // Nothing
  l(streetName({ addresses: [{ street: "Shady Ln.", number: 4201 }] }));
  // Just('Shady Ln.')

  // withdraw :: Number -> Account -> Maybe(Account)
  const withdraw = curry((amount, { balance }) =>
    Maybe.of(balance >= amount ? { balance: balance - amount } : null)
  );
  // This function is hypothetical, not implemented here... nor anywhere else.
  // updateLedger :: Account -> Account
  const updateLedger = (account) => account;
  // remainingBalance :: Account -> String
  const remainingBalance = ({ balance }) => `Your balance is $${balance}`;
  // finishTransaction :: Account -> String
  const finishTransaction = compose(remainingBalance, updateLedger);
  // getTwenty :: Account -> Maybe(String)
  const getTwenty = compose(map(finishTransaction), withdraw(20));
  l(getTwenty({ balance: 200.00 }));
  // Just('Your balance is $180')
  l(getTwenty({ balance: 10.00 }));
  // Nothing

  // maybe :: b -> (a -> b) -> Maybe a -> b
  const maybe = curry((v, f, m) => {
    if (m.isNothing) {
      return v;
    }
    return f(m.$value);
  });
  // getTwenty :: Account -> String
  const getTwenty2 = compose(
    maybe("You're broke!", finishTransaction),
    withdraw(20),
  );
  l(getTwenty2({ balance: 200.00 }));
  // 'Your balance is $180.00'
  l(getTwenty2({ balance: 10.00 }));
  // 'You\'re broke!'

  const left = (x) => new Left(x);

  l(Either.of("rain").map((str) => `b${str}`));
  // Right('brain')
  l(
    left("rain").map((str) => `It's gonna ${str}, better bring your umbrella!`),
  );
  // Left('rain')
  l(Either.of({ host: "localhost", port: 80 }).map(prop("host")));
  // Right('localhost')
  l(left("rolls eyes...").map(prop("host")));
  // Left('rolls eyes...')

  //momment placeholder
  const moment = (d = "", fmt = "") => {
    const date = store_moment();
    return {
      diff,
      isValid,
      [Deno.customInspect]() {
        return `moment(${(isValid()) && (d || "NOW") || "INVALID"})`;
      },
      y() {
        return date.y;
      },
      m() {
        return date.m;
      },
      d() {
        return date.d;
      },
    };
    function store_moment() {
      if (d === "") {
        const tempd = new Date();
        return {
          y: tempd.getFullYear(),
          m: tempd.getMonth() + 1,
          d: tempd.getDate(),
        };
      }
      const valid_formats = {
        "YYYY-MM-DD": [0, 1, 2],
        "DD-MM-YYYY": [2, 1, 0],
      };
      const format = valid_formats[fmt];
      if (!format) {
        return;
      }
      const ds = d.split("-");
      return {
        y: Number(ds[format[0]]),
        m: Number(ds[format[1]]) + 1,
        d: Number(ds[format[2]]),
      };
    }
    function isValid() {
      return (date !== undefined) &&
        (!isNaN(date.y) && !isNaN(date.m) && !isNaN(date.d));
    }
    function diff(another_moment, kind = "") {
      if (kind == "years") {
        return date.y - another_moment.y();
      }
      if (kind == "months") {
        return date.m - another_moment.m();
      }
      if (kind == "days") {
        return date.d - another_moment.d();
      }
    }
  };
  // getAge :: Date -> User -> Either(String, Number)
  const getAge = curry((now, user) => {
    const birthDate = moment(user.birthDate, "YYYY-MM-DD");
    return birthDate.isValid()
      ? Either.of(now.diff(birthDate, "years"))
      : left("Birth date could not be parsed");
  });
  l(moment());
  l(getAge(moment(), { birthDate: "2005-12-12" }));
  // Right(9)
  l(getAge(moment(), { birthDate: "July 4, 2001" }));
  // Left('Birth date could not be parsed'
  // fortune :: Number -> String
  const fortune = compose(
    concat("If you survive, you will be "),
    toString,
    add(1),
  );
  // zoltar :: User -> Either(String, _)
  const zoltar = compose(map(console.log), map(fortune), getAge(moment()));
  l(zoltar({ birthDate: "2005-12-12" }));
  // 'If you survive, you will be 10'
  // Right(undefined)
  l(zoltar({ birthDate: "balloons!" }));
  // Left('Birth date could not be parsed')

  const id = (x) => x;
  // either :: (a -> c) -> (b -> c) -> Either a b -> c
  const either = curry((f, g, e) => {
    let result;
    switch (e.constructor) {
      case Left:
        result = f(e.$value);
        break;
      case Right:
        result = g(e.$value);
        break;
        // No Default
    }
    return result;
  });
  // zoltar :: User -> _
  const zoltar2 = compose(console.log, either(id, fortune), getAge(moment()));
  zoltar2({ birthDate: "2005-12-12" });
  // 'If you survive, you will be 10'
  // undefined
  zoltar2({ birthDate: "balloons!" });
  // 'Birth date could not be parsed'
  // undefined

  // ioWindow :: IO Window
  const ioWindowd = new IO(() => window.Deno);
  l(ioWindowd.map((win) => win.pid));
  l(ioWindowd.map((win) => win.pid).unsafePerformIO());
  // IO(1430)
  l(
    ioWindowd
      .map(prop("version"))
      .map(prop("deno"))
      .map(split(".")).unsafePerformIO(),
  );
  //mocking document
  const document = {
    querySelectorAll(selector) {
      if (selector === "#myDiv") {
        return [{
          innerHTML: "<>",
        }];
      }
    },
  };
  // IO(['http:', '', 'localhost:8000', 'blog', 'posts'])
  // $ :: String -> IO [DOM]
  const $ = (selector) => new IO(() => document.querySelectorAll(selector));
  l($("#myDiv").map(head).map((div) => div.innerHTML).unsafePerformIO());
  // IO('I am some inner html')

  //mock location url
  const _url =
    "https://www.amazon.com.br/s?k=memoria+ram+sodimm+ddr4+16gb&s=price-asc-rank&page=4&__mk_pt_BR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&qid=1592169093&ref=sr_pg_3";
  // url :: IO String
  const url = new IO(() => _url);
  // toPairs :: String -> [[String]]
  const toPairs = compose(map(split("=")), split("&"));
  // params :: String -> [[String]]
  const params = compose(toPairs, last, split("?"));
  // findParam :: String -> IO Maybe [String]
  const findParam = (key) =>
    map(compose(Maybe.of, find(compose(eq(key), head)), params), url);
  // -- Impure calling code ----------------------------------------------
  // run it by calling $value()!
  l(findParam("s").unsafePerformIO());
  // Just(['searchTerm', 'wafflehouse'])

  // -- Node readFile example ------------------------------------------
  //const fs = require('fs');
  // readFile :: String -> Task Error String
  const readFile = (filename) =>
    new Task((reject, result) => {
      Deno.readTextFile(filename).then(result, reject);
    });
  readFile("makefile").map(split("\n")).map(head).fork(
    (x) => l("REFJ", x),
    (x) => l("OK", x),
  );
  // Task('One morning, as Gregor Samsa was waking up from anxious dreams, he discovered that
  // in bed he had been changed into a monstrous verminous bug.')
  // -- jQuery getJSON example -----------------------------------------
  // getJSON :: String -> {} -> Task Error JSON
  const getJSON = curry((url, params) =>
    new Task((reject, result) => {
      Deno.readTextFile(url + "/" + params).then(
        (str) => result(JSON.parse(str)),
        reject,
      );
      //$.getJSON(url, params, result).fail(reject);
    })
  );
  getJSON(".vscode", "settings.json").map(prop("editor.tabSize")).fork(
    (x) => l("REFJ", x),
    (x) => l("OK", x),
  );
  //getJSON('/video', { id: 10 }).map(prop('title'));
  // Task('Family Matters ep 15')
  // -- Default Minimal Context ----------------------------------------
  // We can put normal, non futuristic values inside as well
  Task.of(3).map((three) => three + 1).fork(
    (x) => l("REFJ", x),
    (x) => l("OK", x),
  );
  // Task(4)
  const nested = Task.of([Either.of("pillows"), left("no sleep for you")]);
  l("nested", map(map(map(toUpperCase)), nested));
  // Task([Right('PILLOWS'), Left('no sleep for you')])

  //temp Compose class
  class Compose {
    constructor(fgx) {
      this.getCompose = fgx;
    }

    static of(fgx) {
      return new Compose(fgx);
    }

    map(fn) {
      return new Compose(map(map(fn), this.getCompose));
    }
  }
  const tmd = Task.of(Maybe.of("Rock over London"));
  const ctmd = Compose.of(tmd);
  ctmd.getCompose.fork(l, l);
  const ctmd2 = map(append(", rock on, Chicago"), ctmd);
  // Compose(Task(Just('Rock over London, rock on, Chicago')))
  //ctmd2.getCompose;
  ctmd2.getCompose.fork(l, l);
  // Task(Just('Rock over London, rock on, Chicago'))

  // Use `add` and `map` to make a function that increments a value inside a functor.
  // incrF :: Functor f => f Int -> f Int
  const incrF = map(add(1));
  l(incrF(Maybe.of(5)));
  l(incrF(Container.of(2)).$value === 3);

  // Given the following User object:
  const user = { id: 2, name: "Albert", active: true };
  // Use `safeProp` and `head` to find the first initial of the user.=
  // initial :: User -> Maybe String
  const initial = compose(map(head), safeProp("name"));
  l(initial(user));

  // Given the following helper functions:
  // showWelcome :: User -> String
  const showWelcome = compose(concat("Welcome "), prop("name"));
  // checkActive :: User -> Either String User
  const checkActive = function checkActive(user) {
    return user.active ? Either.of(user) : left("Your account is not active");
  };
  // Write a function that uses `checkActive` and `showWelcome` to grant access or return the error.
  // eitherWelcome :: User -> Either String String
  const eitherWelcome = compose(map(showWelcome), checkActive);
  l(eitherWelcome(user));
  l(eitherWelcome({}));

  // We now consider the following functions:
  // validateUser :: (User -> Either String ()) -> User -> Either String User
  const validateUser = curry((validate, user) =>
    validate(user).map((_) => user)
  );
  // save :: User -> IO User
  const save = (user) => new IO(() => ({ ...user, saved: true }));
  // Write a function `validateName` which checks whether a user has a name longer than 3 characters
  // or return an error message. Then use `either`, `showWelcome` and `save` to write a `register`
  // function to signup and welcome a user when the validation is ok.
  // Remember either's two arguments must return the same type.
  // validateName :: User -> Either String ()
  const validateName = function ({ name }) {
    return !name || name.length < 4
      ? left("Your name is not valid")
      : Either.of("ok");
  };
  // register :: User -> IO String
  const register = compose(
    either(IO.of, compose(map(showWelcome), save)),
    validateUser(validateName),
  );

  l(register(user).unsafePerformIO());
  l(register({}).unsafePerformIO()); //unsafePerformIO
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
    append(" is the fastest"),
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
