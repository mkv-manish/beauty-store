"use client";

import { useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store, RootState } from "@/store/store";
import { setCart } from "@/store/cartSlice";

const CART_STORAGE_KEY = "dermisca-cart";

function CartPersistence({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();

    const items = useSelector((state: RootState) => state.cart.items);

    const [loaded, setLoaded] = useState(false);

    // Load cart only once when the app starts
    useEffect(() => {
        try {
            const savedCart = localStorage.getItem(CART_STORAGE_KEY);

            if (savedCart) {
                const cartItems = JSON.parse(savedCart);

                if (Array.isArray(cartItems)) {
                    dispatch(setCart(cartItems));
                }
            }
        } catch {
            localStorage.removeItem(CART_STORAGE_KEY);
        } finally {
            setLoaded(true);
        }
    }, [dispatch]);

    // Save cart only after localStorage has been loaded
    useEffect(() => {
        if (!loaded) return;

        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }, [items, loaded]);

    return children;
}

export default function ReduxProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Provider store={store}>
            <CartPersistence>{children}</CartPersistence>
        </Provider>
    );
}
