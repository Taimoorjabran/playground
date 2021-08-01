import { Box, Center, Divider, Flex, Icon, Image, Spacer, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { IoMdChatbubbles } from 'react-icons/io'
import { RiInstagramFill } from 'react-icons/ri'
import { VscBroadcast } from 'react-icons/vsc'
import { WiMoonAltFirstQuarter } from 'react-icons/wi'
import icon from '../assets/images/icon.png'
import { useStores } from '../store/rootStore'
import Broadcast from './broadcast/Broadcast'

const Navbar = observer(({ history }) => {
    const { uiStore } = useStores()
    const rootStore = useStores()

    const NavIcon = observer(({ icon, type }) => {
        return (
            <Flex h={12} align="center" justify="center">
                <Icon
                    as={icon}
                    boxSize={10}
                    rounded="xl"
                    bg={uiStore.selected === type ? 'primary.100' : 'transparent'}
                    p={2}
                    color={uiStore.selected === type ? 'white' : 'grey.300'}
                    _hover={{ color: uiStore.selected === type ? 'white' : 'grey.100' }}
                    cursor="pointer"
                    onClick={() => {
                        if (type === 'broadcast') {
                            uiStore.modal = 'broadcast'
                        } else {
                            uiStore.selected = type
                            history.push(`/${type}`)
                        }
                    }}
                />
            </Flex>
        )
    })

    const NavButton = observer(({ icon, click }) => {
        return (
            <Flex h={12} align="center" justify="center" _hover={{ bg: 'secondary.200' }}>
                <Icon
                    as={icon}
                    boxSize={7}
                    color="grey.300"
                    _hover={{ color: 'grey.100' }}
                    cursor="pointer"
                    onClick={click}
                />
            </Flex>
        )
    })

    return (
        <Flex bg="secondary.300" direction="column" minW="64px">
            <Center p={3} py="15px" rounded="md">
                <Box bg="secondary.200" p={1} rounded="md">
                    <Image src={icon} boxSize={8} rounded="md" boxShadow="base" />
                </Box>
            </Center>
            <Divider bg="border.100" h="0.01em" mb={12} />
            <NavIcon icon={IoMdChatbubbles} type="chat" key="1" />
            <NavIcon icon={RiInstagramFill} type="feed" key="2" />
            {uiStore.selectedRole === 'admin' && <NavIcon key="3" icon={VscBroadcast} type="broadcast" />}
            <Spacer />
            <Flex h={12} align="center" justify="center" _hover={{ bg: 'secondary.200' }}>
                <Text
                    color="grey.300"
                    fontWeight="semibold"
                    cursor="pointer"
                    onClick={() => {
                        rootStore.language = rootStore.language === 'en' ? 'es' : 'en'
                        localStorage.setItem('lng', rootStore.language)
                    }}
                >
                    {rootStore.language === 'en' ? 'es' : 'en'}
                </Text>
            </Flex>
            <Divider bg="border.100" h="0.01em" />
            <NavButton icon={WiMoonAltFirstQuarter} click={() => uiStore.switchTheme()} />
            {uiStore.selectedRole === 'admin' && <Broadcast />}
        </Flex>
    )
})
export default Navbar
