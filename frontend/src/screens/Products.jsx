import React, { useState, useEffect, useRef } from 'react'
import { Flex, Text, Image, Stack, Box } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons'; // Assuming StarIcon is available
import { Icon } from '@iconify/react';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
export default function Products() {
    const { name } = useParams();
    const navigate = useNavigate();
    const [resp, setResp] = useState([]);
    const [allReviews, setAllReviews] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const { products, reviews, categories } = useSelector((state) => state.product)
    function aggregateProductReviews(products, reviews) {
        return products.map(product => {
            const productReviews = reviews.filter(review => review.product === product.id);
            const starCounts = productReviews.reduce((acc, review) => {
                acc[review.stars] = (acc[review.stars] || 0) + 1;
                return acc;
            }, {});
            const mostFrequentStars = Object.keys(starCounts).reduce((a, b) => starCounts[a] > starCounts[b] ? a : b, null);
            return {
                id: product.id,
                name: product.name,
                price: product.price,
                image_link: product.image_link,
                stars: mostFrequentStars ? parseInt(mostFrequentStars, 10) : 0, // Convert to integer, default to 0 if no reviews
                count_review: productReviews.length
            };
        });
    }
    useEffect(() => {
        if (products !== null) {
            setAllProducts(products)
        }
        if (reviews !== null) {
            setAllReviews(reviews);
        }
        if (products !== null && reviews !== null) {
            setResp(aggregateProductReviews(products, reviews))
        }
    }, [products, reviews])
    useEffect(() => {
        if (name !== undefined && products && categories) {
            console.log(products);
            console.log(categories)
            const firstArray = categories.filter(item => item.name === name);
            console.log(firstArray)
            const newOne = products.filter(item => firstArray[0].products.includes(item.id));
            setResp(newOne);
        }
    }, [name, products, categories])
    return (
        <>
            <Navbar />
            <Flex
                p='12'
                width="100%"
                justifyContent={'space-between'}
                wrap={'wrap'}

            >
                {resp !== null && resp.map((item) => (
                    <Flex
                        bgColor={'#1B1A55'}
                        flexDir={"column"}
                        borderRadius={8}
                        height={'340px'}
                        width={'320px'}
                        alignItems='center'
                        as='button'
                        sx={{
                            transition: 'transform 0.3s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.1)',
                            },
                        }}
                        mb='5'
                        onClick={() => navigate(`/product/${item.id}`)}
                    >
                        <>
                            <Image
                                mt='4'
                                borderRadius={8}
                                width='90%'
                                height={'60%'}
                                src={item.image_link} />

                            <Text
                                fontSize={22}
                                alignSelf={'start'}
                                ml='5'
                                mt='1'
                            >{item.name}</Text>
                            <Flex width={'100%'}>
                                <Stack
                                    alignSelf={'start'}
                                    ml='5'
                                    mt='1'
                                    direction="row">
                                    {Array.from({ length: item.stars }, (_, i) => (
                                        <StarIcon key={i} color={i < item.stars ? "yellow.500" : "gray.300"} />
                                    ))}
                                </Stack>
                                <Text ml='3'>{item.count_review}</Text>
                            </Flex>
                            <Text
                                fontSize={22}
                                alignSelf={'start'}
                                ml='5'
                                mt='1'
                            >{item.price}$</Text>
                        </>
                    </Flex>
                ))}



            </Flex>
        </>
    )
}
