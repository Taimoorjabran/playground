import { ChevronDownIcon } from '@chakra-ui/icons'
import {
    Avatar,
    AvatarBadge,
    Circle,
    Flex,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
    DarkMode,
} from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { useStores } from '../../store/rootStore'

const UserAvatar = observer(() => {
    const dependants = ['Ethan', 'Nate', 'Adara']

    const rootStore = useStores()
    return (
        <Flex align="center" p={4} py={3} borderBottomWidth="1px" borderColor="secondary.300" minW="280px">
            <Circle p="3px" bg="border.100">
                <Avatar src={rootStore.selfUser?.profilePic} boxSize={10}>
                    <AvatarBadge boxSize={3} bg="green.100" borderColor="transparent" />
                </Avatar>
            </Circle>
            <Flex direction="column" px={2} flex={1}>
                <Text color="grey.300" fontSize="sm" fontWeight="semibold" py={1} pr={5}>
                    {rootStore.selfUser.name}
                </Text>
                <Flex>
                    <Text px={2} rounded="full" fontSize="xs" color="grey.300" bg="secondary.300">
                        {rootStore.uiStore.selectedRole}
                    </Text>
                </Flex>
            </Flex>
            <DarkMode>
                <Menu>
                    <MenuButton
                        as={IconButton}
                        icon={<ChevronDownIcon />}
                        bg="transparent"
                        color="grey.200"
                        _hover={{ color: 'primary.100' }}
                        // _focus={{ bg: 'red' }}
                        // _selected={{ bg: 'red' }}
                        // _highlighted={{ bg: 'red' }}
                    />
                    <MenuList bg="secondary.100" borderWidth={0}>
                        {rootStore.selfUser.userRoles.map((x) => {
                            return x === 'guardian' ? (
                                <Flex key="guardian" direction="column">
                                    <Text ml={3} opacity={0.4} my={2}>
                                        dependants
                                    </Text>
                                    <Flex direction="column">
                                        {dependants.map((d) => {
                                            return (
                                                <MenuItem
                                                    key={d}
                                                    _hover={{ bg: 'secondary.300' }}
                                                    color={
                                                        x === rootStore.uiStore.selectedRole &&
                                                        d === rootStore.uiStore.dependant
                                                            ? 'primary.100'
                                                            : 'grey.100'
                                                    }
                                                    fontWeight={
                                                        x === rootStore.uiStore.selectedRole &&
                                                        d === rootStore.uiStore.dependant
                                                            ? 'semibold'
                                                            : 'normal'
                                                    }
                                                    onClick={() => {
                                                        rootStore.uiStore.selectedRole = x
                                                        rootStore.uiStore.dependant = d
                                                        rootStore.uiStore.history.push('/chat')
                                                        localStorage.setItem('fl_role', x)
                                                    }}
                                                >
                                                    {d}
                                                </MenuItem>
                                            )
                                        })}
                                    </Flex>
                                </Flex>
                            ) : (
                                <MenuItem
                                    key={x}
                                    _hover={{ bg: 'secondary.300' }}
                                    color={x === rootStore.uiStore.selectedRole ? 'primary.100' : 'grey.100'}
                                    fontWeight={x === rootStore.uiStore.selectedRole ? 'semibold' : 'normal'}
                                    onClick={() => {
                                        rootStore.uiStore.selectedRole = x
                                        rootStore.uiStore.history.push('/chat')
                                        localStorage.setItem('fl_role', x)
                                    }}
                                >
                                    {x}
                                </MenuItem>
                            )
                        })}

                        <MenuItem
                            mt={2}
                            pt={3}
                            borderTopWidth="1px"
                            borderColor="border.50"
                            _hover={{ bg: 'secondary.300' }}
                            color="grey.100"
                            onClick={() => {
                                rootStore.uiStore.history.push('/login')
                                localStorage.removeItem('fl_token')
                            }}
                        >
                            Log out
                        </MenuItem>
                    </MenuList>
                </Menu>
            </DarkMode>
        </Flex>
    )
})

export default UserAvatar
