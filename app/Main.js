import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Navbar from './components/Navbar';
import { NativeBaseProvider, Box } from 'native-base';

import store from './store'
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { get_categories, get_products, get_reviews } from './store/productSlice';
import Products from './screens/Products';
import Paid from './screens/Paid';
import Login from './screens/Login';
import Register from './screens/Register';
import InfoProduct from './screens/InfoProduct';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { get_info } from './store/authSlice';
import EditProfile from './screens/EditProfile';
import ChangePassword from './screens/ChangePassword';
import Categories from './screens/Categories';
import Accounts from './screens/Accounts';
import AddProduct from './screens/AddProduct';
import Cart from './screens/Cart';
const Stack = createStackNavigator();
export default function Main() {
    const { products, categories, reviews } = useSelector((state) => state.product);
    const dispatch = useDispatch();

    useEffect(() => {
        if (products === null) {
            dispatch(get_products())
        }
        if (categories === null) {
            dispatch(get_categories())
        }
        if (reviews === null) {
            dispatch(get_reviews());
        }
    }, [products, categories])
    return (
        <NavigationContainer style={{ flex: 1, backgroundColor: '#070f2b' }}>
            <Stack.Navigator initialRouteName='Products'>
                <Stack.Screen name="Products" component={Products} options={{ headerShown: false }} />
                <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
                <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                <Stack.Screen name="InfoProduct" component={InfoProduct} options={{ headerShown: false }} />
                <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
                <Stack.Screen name="ChangePassword" component={ChangePassword} options={{ headerShown: false }} />
                <Stack.Screen name="Paid" component={Paid} options={{ headerShown: false }} />
                <Stack.Screen name="Categories" component={Categories} options={{ headerShown: false }} />
                <Stack.Screen name="Accounts" component={Accounts} options={{ headerShown: false }} />
                <Stack.Screen name="AddProduct" component={AddProduct} options={{ headerShown: false }} />
                <Stack.Screen name="Cart" component={Cart} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#070f2b', // Change this color to your desired background color
    },
});