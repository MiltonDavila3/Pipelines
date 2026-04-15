import { useParams } from "react-router-dom";
import { Button, Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import { useFetchProductsDetailsQuery } from "./catalogAPI";
import { useEffect, useState, type ChangeEvent } from "react";
import { useAddBasketItemMutation, useFetchBasketQuery, useRemoveBasketItemMutation } from "../basket/basketApi";

export default function ProductDetails() {
  const {id} = useParams();
  const {data: product, isLoading} = useFetchProductsDetailsQuery(id ? +id : 0);
  
  const [removeBasketItem] = useRemoveBasketItemMutation();
  const [addBasketItem] = useAddBasketItemMutation();

  const {data: basket} = useFetchBasketQuery();

  const item = basket?.items.find(x => x.productId === +id!); //4
  const [quantity, setQuantity] = useState(0); //3

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if(item) setQuantity(item.quantity);
  }, [item]);

  if(!product || isLoading) return <Typography>Loading...</Typography>

  const handleUpdateBasket = () => {
    const updatedQuantity = item ? Math.abs(quantity - item.quantity) : quantity

    if(!item || quantity > item.quantity) {
      addBasketItem({product, quantity: updatedQuantity})
    } else {
      removeBasketItem({productId: product.id, quantity: updatedQuantity})
    }
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = +event.currentTarget.value;

    if(value >= 0) setQuantity(value)
  }



  const productDetails = [
    {label: 'Name', value: product.name},
    {label: 'Description', value: product.description},
    {label: 'Type', value: product.type},
    {label: 'Brand', value: product.brand},
    {label: 'Quantity in sotck', value: product.quantityInStock}
  ]

  return (
    <Grid container spacing={6} maxWidth='lg' sx={{mx: 'auto'}}>
      <Grid size={6}>
        <img src={product?.pictureUrl} alt={product.name} style={{width: '100%'}} />
      </Grid>
      <Grid size={6}>
        <Typography variant="h3">{product.name}</Typography>
        <Divider sx={{mb:2}}/>
        <Typography variant="h4" color="secondary">${(product.price / 100).toFixed(2)}</Typography>
        <TableContainer>
          <Table sx={{
            '& td': {fontSize: '1rem'}
          }}>
            <TableBody>
              {productDetails.map((detail, index) => (
                <TableRow key={index}>
                  <TableCell sx={{fontWeight: 'bold'}}>{detail.label}</TableCell>
                  <TableCell>{detail.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container spacing={2} mt={3}>
          <Grid size={6}>
            <TextField
              variant="outlined"
              type="number"
              label= 'Quantity in basket'
              fullWidth
              onChange={handleInputChange}
              value={quantity}
            />
          </Grid>
          <Grid size={6}> 
            <Button
              onClick={handleUpdateBasket}
              disabled={quantity === item?.quantity || !item && quantity === 0}
              sx={{height: '55px'}}
              color="primary"
              size="large"
              variant="contained"
              fullWidth
            >
              {item ? 'Update quantity' : 'Add to basket'}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}