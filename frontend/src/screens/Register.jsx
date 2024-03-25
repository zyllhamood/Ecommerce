import React, { useRef, useState, useEffect } from 'react'
import { Flex, Text, Input, Button } from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Swal from 'sweetalert2';
export default function Register() {
    const nameRef = useRef('');
    const emailRef = useRef('');
    const phoneRef = useRef('');
    const passwordRef = useRef('');
    const rePasswordRef = useRef('');
    ////////////
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const alertSweet = (msg) => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: msg,
        })
    }
    const { isLoading, respRegister } = useSelector((state) => state.auth)
    useEffect(() => {
        if (respRegister !== null) {
            if (respRegister.message === "User registered successfully.") {
                navigate('/login');
            }
            else if (respRegister.username[0] === "A user with that username already exists.") {
                alertSweet('A user with that username already exists.');
            }
        }
    }, [respRegister])
    const handleButton = () => {
        const name = nameRef.current.value;
        const email = emailRef.current.value;
        const phone = phoneRef.current.value;
        const password = passwordRef.current.value;
        const rePassword = rePasswordRef.current.value;

        if (password !== rePassword) return alertSweet("Passwords not match");

        const data = {
            first_name: name,
            username: email,
            email,
            phone_number: phone,
            password
        }
        dispatch(register(data));
    }

    return (
        <>
            <Navbar />
            <Flex
                width={'100%'}
                mt='70px'
                justifyContent={'center'}
            >
                <Flex
                    flexDir="column"
                    height={'510px'}
                    bgColor='#0d1238'
                    p='7'
                    width={400}
                    borderRadius={8}
                >
                    <Text fontSize={36} fontFamily={'InknutAntiquaRegular'}>Sign up</Text>
                    <Input
                        placeholder='Name'
                        bgColor={'#1B1A55'}
                        borderColor={'#1B1A55'}
                        mt='6'
                        ref={nameRef}
                    />
                    <Input
                        placeholder='Email'
                        bgColor={'#1B1A55'}
                        borderColor={'#1B1A55'}
                        mt='4'
                        ref={emailRef}
                    />
                    <Input
                        type='tel'
                        placeholder='Phone'
                        bgColor={'#1B1A55'}
                        borderColor={'#1B1A55'}
                        mt='4'
                        ref={phoneRef}
                    />
                    <Input
                        placeholder='Password'
                        bgColor={'#1B1A55'}
                        borderColor={'#1B1A55'}
                        mt='4'
                        type='password'
                        ref={passwordRef}
                    />
                    <Input
                        placeholder='Re-Password'
                        bgColor={'#1B1A55'}
                        borderColor={'#1B1A55'}
                        mt='4'
                        type='password'
                        ref={rePasswordRef}
                    />
                    <Button
                        bgColor='#535C91'
                        borderRadius={26}
                        mt='6'
                        fontFamily={'InknutAntiquaRegular'}
                        color={'#fff'}
                        fontSize={20}
                        onClick={() => handleButton()}
                    >{isLoading ? <Icon icon="eos-icons:bubble-loading" width="32" height="32" color='#fff' /> : 'Sign up'}</Button>
                    <Flex mt='4' pl='2' pr='2'>

                        <Text
                            fontFamily={'Inconsolata'}
                            color={'#989FC1'}
                            as="button"
                            _hover={{
                                color: 'silver',
                            }}
                            onClick={() => navigate('/login')}
                        >You have an account ? Login</Text>
                    </Flex>
                </Flex>
            </Flex>
        </>
    )
}
