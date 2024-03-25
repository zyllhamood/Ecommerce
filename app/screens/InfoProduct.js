import React, { useState, useEffect } from 'react'
import { Box, View, Image, Text, Button, Pressable, ScrollView } from 'native-base';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import { MaterialIcons } from '@expo/vector-icons';
import Review from '../components/Review';
import { useNavigation } from '@react-navigation/native';

export default function InfoProduct({ route }) {
    const navigation = useNavigation();
    const { id } = route.params;
    const { products, reviews } = useSelector((state) => state.product);
    const { token } = useSelector((state) => state.auth);
    const [isActive, setIsActive] = useState(1);
    const [resp, setResp] = useState([])
    const [item, setItem] = useState(null);
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
        if (item === null && resp.length > 0) {
            resp.map((product) => product.id === id && setItem(product));
        }
    }, [item, products, resp]);
    const handleButton = () => {
        const data = {
            product_id: item.id
        }
        fetch('http://192.168.8.187:8000/api/add-cart/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`

            },
            body: JSON.stringify(data)
        })
        navigation.navigate('Cart');


    }
    return (
        <Box flex={1} bgColor={'#070f2b'}>
            <Navbar />
            {item !== null && (
                <>
                    <ScrollView
                        flex={0.2}
                        alignSelf={'center'}
                        width={'80%'}
                        margin={10}
                    >
                        <ScrollView horizontal height={'30%'}>
                            {item !== null && item.images.map((item) => <Pressable onPress={() => setIsActive(item.id)}>
                                <Image
                                    source={{ uri: item.image_link }}
                                    alt='s'
                                    style={{
                                        height: 80,
                                        width: 80,
                                        borderRadius: 8,
                                        opacity: item.id === isActive ? 1 : 0.3,
                                    }}
                                    resizeMode="cover"
                                    marginRight={3}
                                />

                            </Pressable>)}

                        </ScrollView>
                        <Box flex={0.5}>
                            <Image
                                alt='s'
                                source={{ uri: item.images.find(img => img.id === isActive).image_link }}
                                width={'100%'}
                                height={300}
                                resizeMode='cover'
                                marginTop={2}
                            />
                        </Box>
                        <Box flex={0.5} mt={2}>
                            <Text
                                fontSize={20}
                                color={'#fff'}
                            >{item.name}</Text>
                            <Text
                                fontSize={20}
                                color={'silver'}
                            >{item.price}$</Text>

                            <Box display={'flex'} flexDir={'row'} alignItems={'center'}>
                                <Text color={'#fff'} marginRight={2}>Reviews : </Text>
                                <Text color={'#fff'} marginRight={2}>{item.count_review}</Text>
                                {Array.from({ length: 5 }, (_, i) => (
                                    <MaterialIcons
                                        key={i}
                                        name="star"
                                        color={i < item.stars ? "#FFD700" : "#D3D3D3"} // yellow.500 and gray.300 equivalents
                                        size={24}
                                    />
                                ))}
                            </Box>
                            <Text color={'silver'} mt={2} fontSize={16}>{item.description}</Text>
                            <Button
                                bgColor={'#535C91'}
                                borderRadius={26}
                                mt={3}
                                _text={{ fontWeight: 'bold', fontSize: 18 }}
                                onPress={() => handleButton()}
                            >Add to cart</Button>
                            <Box display='flex' alignItems={'center'} mt={4}>
                                {reviews.filter(review => review.product === item.id).map((review, i) => <Review name={review.name} comment={review.text} stars={review.stars} />)}
                            </Box>


                        </Box>

                    </ScrollView>
                </>
            )}


        </Box>
    )
}
