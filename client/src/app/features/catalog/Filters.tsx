import { Box,  Button,  Paper} from "@mui/material";
import Search from "./Search";
import RadioButtonGroup from "../../shared/components/RadioButtonGroup";
import { useAppDispatch, useAppSelector } from "../../stores/store";
import { resetParams, setBrands, setOrderBy, setTypes } from "./catalogSlice";
import CheckboxButton from "../../shared/components/CheckboxButton";

const sortOptions = [
    {value: 'name', label: 'Alphabetical'},
    {value: 'priceDesc', label: 'Price: High to low'},
    {value: 'price', label: 'Price: Low to high'},
]

type Props = {
    filtersData: {brands: string[]; types: string[];}
}

export default function Filters({filtersData}: Props) {
  const {orderBy, types, brands} = useAppSelector(state => state.catalogState);
  const dispatch = useAppDispatch();

  return (
    <Box display='flex' flexDirection='column' gap={3}>
        <Paper>
            <Search/>
        </Paper>
        <Paper sx={{p: 3}}>
            <RadioButtonGroup 
                options={sortOptions} 
                onChange={e => dispatch(setOrderBy(e.target.value))} 
                selectedValue={orderBy}
            />
        </Paper>
        <Paper sx={{p: 3}}>
            <CheckboxButton 
                items={filtersData.brands}
                checked={brands}
                onChange={(items: string[]) => dispatch(setBrands(items))}
                />
        </Paper>
        <Paper sx={{p: 3}}>
            <CheckboxButton 
                items={filtersData.types}
                checked={types}
                onChange={(items: string[]) => dispatch(setTypes(items))}
                />
        </Paper>
        <Button onClick={() => {
            dispatch(resetParams());
            window.scrollTo({top: 0, behavior: 'smooth'})
        }}>
            Reset filters
        </Button>
    </Box>
  )
}