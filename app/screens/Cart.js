import React, { useState, useEffect } from 'react'
import { Box, Text, Input, Button, View, ScrollView, Image, Pressable } from 'native-base';
import Navbar from '../components/Navbar';
import { useSelector, useDispatch } from 'react-redux';
import { get_paid } from '../store/productSlice';
import { useNavigation } from '@react-navigation/native';
export default function Cart() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [productsIDs, setProductsIDs] = useState(null);
    const { products, paid } = useSelector((state) => state.product);
    const [data, setData] = useState(null);
    const { token, user_id } = useSelector((state) => state.auth);
    const [total, setTotal] = useState(0.0);
    useEffect(() => {
        if (paid === null && token !== null) {
            dispatch(get_paid(token));
        }
    }, [paid, token])
    useEffect(() => {
        if (productsIDs === null) {
            fetch('http://192.168.8.187:8000/api/cart/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`

                },
            })
                .then((response) => response.json())
                .then((resp) => setProductsIDs(resp.product))
        }
    }, [productsIDs])
    useEffect(() => {
        // Function to filter products based on IDs
        if (products && productsIDs && data === null && paid !== null) {
            function filterProductsById(productIds, products) {
                return products.filter(product => productIds.includes(product.id));
            }

            // Filter products
            const filteredProducts = filterProductsById(productsIDs, products);
            setData(filteredProducts);
            let sum = 0;
            filteredProducts.map((product) => paid.find((prd) => prd.id_product === product.id) ? '' : sum += parseFloat(product.price));
            console.log(`SUM: ${sum}`);
            // Set the total price into the state
            setTotal(parseFloat(sum));
        }
    }, [products, productsIDs, data, paid]);
    const handleDelete = (product_id) => {
        const conetnt = {
            product_id
        }
        try {
            fetch('http://192.168.8.187:8000/api/delete-cart/', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`

                },
                body: JSON.stringify(conetnt)
            })
            alert('done deleting');
        } catch (error) {
            console.log(error);
        }


    }
    const handlePaid = () => {
        data.map((product) => {
            const content = {
                email: user_id,
                product: product.id
            }
            fetch('http://192.168.8.187:8000/api/add-paid/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`

                },
                body: JSON.stringify(content)
            })
        })
        navigation.navigate('Paid')

    }
    return (
        <View flex={1} bgColor={'#070f2b'}>
            <Navbar />
            <ScrollView flex={0.7} bgColor={'#1b1a55'} margin={5} borderRadius={8}>
                <Text
                    color={'#fff'}
                    fontSize={26}
                    fontWeight={'bold'}
                    ml={5}
                    mt={3}
                >MY CART</Text>
                {data && data.length > 0 && data.map((item, index) => (
                    <Box
                        display='flex'
                        flexDir={'row'}
                        width={'96%'}
                        height={'160px'}
                        mt={2}
                        mb={1}
                        key={index}
                        borderRadius={8}
                        bgColor={'#070f2b'}
                        alignSelf={'center'}

                    >
                        <Image
                            source={{ uri: item.image_link }}
                            alt='s'
                            style={{
                                height: 140,
                                width: 120,
                                borderRadius: 8,

                            }}
                            alignSelf={'center'}
                            ml={2}
                            resizeMode="cover"

                        />
                        <Box
                            display={'flex'}
                            width={'180px'}
                            height={'90%'}
                            ml={3}

                            alignSelf={'center'}
                        >
                            <Text
                                color={'#fff'}
                                fontSize={'lg'}
                            >{item.name}</Text>
                            <Text
                                color={'#fff'}
                                fontSize={'lg'}
                            >{item.price}$</Text>
                        </Box>
                        <Pressable onPress={() => handleDelete(item.id)}>
                            <Text
                                color={'#ff0000'}
                                fontSize={18}
                                fontWeight={'bold'}

                            >X</Text>
                        </Pressable>
                    </Box>
                ))}
            </ScrollView>
            <View flex={0.3} bgColor={'#1b1a55'} m={5} borderRadius={8}>
                <Box
                    display={'flex'}
                    flexDir={'row'}
                    width={'90%'}
                    alignSelf={'center'}
                    justifyContent={'space-between'}
                    mt={2}
                >
                    <Text
                        fontSize={24}
                        color={'#fff'}
                        fontWeight={'bold'}
                    >TOTAL</Text>
                    <Text
                        fontSize={24}
                        color={'#fff'}
                        fontWeight={'bold'}
                    >{total}$</Text>

                </Box>
                <Button
                    bgColor={'#070f2b'}
                    color={'#fff'}
                    width={'90%'}
                    alignSelf={'center'}
                    _text={{ fontWeight: 'bold', fontSize: 18 }}
                    mt={3}
                    onPress={handlePaid}
                >CHECKOUT</Button>
            </View>
        </View>
    )
}
