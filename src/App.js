import './App.css';
import LandingPage from "./routes/LandingPage";
import GamePage from "./routes/GamePage";

import store from "./store"
import {
  BrowserRouter,Routes,
  // Switch,
  Route,
  // Link
} from "react-router-dom";
import {StoreProvider,createStore} from "easy-peasy"

// require('dotenv').config()

const storeP = createStore(store)

function App() {
  return (
    <StoreProvider store={storeP}>

      <div className="App">
        <BrowserRouter> 
          <Routes>
            <Route exact path="/" element={<LandingPage/>} />
            <Route exact path="/gameroom" element={<GamePage/>} />
          </Routes>
        </BrowserRouter>
      </div>
      
    </StoreProvider>
  );
}

export default App;
