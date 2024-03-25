import React, { useState, useEffect } from 'react';
import { Box, Image, keyframes, SimpleGrid, Text, Flex } from '@chakra-ui/react';
import { UseSelector, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const ImageSlider = ({ images }) => {
    const navigate = useNavigate();
    const { products } = useSelector((state) => state.product)
    const [visibleImages, setVisibleImages] = useState([0, 1]);

    useEffect(() => {
        const timer = setInterval(() => {
            setVisibleImages(([first, second]) => [
                (second + 1) % images.length,
                (second + 2) % images.length,
            ]);
        }, 2000);

        return () => clearInterval(timer);
    }, [images.length]);
    const handleProduct = (image) => {
        const id_product = products.find((item) => item.image_link === image).id;
        navigate(`/product/${id_product}`)

    }
    return (
        <SimpleGrid columns={2} spacing={2}>
            {visibleImages.map((index) => (
                index !== 1 &&
                <Box key={index} w="100%" animation={`${fadeIn} 0.5s ease`}>
                    <Image
                        src={images[index]}
                        alt={`Slide ${index}`}
                        width={'641px'}
                        height={'447px'}
                        objectFit="cover"
                        p='5'
                        borderRadius={40}
                        sx={{
                            transition: 'transform 0.5s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.08)',
                            },
                        }}
                        onClick={() => handleProduct(images[index])}

                    />
                </Box>
            ))}s


        </SimpleGrid>
    );
};
