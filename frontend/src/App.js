import { useEffect, useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { Route, Routes } from 'react-router-dom';
import Login from './screens/Login';
import Register from './screens/Register';
import ChangePassword from './screens/ChangePassword';
import EditProfile from './screens/EditProfile';
import Products from './screens/Products';
import InfoProduct from './screens/InfoProduct';
import Home from './screens/Home';
import Cart from './screens/Cart';
import AddProduct from './screens/AddProduct';
import EditProduct from './screens/EditProduct';
import Accounts from './screens/Accounts';
import { useNavigate } from 'react-router-dom';
import { UseSelector, useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { get_info } from './store/authSlice';
import ForgetPassword from './screens/ForgetPassword';
import { useSelector } from 'react-redux';
import { get_categories, get_my_reviews, get_paid, get_products, get_reviews } from './store/productSlice';
import Categories from './screens/Categories';
import Paid from './screens/Paid';
function App() {
  const { products, reviews, categories, paid, my_reviews } = useSelector((state) => state.product)
  const navigate = useNavigate();
  const { isAdmin, isLogged } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const access_token = Cookies.get('access_token');
  useEffect(() => {

    if (access_token && access_token !== "") {
      dispatch(get_info(access_token));
    }
  }, [access_token])

  useEffect(() => {
    if (products === null) {
      dispatch(get_products());
    }
    if (reviews === null) {
      dispatch(get_reviews());
    }
    if (categories === null) {
      dispatch(get_categories())
    }
    if (paid === null) {
      dispatch(get_paid())
    }
    if (my_reviews === null) {
      dispatch(get_my_reviews())
    }


  }, [products, reviews, categories, paid, my_reviews])
  return (
    <>
      <ChakraProvider bgColor="black">
        <Routes>
          <Route exact path="/" element={<Home />} />
          {<Route path="/login" element={<Login />} />}
          {!isLogged && <Route path="/signup" element={<Register />} />}
          {isLogged && <Route path="/change-password" element={<ChangePassword />} />}
          {isLogged && <Route path="/edit-profile" element={<EditProfile />} />}
          <Route path="/products" element={<Products />} />
          <Route path="/products/:name" element={<Products />} />
          <Route path="/product/:id" element={<InfoProduct />} />
          {isLogged && <Route path="/cart" element={<Cart />} />}
          {isAdmin && <Route path="/add-product" element={<AddProduct />} />}
          {isAdmin && <Route path="/edit-product/:id" element={<EditProduct />} />}
          {isAdmin && <Route path="/accounts" element={<Accounts />} />}
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/categories" element={<Categories />} />
          {isLogged && <Route path="/paid" element={<Paid />} />}
        </Routes>
      </ChakraProvider>
    </>
  );
}

export default App;
