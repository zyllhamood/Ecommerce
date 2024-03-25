import React, { useState, useEffect, useRef, VStack } from 'react'
import { Flex, Button, Input, Textarea } from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
export default function AddProduct() {
    const [imageLinks, setImageLinks] = useState([{ id: Date.now(), image_link: '' }]);
    const navigate = useNavigate();
    const nameRef = useRef('');
    const priceRef = useRef(0);
    const inputRefs = useRef([]);
    const descriptionRef = useRef('');

    const access_token = Cookies.get('access_token');
    const addLink = () => {
        setImageLinks([...imageLinks, { id: Date.now(), image_link: '' }]);
    };
    const updateLink = (id, newValue) => {
        const updatedLinks = imageLinks.map(link => link.id === id ? { ...link, image_link: newValue } : link);
        setImageLinks(updatedLinks);
    };
    const handleButton = () => {
        const name = nameRef.current.value;
        const price = priceRef.current.value;
        //const image_link = image_linkRef.current.value;
        const description = descriptionRef.current.value;
        const data = {
            name,
            price,
            description,
            images: imageLinks
        }
        fetch('http://127.0.0.1:8000/api/add-product/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((data) => {
                navigate(`/product/${data.id}`);
                window.location.reload();
            })
    }
    return (
        <>
            <Navbar />
            <Flex
                minHeight={'600px'}
                height={'1000px'}
                width={'100%'}
                justifyContent={'center'}
            >
                <Flex


                    minHeight={'1000px'}
                    height={'3000px'}

                    bgColor={'#1B1A55'}
                    width={{ base: '80%', md: '50%' }}
                    mt='10'
                    borderRadius={8}
                    flexDir={'column'}
                    alignItems={'center'}

                >
                    <Input
                        placeholder='Name'
                        width={'90%'}
                        mt='5'
                        bgColor={'#070F2B'}
                        borderColor={'#070F2B'}
                        ref={nameRef}
                    />
                    <Input
                        placeholder='Price'
                        width={'90%'}
                        mt='5'
                        bgColor={'#070F2B'}
                        borderColor={'#070F2B'}
                        ref={priceRef}
                    />
                    {imageLinks.map((link, index) => (
                        <Input
                            key={link.id}
                            placeholder='Image Link'
                            width={'90%'}
                            mt='5'
                            bgColor={'#070F2B'}
                            borderColor={'#070F2B'}
                            value={link.image_link}
                            onChange={(e) => updateLink(link.id, e.target.value)}
                            ref={(el) => (inputRefs.current[index] = el)}
                        />
                    ))}
                    <Button onClick={addLink} mt="4">Add</Button>
                    <Textarea
                        placeholder='Description'
                        width={'90%'}
                        mt='5'
                        bgColor={'#070F2B'}
                        borderColor={'#070F2B'}
                        height={'200px'}
                        ref={descriptionRef}

                    ></Textarea>
                    <Button
                        bgColor={'#070F2B'}
                        color={'#fff'}
                        mt='5'
                        width={'90%'}
                        onClick={handleButton}
                    >Create Product</Button>
                </Flex>
            </Flex>
        </>
    )
}
