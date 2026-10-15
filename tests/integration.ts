import dotenv from "dotenv";
import mongoose from "mongoose";
import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import assert from "node:assert/strict";
import Product from "../models/Product";
import Order from "../models/Order";
import Review from "../models/Review";
import User from "../models/User";
async function main() {
dotenv.config({ path: ".env.local", quiet: true });
// A fresh generated database is the only database this test writes or drops.
const database = `bs_test_${randomUUID().replaceAll("-", "").slice(0, 20)}`;
const originalUri = process.env.MONGODB_URI;
if (!originalUri) throw new Error("MONGODB_URI is required.");
const uri = originalUri.replace(/(mongodb(?:\+srv)?:\/\/[^/]+)(?:\/[^?]*)?(.*)/, `$1/${database}$2`);
assert.ok(uri.includes(`/${database}`));
const base = "http://127.0.0.1:3002";
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "3002"], { env: { ...process.env, MONGODB_URI: uri, DISCOUNT_CODES: JSON.stringify([{ code: "TEST10", percent: 10, minSubtotal: 100, maxDiscount: 200 }]), JWT_SECRET: randomUUID() + randomUUID() }, stdio: "ignore" });
let cookie = "";
async function request(path: string, method = "GET", body?: unknown, extra: Record<string,string> = {}) {
  const response = await fetch(base + path, { method, headers: { "Content-Type": "application/json", Origin: base, ...(cookie ? { Cookie: cookie } : {}), ...extra }, ...(body ? { body: JSON.stringify(body) } : {}) });
  return { status: response.status, body: await response.json(), cookie: response.headers.get("set-cookie") };
}
try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  await Promise.all([Product.init(), Order.init(), User.init(), Review.init()]);
  for (let attempt = 0; attempt < 100; attempt++) {
    try { await fetch(base); break; } catch { await new Promise(resolve => setTimeout(resolve, 100)); }
  }
  const validSignup = { name: "Integration User", email: "integration@example.com", phone: "9876543210", password: "test-password-123" };
  for (const patch of [{ name: " " }, { email: "invalid" }, { phone: "1234567890" }, { password: "short" }]) {
    assert.equal((await request("/api/auth/register", "POST", { ...validSignup, ...patch })).status, 400);
  }
  assert.equal((await request("/api/orders/my-orders")).status, 401);
  assert.equal((await request("/api/auth/session")).body.user, null);
  const signup = await request("/api/auth/register", "POST", { name: "Integration User", email: "integration@example.com", phone: "9876543210", password: "test-password-123" });
  assert.equal(signup.status, 201); assert.equal(signup.body.user.phone, "9876543210"); assert.equal(signup.body.token, undefined);
  assert.match(signup.cookie!, /HttpOnly/i); assert.match(signup.cookie!, /SameSite=lax/i);
  cookie = signup.cookie!.split(";")[0];
  assert.equal((await request("/api/auth/session")).body.user.phone, "9876543210");
  assert.equal((await request("/api/auth/register", "POST", validSignup)).status, 409);
  assert.equal((await request("/api/auth/register", "POST", { ...validSignup, email: "different@example.com" })).status, 409);
  assert.equal((await request("/api/auth/login", "POST", { identifier: "9876543210", password: "wrong-password" })).status, 401);
  assert.equal((await request("/api/auth/login", "POST", { identifier: "123", password: "test-password-123" })).status, 400);
  const login = await request("/api/auth/login", "POST", { identifier: "9876543210", password: "test-password-123" });
  assert.equal(login.status, 200);
  const emailLogin = await request("/api/auth/login", "POST", { identifier: "INTEGRATION@EXAMPLE.COM", password: "test-password-123" });
  assert.equal(emailLogin.status, 200);
  cookie = emailLogin.cookie!.split(";")[0];
  const product = await Product.create({ name: "Test moisturizer", price: 200, stock: 3, category: "skin", image: "/images/moisturizer.png", description: "Test product", ingredients: "Test", howToUse: "Test" });
  const second = await Product.create({ name: "Test shampoo", price: 300, stock: 1, category: "hair", image: "/images/shampoo.png", description: "Test product", ingredients: "Test", howToUse: "Test" });
  const quote = await request("/api/checkout/quote", "POST", { items: [{ product: product.id, quantity: 1, price: 1 }], discountCode: "TEST10", total: 1 });
  assert.equal(quote.status, 200); assert.equal(quote.body.subtotal, 200); assert.equal(quote.body.discount, 20); assert.equal(quote.body.total, 180);
  assert.equal((await request("/api/checkout/quote", "POST", { items: [{ product: product.id, quantity: 1 }], discountCode: "FAKE" })).status, 400);
  assert.equal((await request(`/api/products/${product.id}/reviews`)).body.count, 0);
  assert.equal((await request(`/api/products/${product.id}/reviews`, "POST", { rating: 5, comment: "Lovely everyday care." })).status, 200);
  assert.equal((await request(`/api/products/${product.id}/reviews`, "POST", { rating: 4, comment: "Updated experience." })).status, 200);
  const reviews = await request(`/api/products/${product.id}/reviews`);
  assert.equal(reviews.body.count, 1); assert.equal(reviews.body.rating, 4); assert.equal(reviews.body.reviews[0].user, undefined);
  assert.equal((await request(`/api/products/${product.id}/reviews`, "POST", { rating: 6, comment: "Invalid" })).status, 400);
  const saved = await request(`/api/products?ids=${product.id}&limit=48`);
  assert.equal(saved.body.products.length, 1); assert.equal(saved.body.products[0].reviewCount, 1);
  const payload = (items: unknown[]) => ({ discountCode: "TEST10", price: 1, total: 1, name: "Test", phone: "9876543210", address: "Test delivery address", items });
  const submit = (items: unknown[], key = randomUUID()) => request("/api/orders", "POST", payload(items), { "Idempotency-Key": key });
  assert.equal((await submit([{ product: product.id, quantity: 1.5 }])).status, 400);
  assert.equal((await submit([{ product: product.id, quantity: 2 }, { product: product.id, quantity: 2 }])).status, 400);
  assert.equal((await Product.findById(product.id)).stock, 3);
  assert.equal((await submit([{ product: product.id, quantity: 1 }, { product: second.id, quantity: 2 }])).status, 400);
  assert.equal((await Product.findById(product.id)).stock, 3);
  const key = randomUUID();
  const repeated = await Promise.all([submit([{ product: product.id, quantity: 1 }], key), submit([{ product: product.id, quantity: 1 }], key)]);
  assert.ok(repeated.every(result => result.status === 200 || result.status === 201));
  assert.equal(repeated[0].body.order.total, 180); assert.equal(repeated[0].body.order.subtotal, 200); assert.equal(repeated[0].body.order.discount, 20);
  assert.equal(repeated[0].body.order._id, repeated[1].body.order._id);
  assert.equal((await Product.findById(product.id)).stock, 2);
  const concurrent = await Promise.all(Array.from({ length: 4 }, () => submit([{ product: product.id, quantity: 1 }])));
  assert.equal(concurrent.filter(result => result.status === 201).length, 2);
  assert.equal((await Product.findById(product.id)).stock, 0);
  assert.equal(await Order.countDocuments({}), 3);
  assert.equal((await request("/api/orders/my-orders")).body.length, 3);
  await Order.updateMany({}, { status: "Confirmed" });
  const home = await request("/api/products?home=true&limit=1");
  assert.equal(home.body.products.length, 1); assert.equal(home.body.total, 2); assert.equal(home.body.bestSellers[0]._id, product.id);
  assert.equal(home.body.bestSellers.length, 2); assert.equal(new Set(home.body.bestSellers.map((item: { _id: string }) => item._id)).size, 2);
  assert.equal((await request("/api/products?search=.*")).body.total, 0);
  assert.equal((await request("/api/products?category=hair")).body.total, 1);
  assert.equal((await request("/api/products?page=0")).status, 400);
  assert.equal((await request("/api/products/bad")).status, 400);
  assert.equal((await request("/api/auth/session", "DELETE", undefined, { Origin: "https://evil.example" })).status, 403);
  const signedOut = await request("/api/auth/session", "DELETE");
  assert.equal(signedOut.status, 200); assert.match(signedOut.cookie!, /Max-Age=0/);
  cookie = "";
  assert.equal((await request("/api/auth/session")).body.user, null);
  assert.equal((await request(`/api/products/${product.id}/reviews`, "POST", { rating: 5, comment: "Anonymous" })).status, 401);
  assert.equal((await request("/api/orders/my-orders")).status, 401);
  assert.equal((await request("/api/orders", "POST", payload([{ product: second.id, quantity: 1 }]), { "Idempotency-Key": randomUUID() })).status, 401);
  const relogin = await request("/api/auth/login", "POST", { identifier: "integration@example.com", password: "test-password-123" });
  assert.equal(relogin.status, 200); cookie = relogin.cookie!.split(";")[0];
  assert.equal((await request("/api/orders/my-orders")).body.length, 3);
  const secondAccount = await request("/api/auth/register", "POST", { ...validSignup, email: "second@example.com", phone: "9876543211" });
  assert.equal(secondAccount.status, 201); cookie = secondAccount.cookie!.split(";")[0];
  assert.deepEqual((await request("/api/orders/my-orders")).body, []);
  const savedCookie = cookie; cookie = "dermisca-session=invalid-token";
  assert.equal((await request("/api/auth/session")).body.user, null);
  assert.equal((await request("/api/orders/my-orders")).status, 401);
  cookie = savedCookie;
  let limited = false;
  // Allow one window boundary during the test without making it flaky.
  for (let i = 0; i < 22; i++) {
    if ((await request("/api/auth/login", "POST", { identifier: "missing@example.com", password: "incorrect-password" })).status === 429) { limited = true; break; }
  }
  assert.equal(limited, true);
  console.log("Integration checks passed: phone login, cookies, origin protection, quantity validation, rollback, concurrent stock reservation, idempotency, order history, ranking, pagination, rate limiting, discount quotes, tampered-price rejection, wishlist lookups and review updates.");
  if (process.argv.includes("--browser")) {
    console.log("Browser fixture ready at http://127.0.0.1:3002. Test account: integration@example.com / test-password-123. Press Enter to remove the isolated test database.");
    process.stdin.resume();
    await new Promise<void>(resolve => process.stdin.once("data", () => resolve()));
    process.stdin.pause();
  }
} finally {
  server.kill();
  if (mongoose.connection.name === database) { await mongoose.connection.dropDatabase(); console.log("Disposable test database removed."); }
  await mongoose.disconnect();
}

}
main().catch(error => { console.error(error); process.exitCode = 1; });
