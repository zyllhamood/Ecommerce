import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { Flex, Box, Text, Input } from '@chakra-ui/react';
import { Icon } from '@iconify/react';
import Cookies from 'js-cookie';
const data_old = [
    { username: "zyll@gmail.com", phone_number: '+966550467961', name: "Zyll", created_at: "2023-12-22", "locked": false },
    { username: "tsurgi@gmail.com", phone_number: '+966550467961', name: "Tsurgi", created_at: "2024-01-01", "locked": true },
    { username: "hamood@gmail.com", phone_number: '+966550467961', name: "Hamood", created_at: "2024-01-22", "locked": false },
    { username: "tenma@gmail.com", phone_number: '+966550467961', name: "Tenma", created_at: "2023-11-20", "locked": false },
]
export default function Accounts() {
    const [resp, setResp] = useState(null);
    const [respOld, setRespOld] = useState(null);
    const access_token = Cookies.get('access_token');
    useEffect(() => {
        if (resp === null) {
            fetch('http://127.0.0.1:8000/api/accounts/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`

                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setResp(data);
                    setRespOld(data);
                })
        }
    }, [resp]);
    const handleLocked = (user_id, status) => {
        const locked = !status;
        const content = {
            locked: locked
        }
        fetch(`http://127.0.0.1:8000/api/locked/${user_id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`

            },
            body: JSON.stringify(content)
        })
            .then((response) => response.json())
            .then((data) => console.log(data))
    }
    const handleSearch = (e) => {
        const value = e.target.value;
        if (value === "") {
            setResp(respOld);
        }
        else {
            let filterUsers = resp.filter(word => word.name.includes(value) || word.username.includes(value));
            setResp(filterUsers);
        }
    }
    return (
        <>
            <Navbar />
            <Flex
                width={'100%'}
                justifyContent={'center'}
                height={'600px'}
            >
                <Flex
                    bgColor={'#1B1A55'}
                    height={'500px'}
                    width={'90%'}
                    mt='10'
                    borderRadius={8}
                    flexDir={'column'}
                    alignItems={'center'}
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
                    pb='5'
                >
                    <Flex width={'96%'}>
                        <Input
                            placeholder='Search'
                            mt='5'
                            bgColor={'#070F2B'}
                            borderColor={'#070F2B'}
                            onChange={handleSearch}
                        />
                    </Flex>
                    {resp !== null && resp.map((item) => (
                        <Flex
                            bgColor={'#070F2B'}
                            width={'96%'}
                            // height={'80px'}
                            maxHeight={'200px'}
                            mt='5'
                            borderRadius={8}
                            justifyContent={'space-between'}
                            alignItems={'center'}

                            p='6'
                        >
                            <Text fontSize={18} width={'20%'}>{item.name}</Text>
                            <Text fontSize={18} width={'20%'}>{item.username}</Text>
                            <Text fontSize={18} width={'20%'}>{item.phone_number}</Text>
                            <Text fontSize={18} width={'20%'}>{item.created_at}</Text>
                            <Text fontSize={18} as={'button'} onClick={() => handleLocked(item.id, item.locked)}><Icon icon={item.locked ? 'carbon:locked' : 'mdi:unlocked-outline'} width="32" height="32" color={item.locked ? 'red' : '#1B1A55'} /></Text>
                        </Flex>
                    ))}
                </Flex>
            </Flex>
        </>
    )
}
