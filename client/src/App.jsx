import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Signin from "./pages/Signin";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Account from "./pages/Account";
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./pages/CreateListing";
import UpdateListing from "./pages/UpdateListing";
import Listing from "./pages/Listing";
import Listings from "./pages/Listings";
import Search from "./pages/Search";
import Home from "./pages/Home";

export default function App() {
  return (
    <BrowserRouter>
      <Header></Header>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/listing/:id" element={<Listing />} />
        <Route path="/search" element={<Search />} />
        <Route path="/" element={<Home />} />
        <Route element={<PrivateRoute />}>
          <Route path="/account" element={<Account />} />
          <Route path="/create-listing" element={<CreateListing />} /> 
          <Route path="/update-listing/:id" element={<UpdateListing />} />
          <Route path="/user/listings" element={<Listings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
