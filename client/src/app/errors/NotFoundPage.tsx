import { SearchOff } from "@mui/icons-material";
import { Button, Paper, Typography } from "@mui/material";
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <Paper sx={{
        height: 400,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: 6
    }}>

        <SearchOff sx={{fontSize: 100}} color="primary"/>
        <Typography gutterBottom variant="h3">
            Oops, we can not find what you looking for
        </Typography>
        <Button fullWidth component={Link} to='/catalog'>
            Go Back
        </Button>
    </Paper>
  )
}