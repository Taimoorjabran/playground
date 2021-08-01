import React, { useState, useEffect } from 'react'
import {
    Box,
    Text,
    Center,
    Flex,
    Image,
    Circle,
    Icon,
    Divider,
    Input,
    InputLeftElement,
    InputGroup,
    Avatar,
    Spacer,
} from '@chakra-ui/react'

import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react'

import { observer } from 'mobx-react-lite'
import { useStores } from '../../store/rootStore'
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from '@chakra-ui/icons'
import { DICT } from '../../store/classes/localize'
import { MdAdd, MdGroup, MdLock, MdSearch, MdWork } from 'react-icons/md'
import { AiFillBulb } from 'react-icons/ai'
import SidebarDirect from './SidebarDirect'
import CRUDModal from '../class-panel/CRUDModal'
import UserAvatar from './UserAvatar'
import { RiBroadcastFill } from 'react-icons/ri'
import AdminSearch from './AdminSearch'
import { FaChevronDown, FaChevronRight, FaSearch } from 'react-icons/fa'
import SearchUserModal from '../admin/SearchUserModal'

const Sidebar = observer(({ history }) => {
    const rootStore = useStores()
    const { t, uiStore } = useStores()
    const [collapsed, setCollapsed] = useState({
        classes: false,
        groups: false,
        direct: false,
        guidance: false,
    })
    useEffect(() => {
        if (rootStore.uiStore.selected !== 'chat') rootStore.uiStore.selected = 'chat'
    }, [])

    const Title = observer(() => {
        return (
            <Flex direction="column">
                <UserAvatar />
            </Flex>
        )
    })

    const TitleIcon = ({ icon, click }) => {
        return (
            <Circle bg="secondary.300" p="4px" ml={2}>
                <Icon
                    as={icon}
                    onClick={() => click?.()}
                    cursor="pointer"
                    boxSize={4}
                    color="grey.100"
                    _hover={{ color: 'primary.100' }}
                />
            </Circle>
        )
    }

    const ListTitle = observer(({ title, icon1, icon2, click1, click2, type }) => {
        return (
            <Flex p={2} pl={5} pr={4} _hover={{ bg: 'transparent' }} align="center" key={title} color="grey.300">
                <Text fontWeight="semibold" bg="primary.100" color="white" px={2} pt="1px" rounded="full" fontSize="sm">
                    {title}
                </Text>
                {console.log(collapsed[type])}
                {/* {collapsed[type] ? <Icon as={<FaChevronDown />} /> : <Icon as={<FaChevronRight />} />} */}
                <Icon
                    as={collapsed[type] ? FaChevronRight : FaChevronDown}
                    color="primary.100"
                    boxSize={3}
                    ml={2}
                    cursor="pointer"
                    onClick={() => {
                        setCollapsed({ ...collapsed, [type]: !collapsed[type] })
                    }}
                />
                <Spacer />
                {icon1 && <TitleIcon icon={icon1} click={click1} />}
                {icon2 && <TitleIcon icon={icon2} click={click2} />}
            </Flex>
        )
    })

    const ListItem = observer(({ _id, title, type, icon = null, count = 0, color }) => {
        const isSelected = _id === rootStore.uiStore.selectedId
        return (
            <Flex
                px={5}
                key={_id}
                py={2}
                align="center"
                bg={isSelected ? 'secondary.100' : 'transparent'}
                fontWeight={isSelected ? 'semibold' : 'normal'}
                borderRightColor={isSelected ? 'blue.100' : 'transparent'}
                borderLeftColor={isSelected ? 'blue.100' : 'transparent'}
                _hover={{
                    fontWeight: 'semibold',
                    color: 'blue.100',
                    bg: 'secondary.300',
                    borderRightColor: 'blue.100',
                    borderLeftColor: 'blue.100',
                }}
                cursor="pointer"
                onClick={() => {
                    rootStore.uiStore.selectedId = _id
                    rootStore.uiStore.subSelected = type
                    rootStore.uiStore.innerSelected = ''
                    history.push(`/chat/${type}/${_id}`)
                }}
                borderRightWidth={2}
                borderLeftWidth={2}
            >
                {!icon ? (
                    <Avatar
                        name={title}
                        size="xs"
                        bg={isSelected ? 'blue.100' : 'secondary.300'}
                        color={isSelected ? 'secondary.300' : 'grey.100'}
                        fontWeight="bold"
                        mr={2}
                    />
                ) : (
                    <Circle bg="secondary.300" mr={2} p="4px">
                        <Icon as={icon} color={isSelected ? 'blue.100' : color ? color : 'grey.300'} />
                    </Circle>
                )}
                <Text
                    color={isSelected ? 'blue.100' : 'grey.100'}
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    _hover={{
                        fontWeight: 'semibold',
                        color: 'blue.100',
                    }}
                    fontSize="sm"
                >
                    {title}
                </Text>
                <Spacer />
                <Text color="border.100">{count}</Text>
            </Flex>
        )
    })

    const List = observer(() => {
        return (
            <Flex direction="column" overflowY="auto" css={rootStore.uiStore.scrollCSS}>
                <Flex px={0} py={4} direction="column">
                    {rootStore.groupStore.adminGroups.map((item) => {
                        return (
                            <ListItem
                                title={item.title}
                                key={item._id}
                                _id={item._id}
                                type="group"
                                color="grey.300"
                                icon={MdLock}
                                count={item.messages.length}
                            />
                        )
                    })}
                </Flex>

                {uiStore.selectedRole !== 'admin' && (
                    <>
                        <ListTitle
                            title={t(DICT.classes)}
                            key="0"
                            icon1={MdAdd}
                            click1={() => (uiStore.modal = 'create_class')}
                            type="classes"
                        />

                        {!collapsed.classes && (
                            <Flex px={0} pb={4} direction="column">
                                {rootStore.classStore.classes.map((item) => {
                                    return (
                                        <ListItem
                                            title={item.title}
                                            key={item._id}
                                            _id={item._id}
                                            type="class"
                                            count={item.messages.length}
                                        />
                                    )
                                })}
                            </Flex>
                        )}
                    </>
                )}
                <ListTitle
                    title={t(DICT.groups)}
                    key="1"
                    icon1={MdAdd}
                    click1={() => (uiStore.modal = 'create_group')}
                    icon2={MdSearch}
                    click2={null}
                    type="groups"
                />
                {!collapsed.groups && (
                    <Flex px={0} pb={4} direction="column">
                        {rootStore.groupStore.filteredGroups(false).map((item) => {
                            function getGroupIcon() {
                                if (item.isPrivate) return MdLock
                                else if (item.isAdmin) {
                                    if (item.adminType === 'all') {
                                        return RiBroadcastFill
                                    } else {
                                        return MdWork
                                    }
                                } else return MdGroup
                            }
                            return (
                                <ListItem
                                    title={item.title}
                                    key={item._id}
                                    _id={item._id}
                                    type="group"
                                    color={item.isAdmin ? 'red.50' : 'grey.300'}
                                    icon={getGroupIcon()}
                                    count={item.messages.length}
                                />
                            )
                        })}
                    </Flex>
                )}
                {uiStore.selectedRole !== 'admin' && (
                    <>
                        <ListTitle
                            title={t(DICT.guidance)}
                            icon1={MdAdd}
                            click1={() => (uiStore.modal = 'create_guidance')}
                            icon2={MdSearch}
                            click2={null}
                            key="2"
                            type="guidance"
                        />
                        {!collapsed.guidance && (
                            <Flex px={0} pb={4} direction="column">
                                {rootStore.groupStore.filteredGroups(true).map((item) => {
                                    return (
                                        <ListItem
                                            title={item.title}
                                            key={item._id}
                                            _id={item._id}
                                            type="group"
                                            color="grey.300"
                                            icon={AiFillBulb}
                                            count={item.messages.length}
                                        />
                                    )
                                })}
                            </Flex>
                        )}
                    </>
                )}
                <ListTitle
                    title={t(DICT.directMsg)}
                    icon1={MdAdd}
                    click1={() => {
                        uiStore.modal = 'direct'
                    }}
                    type="direct"
                    key="332"
                />
                {!collapsed.direct && (
                    <Flex px={0} pb={4} mt={2} direction="column">
                        {rootStore.directStore.direct.map((item) => {
                            return <SidebarDirect _id={item._id} history={history} count={item.messages.length} />
                        })}
                    </Flex>
                )}
                {uiStore.selectedRole === 'admin' && adminItems()}
            </Flex>
        )
    })

    function adminItems() {
        return (
            <>
                <SearchUserModal />
                <Flex px={5} align="center" pt={3}>
                    <Flex
                        align="center"
                        bg="primary.100"
                        _hover={{ bg: 'grey.300' }}
                        rounded="full"
                        px={2}
                        py="1px"
                        cursor="pointer"
                        onClick={() => (uiStore.modal = 'search-user')}
                    >
                        <Icon as={MdSearch} mr={1} />
                        <Text color="white" fontWeight="semibold" fontSize="sm">
                            Search User
                        </Text>
                    </Flex>
                </Flex>
                <AdminSearch arr={rootStore.adminStore.baseClass} type="class" title="All Classes" history={history} />
                <AdminSearch arr={rootStore.adminStore.baseGroup} type="group" title="All Rooms" history={history} />
            </>
        )
    }

    return rootStore.uiStore.selected !== 'feed' ? (
        <Flex bg="secondary.200" direction="column">
            <Title />
            <List />
            <CRUDModal history={history} />
        </Flex>
    ) : null
})

export default Sidebar
