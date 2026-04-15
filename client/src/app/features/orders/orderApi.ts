import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../api/baseApi";
import type { CreateOrder, Order } from "../../models/order";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: baseQueryWithErrorHandling,
  endpoints: (builder) => ({
    fetchOrders: builder.query<Order[], void>({
      query: () => "order",
    }),
    fetchOrderDetails: builder.query<Order, number>({
      query: (id) => ({
        url: `order/${id}`,
      }),
    }),
    createOrder: builder.mutation<Order, CreateOrder>({
      query: (order) => ({
        url: "order",
        method: "POST",
        body: order,
      }),
    }),
  }),
});

export const { useFetchOrdersQuery, useFetchOrderDetailsQuery, useCreateOrderMutation } = orderApi;