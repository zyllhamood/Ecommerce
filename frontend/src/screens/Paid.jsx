import React, { useEffect, useState } from 'react'
import { Flex, Text, Button, Image } from '@chakra-ui/react';
import Cookies from 'js-cookie';
import Navbar from '../components/Navbar';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Textarea,
    Box,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { useSelector } from 'react-redux';
import Review from '../components/Review';
const Rating = ({ value, onChange }) => {
    return (
        <Box display="flex">
            {[...Array(5)].map((_, index) => (
                <StarIcon
                    key={index}
                    onClick={() => onChange(index + 1)}
                    color={index < value ? "yellow.500" : "gray.300"}
                    cursor="pointer"
                />
            ))}
        </Box>
    );
};
const data_old = [
    { id: 1, name: 'LED', image_link: 'https://i.imgur.com/ldAnphl.jpg', price: 20 },
    { id: 2, name: 'LED', image_link: 'https://i.imgur.com/oGVXgDM.jpg', price: 20 },
    { id: 3, name: 'LED', image_link: 'https://i.imgur.com/ZBX9vUP.jpg', price: 20 },
    { id: 4, name: 'LED', image_link: 'https://i.imgur.com/yy3jb3S.jpg', price: 20 },
    { id: 5, name: 'LED', image_link: 'ttps://i.imgur.com/UpKcoym.jpg', price: 20 },
]

export default function Paid() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const { user_id } = useSelector((state) => state.auth)
    const [selectedItem, setSelectedItem] = useState(null);
    const { paid, products, my_reviews } = useSelector((state) => state.product)

    const access_token = Cookies.get('access_token');
    const handleOpenModal = (item) => {
        setSelectedItem(item); // Update selected item
        onOpen(); // Open modal
    };
    const handleReview = (product_id) => {
        console.log('product_id')
        console.log(product_id)
        onOpen();
        const data = {
            email: user_id,
            product: product_id,
            stars: rating,
            text: comment

        }
        fetch('http://127.0.0.1:8000/api/add-review/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            body: JSON.stringify(data)
        })
            .then((response) => console.log(response.json()))
        setComment('')
        setRating(0)
        onClose();

    }
    useEffect(() => {
        console.log(my_reviews)
        console.log(paid)
    }, [my_reviews, paid])


    return (
        <>
            <Navbar />
            <Flex
                width={'100%'}
                height={'600px'}
                justifyContent={'center'}
            >
                <Flex
                    width={{ base: '80%', md: '50%' }}
                    bgColor={'#1b1a55'}
                    mt='10'
                    borderRadius={8}
                    flexDir={'column'}
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
                    {paid && paid.length > 0 && paid.map((item) => (
                        <Flex
                            width={'100%'}
                            borderWidth={'0.5px'}
                            alignItems={'center'}
                            borderColor={'#070f2b'}
                            height={'100px'}
                            justifyContent={'space-between'}
                            p='3'
                        >
                            <Flex width={'100%'} height={'100%'} alignItems={'center'}>
                                <Image ml='2' src={products !== null && products.find((prd) => prd.id === item.id_product).image_link} boxSize="70px" borderRadius="full" mr={4} alt={item.product_name} />
                                <Flex flexDir={'column'} justifyContent={'space-around'} height={'100%'}>

                                    <Text
                                        fontSize={20}
                                    >{item.product_name}</Text>
                                    <Text
                                        fontSize={18}
                                    >{item.price}$</Text>
                                </Flex>
                            </Flex>
                            <Flex>
                                {my_reviews && my_reviews.length > 0 && my_reviews.find((rev) => rev.product === item.id_product) ? (
                                    <Flex width={'100%'}>

                                        {Array.from({ length: my_reviews && my_reviews.length > 0 && my_reviews.find((rev) => rev.product === item.id_product).stars }, (_, i) => (
                                            <StarIcon m={'2px'} key={i} color={"yellow.500"} />
                                        ))}

                                    </Flex>
                                ) : <Button
                                    onClick={() => handleOpenModal(item)}
                                    mr='2'
                                    colorScheme='facebook'
                                    key={item.id_product}
                                >
                                    Add Review
                                </Button>}


                                {selectedItem && (
                                    <Modal isOpen={isOpen} onClose={onClose}>
                                        <ModalOverlay />
                                        <ModalContent bgColor='#070f2b'>
                                            <ModalHeader>Add a Review</ModalHeader>
                                            <ModalCloseButton />
                                            <ModalBody>
                                                <Box marginBottom="20px">
                                                    <Rating value={rating} onChange={setRating} />
                                                </Box>
                                                <Textarea
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                    placeholder="Type your comment here..."
                                                />
                                            </ModalBody>

                                            <ModalFooter>
                                                <Button colorScheme="blue" mr={3} onClick={() => handleReview(selectedItem.id_product)}>
                                                    {selectedItem.id_product}
                                                </Button>
                                                <Button variant="ghost" onClick={onClose}>Cancel</Button>
                                            </ModalFooter>
                                        </ModalContent>
                                    </Modal>
                                )}
                            </Flex>
                        </Flex>
                    ))}
                </Flex>

            </Flex>

        </>
    )
}
