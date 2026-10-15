import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToString } from "react-dom/server";
import { Provider } from "react-redux";
import { makeStore } from "../store/store";
import { setCart } from "../store/cartSlice";
import { useCart } from "../store/useCart";
function CartProbe() {
  const cart = useCart();
  return <output>{`${cart.hydrated}:${cart.items.length}`}</output>;
}
function render(store: ReturnType<typeof makeStore>) {
  return renderToString(<Provider store={store}><CartProbe /></Provider>);
}
test("a late-hydrating cart boundary retains the original server snapshot after persistence restores the store", () => {
  const store = makeStore();
  const serverHTML = render(store);
  store.dispatch(setCart([{ _id: "abcdef0123456789abcdef01", name: "Cleanser", price: 200, image: "/images/face-wash.png", stock: 3, quantity: 1 }]));
  assert.equal(store.getState().cart.items.length, 1);
  assert.equal(store.getState().cart.hydrated, true);
  assert.equal(render(store), serverHTML);
  assert.match(serverHTML, /false:0/);
});
test("cart restoration completes even for an empty cart and new stores remain isolated", () => {
  const first = makeStore(), second = makeStore();
  first.dispatch(setCart([]));
  assert.equal(first.getState().cart.hydrated, true);
  assert.equal(second.getState().cart.hydrated, false);
});
