import React, { useState, useEffect } from 'react'
import { Box, Text, View, ScrollView, Input, Button, Pressable } from 'native-base';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
export default function Accounts() {
    const { token } = useSelector((state) => state.auth);
    const [resp, setResp] = useState(null);
    const [search, setSearch] = useState('');
    const [respOld, setRespOld] = useState(null);
    useEffect(() => {
        if (resp === null) {
            fetch('http://192.168.8.187:8000/api/accounts/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`

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
        fetch(`http://192.168.8.187:8000/api/locked/${user_id}`, {
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
    const handleSearch = () => {
        console.log(`search : ${search}`)
        if (search === "") {
            setResp(respOld);
        }
        else {
            let filterUsers = resp.filter(word => word.name.includes(search) || word.username.includes(search));
            setResp(filterUsers);
        }
    }
    useEffect(() => {
        if (search === "") {
            setResp(respOld);
        }
    }, [resp, respOld, search])
    return (
        <View flex={1} bgColor={'#070f2b'}>
            <Navbar />
            <Box
                bgColor={'#1b1a55'}
                flex={1}
                width={'90%'}
                marginTop={10}
                alignSelf={'center'}
                borderRadius={8}
                alignItems={'center'}
            >
                <Input
                    placeholder='Search'
                    onChangeText={setSearch}
                    onChange={handleSearch}
                    mt={4}
                    width={'90%'}
                    bgColor={'#070f2b'}
                    borderColor={'#070f2b'}
                    fontSize={16}
                    color={'#fff'}
                />
                <ScrollView width={'90%'} mt={5}>
                    {resp && resp.length > 0 && resp.map((item) => (
                        <Box bgColor={'#070f2b'} width={'100%'} height={'140px'} mt={1} paddingLeft={2} paddingTop={2}>
                            <Text
                                color={'#fff'}
                                fontSize={16}
                            >Name : {item.name}</Text>
                            <Text
                                color={'#fff'}
                                fontSize={16}
                            >Email : {item.username}</Text>
                            <Text
                                color={'#fff'}
                                fontSize={16}
                            >Phone Number : {item.phone_number}</Text>
                            <Text
                                color={'#fff'}
                                fontSize={16}
                            >Craeted At : {item.created_at}</Text>
                            <Pressable onPress={() => handleLocked(item.id, item.locked)}><Icon size={26} name={item.locked ? 'lock' : 'lock-open-outline'} color={item.locked ? 'red' : 'silver'} /></Pressable>
                        </Box>
                    ))}
                </ScrollView>

            </Box>
        </View>
    )
}
