import React, { useState, useRef, useEffect } from 'react'
import { Flex, Button, Input, Textarea } from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
export default function EditProduct() {
    const navigate = useNavigate();
    const [resp, setResp] = useState(null);

    const access_token = Cookies.get('access_token');

    const { id } = useParams();
    useEffect(() => {
        if (resp === null) {
            fetch(`http://127.0.0.1:8000/api/product/${id}`)
                .then((response) => response.json())
                .then((data) => setResp(data))

        }

    }, [resp])
    const nameRef = useRef('');
    const priceRef = useRef(0);
    const descriptionRef = useRef('');
    const handleButton = () => {
        const name = nameRef.current.value;
        const price = priceRef.current.value;
        const description = descriptionRef.current.value;
        const data = {
            name,
            price,
            description,
        }
        fetch(`http://127.0.0.1:8000/api/edit-product/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((data) => {
                navigate(`/product/${id}`);
                window.location.reload();
            })
    }
    return (
        <>
            <Navbar />
            <Flex
                height={'600px'}
                width={'100%'}
                justifyContent={'center'}
            >
                {resp && <Flex
                    height={'500px'}
                    bgColor={'#1B1A55'}
                    width={'50%'}
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
                        defaultValue={resp.name}
                        ref={nameRef}
                    />
                    <Input
                        placeholder='Price'
                        width={'90%'}
                        mt='5'
                        bgColor={'#070F2B'}
                        borderColor={'#070F2B'}
                        defaultValue={resp.price}
                        ref={priceRef}
                    />

                    <Textarea
                        placeholder='Description'
                        width={'90%'}
                        mt='5'
                        bgColor={'#070F2B'}
                        borderColor={'#070F2B'}
                        height={'200px'}
                        defaultValue={resp.description}
                        ref={descriptionRef}

                    ></Textarea>
                    <Button
                        bgColor={'#070F2B'}
                        color={'#fff'}
                        mt='5'
                        width={'90%'}
                        onClick={handleButton}
                    >Edit Product</Button>
                </Flex>}
            </Flex>
        </>
    )
}
