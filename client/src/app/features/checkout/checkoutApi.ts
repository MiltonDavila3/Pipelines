import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../api/baseApi";
import type { Basket } from "../../models/basket";
import { basketApi } from "../basket/basketApi";

export const checkoutApi = createApi({
    reducerPath: 'checkoutApi',
    baseQuery: baseQueryWithErrorHandling,
    endpoints: (builder) => ({
        createPaymentIntent: builder.mutation<Basket, void>({
            query: () => {
                return {
                    url: 'payment',
                    method: 'POST'
                }
            },
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                try {
                    const { data: basket } = await queryFulfilled;
                   dispatch(
                    basketApi.util.updateQueryData('fetchBasket', undefined, (draft) => {
                        draft.clientSecret = basket.clientSecret;
                    }));
                } catch (error) {
                    console.log('Payment intent creation failed', error);
                }
            }
        })
    })
});


export const {useCreatePaymentIntentMutation} = checkoutApi;
