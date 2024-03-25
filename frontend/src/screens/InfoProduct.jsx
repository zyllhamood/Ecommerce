import React, { useState, useEffect } from 'react'
import { Flex, Text, Button, Image } from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import { StarIcon } from '@chakra-ui/icons';
import Review from '../components/Review';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
export default function InfoProduct() {
    const { id } = useParams();
    const [resp, setResp] = useState(null);
    const [isActive, setIsActive] = useState(1);
    const { products, reviews } = useSelector((state) => state.product)
    const { isAdmin } = useSelector((state) => state.auth);
    const [item, setItem] = useState(null);
    const access_token = Cookies.get('access_token');
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    function aggregateProductReviews(products, reviews) {
        return products.map(product => {
            const productReviews = reviews.filter(review => review.product === product.id);
            const starCounts = productReviews.reduce((acc, review) => {
                acc[review.stars] = (acc[review.stars] || 0) + 1;
                return acc;
            }, {});
            const mostFrequentStars = Object.keys(starCounts).reduce((a, b) => starCounts[a] > starCounts[b] ? a : b, null);
            let id = 1;
            const images = product.images.map(image => ({
                id: id++,
                image_link: image.image_link && image.image_link
            }));
            return {
                id: product.id,
                name: product.name,
                price: product.price,

                description: product.description,
                images: images,
                stars: mostFrequentStars ? parseInt(mostFrequentStars, 10) : 0, // Convert to integer, default to 0 if no reviews
                count_review: productReviews.length
            };
        });
    }
    useEffect(() => {
        if (products !== null && reviews !== null) {
            setResp(aggregateProductReviews(products, reviews))
        }
    }, [products, reviews])
    useEffect(() => {
        if (item === null && resp !== null) {
            resp.map((product) => product.id.toString() === id && setItem(product));
        }
    }, [item, products, resp]);
    const handleButton = () => {
        const data = {
            product_id: item.id
        }
        fetch('http://127.0.0.1:8000/api/add-cart/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`

            },
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((data) => console.log(data));
        navigate('/cart')
    }

    return (
        <>
            <Navbar />
            {item !== null && <Flex
                width={'100%'}
                flexDir={{ base: 'column', md: 'row' }}
                height={'500px'}
                padding={'10'}
            >
                <Flex
                    width={{ base: '300px', md: '100px' }}
                    height={'100%'}
                    flexDir={{ base: 'row', md: 'column' }}


                >
                    {item.images && item.images.map((item) => <Image
                        src={item.image_link}
                        objectFit={'conver'}
                        height={{ base: '80px', md: '100px' }}
                        borderRadius={8}
                        opacity={item.id === isActive ? 1 : 0.3}
                        onClick={() => setIsActive(item.id)}
                        mb='3'
                        p='1'
                    />)}

                </Flex>
                <Flex ml='10'>
                    {/* {console.log(item.images.find(img => img.id === isActive))} */}
                    <Image src={item.images.find(img => img.id === isActive).image_link} boxSize={900} />
                </Flex>
                <Flex
                    flexDir={'column'}
                    ml='10'
                    width={'30%'}
                    pb='10px'
                >
                    <Text fontSize={26}>{item.name}</Text>
                    <Text fontSize={22} mt='4'>{item.price}$</Text>

                    <Flex alignItems={'center'} height={'20px'} mt='5'>
                        <Text mr='2'>Reviews : {item.count_review}</Text>
                        {Array.from({ length: item.stars }, (_, i) => (
                            <StarIcon ml='1' key={i} color={i < item.stars ? "yellow.500" : "gray.300"} />
                        ))}
                    </Flex>

                    <Text
                        mt='5'
                    >
                        {item.description}
                    </Text>
                    <Button
                        borderRadius={26}
                        bgColor={'#535C91'}
                        mt='5'
                        color={'white'}
                        onClick={handleButton}
                    >Add to cart</Button>
                    {isAdmin ? <Button
                        borderRadius={8}
                        bgColor={'#535C91'}
                        mt='5'

                        color={'white'}
                        onClick={() => navigate(`/edit-product/${item.id}`)}
                    >Edit Product</Button> : ''}
                </Flex>
                <Flex ml='10' flexDir={'column'} height={'700px'}>
                    {reviews.filter(review => review.product === item.id).map((review, i) => <Review name={review.name} comment={review.text} stars={review.stars} />)}


                </Flex>
            </Flex >}
        </>
    )
}
