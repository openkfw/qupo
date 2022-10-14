import ForwardIcon from '@mui/icons-material/ArrowForward';
import { Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import store from 'store-js';

const ContinueButton = ({ symbols, areSymbolsSelected = true }) => {
  const navigate = useNavigate();

  return (
    <Grid container justifyContent="flex-end">
      <Button
        size="small"
        disabled={!areSymbolsSelected || symbols.length < 2}
        startIcon={<ForwardIcon />}
        onClick={() => {
          store.set("selected_symbols", symbols);
          navigate("/process");
        }}
      >
        Continue with these symbols
      </Button>
    </Grid>
  );
};

export default ContinueButton;
