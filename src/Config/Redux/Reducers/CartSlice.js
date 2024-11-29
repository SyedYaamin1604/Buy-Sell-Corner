import { createSlice } from "@reduxjs/toolkit";


export const cartSlice = createSlice({
    name: 'Cart',
    initialState: {
        cart: [],
    },
    reducers: {
        addCart: (state, action) => {
            const existingItem = state.cart.find(item => item.id === action.payload.id)
            if (existingItem) {
                existingItem.quantity += 1;
                existingItem.price = existingItem.quantity * action.payload.price;
            }
            else {
                state.cart.push({
                    id: action.payload.id,
                    unitPrice: action.payload.price,
                    price: action.payload.price,
                    title: action.payload.title,
                    imageSrc: action.payload.imageSrc,
                    quantity: action.payload.quantity,
                })
            }
        },
        // removeCart: (state, action) => {
        //     state.cart = state.cart.filter(item => item.id !== action.payload.id)
        // },
        // editCart: async(state, action) => {
        //     const { id, type } = action.payload;
        //     const existingItem = state.cart.find(item => item.id === id);
        //     if (existingItem) {
        //         if (type === 'increment') {
        //             existingItem.quantity += 1;
        //         } else if (type === 'decrement' && existingItem.quantity > 1) {
        //             existingItem.quantity -= 1;
        //         }
        //         existingItem.price = existingItem.quantity * existingItem.unitPrice;
        //     }
        // }
    }
})
export const { addCart, removeCart, editCart } = cartSlice.actions;
export default cartSlice.reducer;