import { test } from "node:test";
import assert from "node:assert/strict";
import { cartLines, phone, email, password, text, InputError } from "../lib/validation";
import User from "../models/User";
import Order from "../models/Order";
import reducer, { addToCart, setCart, updateQuantity } from "../store/cartSlice";
const id = "abcdef0123456789abcdef01";
test("duplicate and case-variant product IDs share one inventory reservation", () => {
  assert.deepEqual(cartLines([{ product: id, quantity: 2 }, { productId: id.toUpperCase(), quantity: 3 }]), [{ product: id, quantity: 5 }]);
});
test("checkout rejects fractional, nonfinite, string, negative and oversized quantities", () => {
  for (const quantity of [1.5, Infinity, NaN, "2", 0, -1, 1001]) assert.throws(() => cartLines([{ product: id, quantity }]), InputError);
  assert.throws(() => cartLines([{ product: id, quantity: 600 }, { product: id, quantity: 600 }]), InputError);
});
test("checkout rejects empty carts, malformed lines and invalid IDs", () => {
  for (const items of [[], null, [null], [{}], [{ product: "bad", quantity: 1 }]]) assert.throws(() => cartLines(items), InputError);
});
test("delivery and registration fields normalize and reject invalid input", () => {
  assert.equal(email(" Example@Mail.com "), "example@mail.com");
  assert.equal(phone(" 9876543210 "), "9876543210");
  for (const value of ["", "1234567890", 9876543210]) assert.throws(() => phone(value));
  assert.throws(() => email("bad@")); assert.throws(() => text(" ", "Name"));
  assert.throws(() => password("short")); assert.throws(() => password("é".repeat(37)));
  assert.equal(password("a valid password"), "a valid password");
});
test("user schema persists mobile numbers and defines a unique sparse index for legacy accounts", () => {
  const user = new User({ name: "Test", email: "test@example.com", password: "hash", phone: "9876543210" });
  assert.equal(user.toObject().phone, "9876543210");
  assert.ok(User.schema.indexes().some(([keys, options]) => keys.phone === 1 && options.unique && options.sparse));
});
test("idempotency is unique per user without blocking legacy orders", () => {
  assert.ok(Order.schema.indexes().some(([keys, options]) => keys.user === 1 && keys.requestKey === 1 && options.unique && options.partialFilterExpression));
});
const item = { _id: id, name: "Cleanser", price: 200, image: "/product.png", stock: 3, quantity: 2 };
test("cart enforces stock limits and rejects fractional updates", () => {
  let state = reducer(undefined, addToCart(item));
  state = reducer(state, addToCart(item)); assert.equal(state.items[0].quantity, 3);
  state = reducer(state, updateQuantity({ id, quantity: 1.5 })); assert.equal(state.items[0].quantity, 3);
  assert.equal(reducer(undefined, addToCart({ ...item, stock: 0 })).items.length, 0);
});
test("invalid persisted cart entries cannot poison totals", () => {
  const state = reducer(undefined, setCart([{ ...item, price: NaN }, { ...item, quantity: -1 }, { ...item, quantity: 20 }]));
  assert.equal(state.items.length, 1); assert.equal(state.items[0].quantity, 3);
});
