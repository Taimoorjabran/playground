import { Flex } from '@chakra-ui/react'
import React from 'react'
import Navbar from '../components/Navbar'
// import Sidebar from '../components/sidebar/Sidebar'

const Home = ({ history }) => {
    return (
        <Flex bg="secondary.100">
            <Navbar history={history} />
        </Flex>
    )
}

export default Home
