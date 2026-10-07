"use client";

import { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store, RootState } from "@/store/store";
import { setCart } from "@/store/cartSlice";

function CartPersistence({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();

    const items = useSelector((state: RootState) => state.cart.items);

    useEffect(() => {
        const savedCart = localStorage.getItem("natura-glow-cart");

        if (savedCart) {
            try {
                const cartItems = JSON.parse(savedCart);
                dispatch(setCart(cartItems));
            } catch {
                localStorage.removeItem("natura-glow-cart");
            }
        }
    }, [dispatch]);

    useEffect(() => {
        localStorage.setItem("natura-glow-cart", JSON.stringify(items));
    }, [items]);

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
