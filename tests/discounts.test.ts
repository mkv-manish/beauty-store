import { test } from "node:test";
import assert from "node:assert/strict";
import { discountFor } from "../lib/discounts";
const offers = [{ code: "CARE10", percent: 10, minSubtotal: 499, maxDiscount: 200 }];
test("discount codes normalize, respect minimum spend and cap savings", () => {
  assert.deepEqual(discountFor(" care10 ", 499, offers), { code: "CARE10", discount: 49.9 });
  assert.equal(discountFor("CARE10", 4000, offers).discount, 200);
  assert.throws(() => discountFor("CARE10", 498, offers));
  assert.throws(() => discountFor("FAKE", 1000, offers));
  assert.deepEqual(discountFor("", 1000, offers), { code: "", discount: 0 });
});
test("discounts expire, round to paise and cannot exceed order value", () => {
  assert.equal(discountFor("CARE10", 499.55, offers).discount, 49.96);
  assert.throws(() => discountFor("CARE10", 1000, [{ ...offers[0], expiresAt: "2020-01-01" }]));
  assert.equal(discountFor("FULL", 10, [{ code: "FULL", percent: 100, minSubtotal: 0, maxDiscount: 200 }]).discount, 10);
});
