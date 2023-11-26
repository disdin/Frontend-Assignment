import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Stack } from '@mui/material';
import View from './pages/view';
import { SnackbarProvider } from 'notistack';


function App() {
  return (
    <SnackbarProvider>
      <Stack sx={{ height: "100vh" }}>
        <View />
      </Stack>
    </SnackbarProvider>
  );
}

export default App;
