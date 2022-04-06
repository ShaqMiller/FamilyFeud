import './App.css';
import store from "./store"
import 'bootstrap/dist/css/bootstrap.min.css';
import Router from './Router';
// require('dotenv').config()
import {StoreProvider,createStore} from "easy-peasy"
const storeP = createStore(store)

function App() {

  
  return (
    <StoreProvider store={storeP}>

      <div className="App">
        <Router />
      </div>
      
    </StoreProvider>
  );
}

export default App;
