import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js";
import { useEffect, useMemo, useRef } from "react";
import { useFetchBasketQuery } from "../basket/basketApi";
import CheckoutStepper from "./CheckoutStepper";
import { Elements } from "@stripe/react-stripe-js";
import { Grid, Typography } from "@mui/material";
import OrderSummary from "../../shared/components/OrderSummary";
import { useCreatePaymentIntentMutation } from "./checkoutApi";
import { useAppSelector } from "../../stores/store";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK_KEY);

export default function CheckoutPage() {

  const {data: basket} = useFetchBasketQuery();
  const [createPaymentIntent, {isLoading}] = useCreatePaymentIntentMutation();
  const created = useRef(false);
  const {darkMode} = useAppSelector(state => state.ui);

  useEffect(() => {
    if (!created.current) {
      createPaymentIntent(undefined);
      created.current = true;
    }
  }, [createPaymentIntent]);

  const options: StripeElementsOptions | undefined = useMemo(() => {
    if (!basket?.clientSecret) return undefined;
    return {
      clientSecret: basket.clientSecret,
      appearance: {
        labels: 'floating',
        theme: darkMode ? 'night' : 'stripe'
      }
    }
  }, [basket, darkMode]);
  
  return (
    <Grid container spacing={2}>
      <Grid size={8}>
        {!stripePromise || !options || isLoading ? (
          <Typography variant="h6">Loading checkout...</Typography>
        ):(
           <Elements stripe={stripePromise} options={options}>
          <CheckoutStepper/>
          </Elements>
        )}
      </Grid>
      <Grid size={4}>
        <OrderSummary/>
      </Grid>
    </Grid>
  )
}
