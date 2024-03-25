import React, { useState, useEffect } from 'react'
import { Flex, Box, Text, Button, Image } from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import Cookies from 'js-cookie';
import { UseSelector, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { PayPalButtonComponent } from '../components/PayPalButtonComponent';
const data_old = [
    { name: "RGB Lighting1", stars: 5, review: 20, price: 20, image_link: 'https://i.imgur.com/nG8d9xO.jpg' },
    { name: "RGB Lighting2", stars: 4, review: 15, price: 60, image_link: 'https://i.imgur.com/n6Az6mV.jpg' },
    { name: "RGB Lighting3", stars: 3, review: 10, price: 45, image_link: 'https://i.imgur.com/4mxmr6p.jpg' },
    { name: "RGB Lighting3", stars: 3, review: 10, price: 45, image_link: 'https://i.imgur.com/4mxmr6p.jpg' },
]
export default function Cart() {
    const navigate = useNavigate();
    const { products, paid } = useSelector((state) => state.product)
    const { user_id } = useSelector((state) => state.auth)
    const [productsIDs, setProductsIDs] = useState(null);
    const [data, setData] = useState(null);
    const access_token = Cookies.get('access_token');
    const [total, setTotal] = useState(0.0);
    function filterProductsById(productIds, products) {
        return products.filter(product => productIds.includes(product.id));
    }
    useEffect(() => {
        if (productsIDs === null) {
            fetch('http://127.0.0.1:8000/api/cart/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`

                },
            })
                .then((response) => response.json())
                .then((resp) => setProductsIDs(resp.product))
        }
    }, [productsIDs])


    // useEffect(() => {
    //     if (data === null) {
    //         if (products && productsIDs) {
    //             setData(filterProductsById(productsIDs, products));
    //             const totalSum = data !== null && data.reduce((sum, product) => sum + product.price, 0);
    //             console.log(`Total: ${totalSum}`);
    //             setTotal(totalSum)
    //         }
    //     }
    // }, [data, products, productsIDs])
    useEffect(() => {
        // Function to filter products based on IDs
        if (products && productsIDs && data === null) {
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
    }, [products, productsIDs, data]);
    const handleDelete = (product_id) => {
        const conetnt = {
            product_id
        }
        fetch('http://127.0.0.1:8000/api/delete-cart/', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`

            },
            body: JSON.stringify(conetnt)
        })
            .then((response) => response.ok && window.location.reload())

    }
    const handlePaid = () => {
        data.map((product) => {
            const content = {
                email: user_id,
                product: product.id
            }
            fetch('http://127.0.0.1:8000/api/add-paid/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`

                },
                body: JSON.stringify(content)
            })
        })
        navigate('/paid');
        window.location.reload();

    }
    return (
        <>
            <Navbar />
            <Flex
                width={'100%'}
                p='5'
                height={'660px'}
                justifyContent={'space-between'}
                flexDir={{ base: 'column', md: 'row' }}
            >
                <Flex
                    bgColor={'#1B1A55'}
                    flexDir={'column'}
                    alignItems={'center'}
                    height={'90%'}
                    width={{ base: '100%', md: '72%' }}
                    borderRadius={8}
                    overflowY={'scroll'}
                    sx={{
                        '::-webkit-scrollbar': {
                            width: '16px',
                            borderRadius: '8px',
                            backgroundColor: `rgba(0, 0, 0, 0.05)`,
                        },
                        '::-webkit-scrollbar-thumb': {
                            backgroundColor: `rgba(0, 0, 0, 0.2)`,
                            borderRadius: '8px',
                        },
                    }}
                >
                    <Text
                        alignSelf={'start'}
                        fontSize={26}
                        p={3}
                        pl='6'
                    >MY CART</Text>
                    {/* {data.map((item) => products.map((product) => item.product))} */}
                    {data !== null && data.length > 0 && data.map((item) => (
                        paid && paid.length > 0 && paid.find((prd) => prd.id_product === item.id) ? '' : <Flex
                            mt={4}
                            height={'180px'}
                            bgColor={'#070F2B'}
                            width={'96%'}
                            borderRadius={8}
                            alignItems={'center'}

                        >
                            <Image
                                src={item.image_link}
                                boxSize={160}
                                borderRadius={8}
                                m={2}
                            />
                            <Flex flexDir={'column'} height={'90%'} width={'100%'}>
                                <Text fontSize={26} >{item.name}</Text>
                                <Text fontSize={20}>{item.price}$</Text>
                            </Flex>
                            <Flex flexDir={'column'} height={'100%'} width={'100%'}>
                                <Text
                                    alignSelf={'end'}
                                    mr='3'
                                    color={'red'}
                                    fontWeight={'bold'}
                                    as='button'
                                    onClick={() => handleDelete(item.id)}
                                >X</Text>
                            </Flex>
                        </Flex>

                    ))}
                </Flex>
                <Flex
                    mt={{ base: '5', md: '0' }}
                    bgColor={'#1B1A55'}
                    width={{ base: '100%', md: '27%' }}
                    height={'90%'}
                    borderRadius={8}
                    flexDir={'column'}
                    alignItems={'center'}
                >
                    <Flex
                        justifyContent={'space-between'}
                        width={'100%'}
                    >
                        <Text
                            alignSelf={'start'}
                            fontSize={26}
                            p={3}
                            pl='6'
                        >TOTAL</Text>
                        <Text
                            alignSelf={'start'}
                            fontSize={26}
                            p={3}
                            pr='6'
                        >{total}$</Text>

                    </Flex>
                    <Button
                        width={'90%'}
                        bgColor={'#070F2B'}
                        color={'white'}
                        fontWeight={'bold'}
                        fontSize={18}
                        onClick={handlePaid}
                    >CHECKOUT</Button>
                    <PayPalButtonComponent total={total} />

                </Flex>

            </Flex>
        </>
    )
}
