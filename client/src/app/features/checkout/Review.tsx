import {
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { currencyFormat } from "../../../lib/util";
import type { ConfirmationToken } from "@stripe/stripe-js";
import { useBasket } from "../../../lib/hooks/useBasket";

type Props = {
    confirmationToken: ConfirmationToken | null;
}


export default function Review({confirmationToken}: Props) {
  const {basket} = useBasket();

  const addressString = () => {
    if(!confirmationToken?.shipping) return '';
    const {name, address} = confirmationToken.shipping;

    if (!address) return '';
    return `${name}, 
      ${address.line1}, 
      ${address.line2 || ''}, 
      ${address.city}, 
      ${address.state},
      ${address.postal_code}
      ${address.country}`;  
  }

  const paymentString = () => {
    if(!confirmationToken?.payment_method_preview.card) return '';

    const {card} = confirmationToken.payment_method_preview;
    if(!card) return '';
    return `Card ending in ${card.last4}, exp ${card.exp_month}/${card.exp_year}, ${card.brand.toUpperCase()}`;
  }

  return (
    <div>
      <Box mt={4} width="100%">
        <Typography variant="h6" fontWeight="bold">
          Billing and delivery information
        </Typography>
        <dl>
          <Typography
            component="dt"
            mt={1}
            color="secondary"
            fontWeight="medium"
          >
            Shipping address
          </Typography>
          <Typography component="dd" mt={1} color="text.secondary">
            {addressString()}
          </Typography>
          <Typography
            component="dt"
            mt={1}
            color="secondary"
            fontWeight="medium"
          >
            Payment details
          </Typography>
          <Typography component="dd" mt={1} color="text.secondary">
            {paymentString()}
          </Typography>
        </dl>
      </Box>
      <Box mt={6} mx="auto">
        <Divider />
        <TableContainer>
          <Table>
            <TableBody>
              {basket?.items.map((item) => (
                <TableRow
                  key={item.productId}
                  sx={{ borderBottom: "1px solid rgba(224, 224, 224, 1" }}
                >
                  <TableCell sx={{ py: 4 }}>
                    <Box display="flex" gap={3} alignItems="center">
                      <img
                        src={item.pictureUrl}
                        alt={item.name}
                        style={{
                          width: 60,
                          height: 60,
                        }}
                      />
                       <Typography>{item.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center" sx={{p: 4}}> x {item.quantity}</TableCell>
                  <TableCell align="right" sx={{p: 4}}> {currencyFormat(item.price)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
}
