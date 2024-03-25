import React, { useState, useEffect } from 'react'
import { Flex, Text, Box, Image } from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import Review from '../components/Review';
import { useSelector } from 'react-redux';
import { ImageSlider } from '../components/ImageSlider';

export default function Home() {
    const { products, reviews } = useSelector((state) => state.product);
    const [allImages, setAllImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [maxReviews, setMaxReviews] = useState(window.innerWidth < 600 ? 1 : 4);
    function shuffleArray(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;

        while (currentIndex !== 0) {

            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
    useEffect(() => {
        if (products !== null) {
            products.map((item) => allImages.push(item.image_link));
            setNewImages(shuffleArray(allImages));
        }
    }, [products, allImages, newImages])
    return (
        <>
            <Navbar />
            <Flex
                width={'100%'}
                justifyContent={'space-evenly'}
                height={'400px'}

            >

                {newImages.length > 0 && <ImageSlider images={newImages} />}

            </Flex>
            <Flex alignItems={'center'} justifyContent={'center'} height={'300px'} flexDir={'column'}>
                <Text fontSize={26} mt='10' mb='5' color={'silver'}>Last Customers Reviews</Text>
                <Flex justifyContent={'space-evenly'} width={'100%'}>
                    {reviews && reviews.length > 0 && [...reviews].reverse().map((item, index) => index < maxReviews && <Review name={item.name} stars={item.stars} comment={item.text} />)}


                </Flex>
            </Flex>
        </>
    )
}
