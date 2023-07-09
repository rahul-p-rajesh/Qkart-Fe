
import Home from './pages/Home/Home';
import Video from './pages/Video/Video'
import {
  Routes,
  Route,
} from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className='App'>
          
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/video/:videoId" element={<Video />} />
        </Routes>
        </div>
      </ThemeProvider>
  );
}

export default App;
