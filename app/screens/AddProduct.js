import React, { useState, useRef } from 'react'
import { Box, Input, Button, View, Text, ScrollView, VStack, TextArea } from 'native-base';
import Navbar from '../components/Navbar';
export default function AddProduct() {
    const [imageLinks, setImageLinks] = useState([{ id: Date.now(), image_link: '' }]);
    const inputRefs = useRef([]);

    const updateLink = (id, newValue) => {
        const updatedLinks = imageLinks.map(link => {
            if (link.id === id) {
                return { ...link, image_link: newValue };
            }
            return link;
        });
        setImageLinks(updatedLinks);
    };
    const addLink = () => {
        setImageLinks([...imageLinks, { id: Date.now(), image_link: '' }]);
    };
    return (
        <View flex={1} bgColor={'#070f2b'}>
            <Navbar />
            <ScrollView bgColor={'#1b1a55'} margin={5} borderRadius={8}>
                <Input
                    placeholder='Name'
                    bgColor={'#070f2b'}
                    borderColor={'#070f2b'}
                    mt={3}
                    width={'90%'}
                    alignSelf={'center'}
                    fontSize={16}
                />
                <Input
                    placeholder='Price'
                    bgColor={'#070f2b'}
                    borderColor={'#070f2b'}
                    mt={3}
                    width={'90%'}
                    alignSelf={'center'}
                    fontSize={16}
                />
                {imageLinks.map((link, index) => (
                    <Input
                        key={link.id}
                        placeholder="Image Link"
                        width="90%"
                        alignSelf={'center'}
                        mt={5}
                        bgColor="#070F2B"
                        borderColor="#070F2B"
                        value={link.image_link}
                        onChangeText={(newValue) => updateLink(link.id, newValue)}
                        ref={el => inputRefs.current[index] = el}
                    />
                ))}
                <Button
                    onPress={addLink}
                    colorScheme={'gray'}
                    width={'20%'}
                    alignSelf={'center'}
                    mt={3}
                >Add</Button>
                <TextArea
                    placeholder='Description'
                    bgColor={'#070F2B'}
                    borderColor={'#070F2B'}
                    width={'90%'}
                    alignSelf={'center'}
                    mt={5}
                    h={150}

                />
                <Button
                    width={'90%'}
                    alignSelf={'center'}
                    bgColor={'#070F2B'}
                    mt={4}
                >Create Product</Button>
            </ScrollView>
        </View>
    )
}
