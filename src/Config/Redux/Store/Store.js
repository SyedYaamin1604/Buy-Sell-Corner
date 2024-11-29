import { configureStore } from "@reduxjs/toolkit";
import { cartSlice } from "../Reducers/CartSlice";

export default configureStore({
    reducer: {
        cart: cartSlice.reducer,
    },
});
