import React, { useState, useEffect, useRef } from 'react'
import { Flex, Text, Input, Button } from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import Swal from 'sweetalert2';
import { Icon } from '@iconify/react';
export default function Login() {
    const emailRef = useRef('');
    const passwordRef = useRef('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading, wrongLogin, isLogged } = useSelector((state) => state.auth);
    const handleNavigate = () => {
        window.history.pushState({}, '', `/`);
        window.location.reload();
    };
    useEffect(() => {
        if (isLogged === true) {
            handleNavigate();
        }
        else if (wrongLogin === true) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Wrong username or password!',
            })
        }
    }, [wrongLogin, isLogged])
    const handleButton = () => {
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const data = {
            username: email,
            password
        }
        dispatch(login(data));

    }
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleButton();
        }
    };
    return (
        <>
            <Navbar />
            <Flex
                width={'100%'}
                mt='100px'
                justifyContent={'center'}
            >
                <Flex
                    flexDir="column"
                    height={'340px'}
                    bgColor='#0d1238'
                    p='7'
                    width={400}
                    borderRadius={8}
                >
                    <Text fontSize={36} fontFamily={'InknutAntiquaRegular'}>Login</Text>
                    <Input
                        placeholder='Email'
                        bgColor={'#1B1A55'}
                        borderColor={'#1B1A55'}
                        mt='6'
                        ref={emailRef}
                        onKeyDown={handleKeyDown}
                    />
                    <Input
                        placeholder='Password'
                        bgColor={'#1B1A55'}
                        borderColor={'#1B1A55'}
                        mt='4'
                        type='password'
                        ref={passwordRef}
                        onKeyDown={handleKeyDown}
                    />
                    <Button
                        bgColor='#535C91'
                        borderRadius={26}
                        mt='6'
                        fontFamily={'InknutAntiquaRegular'}
                        color={'#fff'}
                        fontSize={20}
                        onClick={handleButton}



                    >{isLoading ? <Icon icon="eos-icons:bubble-loading" width="32" height="32" color='#fff' /> : 'Login'}</Button>

                    <Flex justifyContent={'space-between'} mt='4' pl='2' pr='2'>
                        <Text
                            fontFamily={'Inconsolata'}
                            color={'#989FC1'}
                            as="button"
                            _hover={{
                                color: 'silver',
                            }}

                        >Forget Password</Text>
                        <Text
                            fontFamily={'Inconsolata'}
                            color={'#989FC1'}
                            as="button"
                            _hover={{
                                color: 'silver',
                            }}
                            onClick={() => navigate('/signup')}
                        >Sign Up</Text>
                    </Flex>
                </Flex>
            </Flex>
        </>
    )
}

