import { Grid, Typography } from "@mui/material";
import ProductList from "./ProductList";
import { useFetchFiltersQuery, useFetchProductsQuery } from "./catalogAPI";
import Filters from "./Filters";
import { useAppDispatch, useAppSelector } from "../../stores/store";
import AppPagination from "../../shared/components/AppPagination";
import { setPageNumber } from "./catalogSlice";

export default function Catalog() {
  const productParams = useAppSelector((state) => state.catalogState);
  const {data: filtersData, isLoading: filtersLoading} = useFetchFiltersQuery();
  const { data, isLoading } = useFetchProductsQuery(productParams);

  const dispatch = useAppDispatch();

  if (isLoading || !data || filtersLoading || !filtersData) return <Typography>Loading...</Typography>;
  return (
    <Grid container spacing={4}>
      <Grid size={3}>
        <Filters filtersData={filtersData} />
      </Grid>
      <Grid size={9}>
        {data.items && data.items.length > 0 ? (
          <>
          <ProductList products={data.items} />
          <AppPagination
            metadata={data.pagination}
            onPageChange={(page: number) => {
              dispatch(setPageNumber(page));
              window.scrollTo({top: 0, behavior: 'smooth'})
            }}
          />
        </>
        ):(
          <Typography variant="h5">There are no results fot this filter</Typography>
        )}
      </Grid>
    </Grid>
  );
}
