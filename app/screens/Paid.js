import React, { useState, useEffect } from 'react'
import { Box, Text, Button, View, ScrollView, HStack, Icon, VStack, Modal, TextArea } from 'native-base';
import Navbar from '../components/Navbar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';
import { Image } from 'react-native';
import { get_my_reviews, get_paid } from '../store/productSlice';
const Rating = ({ value, onChange }) => {
    const { paid, products, my_reviews } = useSelector((state) => state.product)
    return (
        <HStack space={2}>
            {[...Array(5)].map((_, index) => (
                <Icon
                    as={MaterialIcons}
                    name={index < value ? "star" : "star-border"}
                    key={index}
                    size="sm"
                    color={index < value ? "yellow.500" : "gray.300"}
                    onPress={() => onChange(index + 1)}
                />
            ))}
        </HStack>
    );
};
export default function Paid() {
    const dispatch = useDispatch();

    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const { user_id, token } = useSelector(state => state.auth);
    const { paid, products, my_reviews } = useSelector(state => state.product);
    useEffect(() => {
        if (paid === null && token !== null) {
            dispatch(get_paid(token));
        }
        if (my_reviews === null && token !== null) {
            dispatch(get_my_reviews(token));
        }
    }, [paid, token, my_reviews])
    const onOpen = () => setIsOpen(true);
    const onClose = () => setIsOpen(false);

    const handleOpenModal = (item) => {
        setSelectedItem(item); // Update selected item
        onOpen(); // Open modal
    };

    const handleReview = (product_id) => {
        const data = {
            email: user_id,
            product: product_id,
            stars: rating,
            text: comment,
        };
        fetch('http://192.168.8.187:8000/api/add-review/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .catch((error) => console.error('Error:', error));

        setComment('');
        setRating(0);
        onClose();
    };



    return (
        <View flex={1} bgColor={'#070f2b'}>
            <Navbar />
            <ScrollView bgColor={'#1b1a55'} m={5} borderRadius={8}>
                {paid && paid.length > 0 && paid.map((item) => (
                    <Box
                        width="100%"
                        borderWidth="0.5px"
                        alignItems="center"
                        borderColor="#070f2b"
                        height="100px"
                        justifyContent="space-between"
                        p="3"
                        key={item.id_product}
                        display='flex'
                        flexDir={'row'}
                    >
                        <HStack width="50%" height="100%" alignItems="center">
                            <Image
                                source={{ uri: products !== null && products.find((prd) => prd.id === item.id_product).image_link }}
                                style={{ width: 70, height: 70, borderRadius: 35, marginLeft: 8, marginRight: 16 }}
                            />
                            <VStack justifyContent="space-around" height="100%">
                                <Text fontSize="lg" color={'#fff'}>{item.product_name}</Text>
                                <Text fontSize="md" color={'#fff'}>{item.price}$</Text>
                            </VStack>
                        </HStack>

                        <Box>
                            {my_reviews && my_reviews.length > 0 && my_reviews.find((rev) => rev.product === item.id_product) ? (
                                <HStack width="100%">
                                    {Array.from({ length: my_reviews && my_reviews.length > 0 && my_reviews.find((rev) => rev.product === item.id_product).stars }, (_, i) => (
                                        <MaterialIcons
                                            key={i}
                                            name="star"
                                            color={"#FFD700"} // yellow.500 and gray.300 equivalents
                                            size={24}
                                        />
                                    ))}
                                    {/*  */}
                                </HStack>
                            ) : (
                                <Button onPress={() => handleOpenModal(item)} colorScheme="blue" key={item.id_product}>
                                    Add Review
                                </Button>
                            )}

                            {selectedItem && (
                                <Modal isOpen={isOpen} onClose={onClose}>
                                    <Modal.Content maxWidth="400px" bgColor='#070f2b'>
                                        <Modal.CloseButton />
                                        <Modal.Header bgColor={'#070f2b'} _text={{ color: '#fff' }}>Add a Review</Modal.Header>
                                        <Modal.Body bgColor={'#070f2b'}>
                                            <Box marginBottom="20px" >
                                                <Rating value={rating} onChange={setRating} />
                                            </Box>
                                            <TextArea
                                                value={comment}
                                                onChangeText={setComment}
                                                placeholder="Type your comment here..."
                                                h={20}
                                            />
                                        </Modal.Body>
                                        <Modal.Footer bgColor={'#070f2b'}>
                                            <Button colorScheme="blue" onPress={() => handleReview(selectedItem.id_product)}>
                                                Submit
                                            </Button>
                                            <Button variant="ghost" onPress={onClose}>
                                                Cancel
                                            </Button>
                                        </Modal.Footer>
                                    </Modal.Content>
                                </Modal>
                            )}
                        </Box>
                    </Box>
                ))}
            </ScrollView>
        </View>

    )
}
