import React, { useState, useEffect } from 'react'
import { Box, Text, Button, Image, View, ScrollView, HStack, Pressable } from 'native-base';
import { useSelector } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import Navbar from '../components/Navbar';
import { useNavigation } from '@react-navigation/native';
export default function Products({ route }) {
    const navigation = useNavigation();
    const [nameCategory, setNameCategory] = useState(null)

    const { products, reviews, categories } = useSelector((state) => state.product);
    const [resp, setResp] = useState([])
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
                stars: mostFrequentStars ? parseInt(mostFrequentStars, 10) : 0,
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
        if (route.params) {
            setNameCategory(route.params.name);

        }

        if (products !== null && categories !== null && nameCategory !== null) {
            const firstArray = categories.filter(item => item.name === nameCategory);
            const newOne = products.filter(item => firstArray[0].products.includes(item.id));
            setResp(aggregateProductReviews(newOne, reviews));
        }
    }, [route, nameCategory, products, categories])

    return (

        <Box flex={1} bgColor={'#070f2b'}>
            <Navbar />
            <View flex={0.9} margin={8}>
                <ScrollView>
                    {resp.length !== 0 && resp.map((item) => (
                        <Pressable onPress={() => navigation.navigate('InfoProduct', { id: item.id })}>
                            <Box
                                bgColor={'#1b1a55'}
                                width={'96%'}
                                height={'340px'}
                                margin={2}
                                alignSelf={'center'}
                                borderRadius={8}
                                display={'flex'}
                                flexDir={'column'}
                                alignItems={'center'}

                            >
                                <Image
                                    mt='4'
                                    borderRadius={8}
                                    alt={item.name}
                                    width='90%'
                                    height={'60%'}
                                    src={item.image_link}
                                />
                                <Text
                                    fontSize={22}
                                    textAlign={'start'}
                                    width={'90%'}
                                    marginTop={1}
                                    color={'#fff'}

                                >{item.name}</Text>
                                <Box width="90%" flexDirection="row" alignItems="center" >
                                    <HStack alignSelf="flex-start" mt="1">
                                        {Array.from({ length: 5 }, (_, i) => (
                                            <MaterialIcons
                                                key={i}
                                                name="star"
                                                color={i < item.stars ? "#FFD700" : "#D3D3D3"} // yellow.500 and gray.300 equivalents
                                                size={24}
                                            />
                                        ))}
                                    </HStack>
                                    <Text marginLeft="3" color={'#fff'} marginTop={1}>{item.count_review}</Text>

                                </Box>
                                <Text
                                    marginTop={1}
                                    color={'#fff'}
                                    fontSize={20}
                                    textAlign={'start'}
                                    width={'90%'}
                                >{item.price}$</Text>
                            </Box>
                        </Pressable>

                    ))}
                </ScrollView>

            </View>
        </Box>



    )
}
