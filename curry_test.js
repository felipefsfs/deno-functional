import {
    assertEquals,
  } from "https://deno.land/std/testing/asserts.ts"
import { curry } from "./curry.js";


Deno.test("curry 0 args", function () {
  const c = curry(f1);
  assertEquals(c(), f1());
  const ca = curry(f1a);
  assertEquals(ca(), f1a());
  function f1() {
    return 10;
  }
  function f1a(a=9, b=100) {
    return a + b ;
  }
});

Deno.test("curry 1 arg", function () {
  const c = curry(f1);
  assertEquals(c(10), f1(10));
  const ca = curry(f1a);
  assertEquals(ca(10), f1a(10));
  function f1(a) {
    return a + 1;
  }
  function f1a(a, b=100) {
    return a + b + 1;
  }
});

Deno.test("curry more args", function () {
  const c = curry(f2);
  assertEquals(c(10)(9), f2(10,9));
  const ca = curry(f2a);
  assertEquals(ca(10)(9), f2a(10,9));
  const c3 = curry(f3);
  assertEquals(c3(10)(9)(1), f3(10,9,1));
  function f2(a, b) {
    return a + b;
  }
  function f2a(a, b, c=2) {
    return a + b + c;
  }
  function f3(a, b, c) {
    return a + b + c;
  }
});
