import "./Style/App.css";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Auth/Login";
import Shop from "./Pages/Shop/Shop";
import Cart from "./Pages/Cart/Cart";

import AccountPage from "./Pages/Details/Account";

function App() {
  
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        {""}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </div>
      </BrowserRouter>

      <Footer />
    </div>
  );
}

export default App;
