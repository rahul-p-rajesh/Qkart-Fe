import Register from "./components/Register";
import { Router, Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
import Checkout from "./components/Checkout";
import Thanks from "./components/Thanks";

export const config = {
  endpoint: `https://qkartbe-production.up.railway.app/api/v1`,
};

function App() {
  return (
    <div className="App">

      <Switch>
        <Route path="/checkout">
          <Checkout />
        </Route>

        <Route path="/register">
          <Register />
        </Route>

        <Route path="/login">
          <Login />
        </Route>

        <Route path="/thanks">
          <Thanks />
        </Route>

        <Route path="/" exact>
          <Products />
        </Route>

      </Switch>

    </div>

  );
}

export default App;
