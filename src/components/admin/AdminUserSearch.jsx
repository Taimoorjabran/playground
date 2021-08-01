import React, { useState, useEffect } from 'react'
import { Box, Text, Center, Flex, Image, Circle, Icon, Divider, Spacer, Avatar, AvatarBadge } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { useStores } from '../../store/rootStore'
import { AiFillStar } from 'react-icons/ai'
import { DICT } from '../../store/classes/localize'
import { toJS } from 'mobx'
import { FaArrowRight } from 'react-icons/fa'
const AdminUserSearch = observer(() => {
    const { uiStore, t } = useStores()
    const rootStore = useStores()
    // const [search, setSearch] = useState([])

    const [messages, setMessages] = useState([])

    useEffect(() => {
        const result = []
        const filters = toJS(uiStore.searchUser.filters)

        const payload = []

        filters?.classes?.forEach((x) => {
            payload.push(x._id)
        })

        filters?.groups?.forEach((x) => {
            payload.push(x._id)
        })

        filters?.direct?.forEach((x) => {
            payload.push(x.direct)
        })
        ;(async function () {
            let searchResults = await rootStore.HTTP('admin/search-user', {
                filters,
                userId: uiStore.searchUser.userId,
            })
            searchResults = searchResults.sort((a, b) => a.createdAt - b.createdAt)
            setMessages(searchResults)
        })()

        // rootStore.adminStore.classes.forEach((item) => {
        //     if (item.containsMember(uiStore.searchUser)) {
        //         item.messages.forEach((msg) => {
        //             if (msg.user === uiStore.searchUser) {
        //                 result.push({
        //                     _id: item._id,
        //                     type: 'class',
        //                     title: item.title,
        //                     msg,
        //                 })
        //             }
        //         })
        //     }
        // })

        // rootStore.adminStore.groups.forEach((item) => {
        //     if (item.containsMember(uiStore.searchUser)) {
        //         item.messages.forEach((msg) => {
        //             if (msg.user === uiStore.searchUser) {
        //                 result.push({
        //                     _id: item._id,
        //                     type: 'group',
        //                     title: item.title,
        //                     msg,
        //                 })
        //             }
        //         })
        //     }
        // })
        // setSearch(result)
        // console.log(result)
    }, [uiStore.searchUser])

    function createParent(parentId) {
        let selected = uiStore.searchUser.all[parentId]
        if (selected) {
            if (selected.type === 'class') {
                return <ParentItem title={selected.title} subtitle="in the class" type="class" />
            } else if (selected.type === 'group') {
                return <ParentItem title={selected.title} subtitle="in a group" type="group" />
            } else {
                return (
                    <ParentItem profilePic={selected.profilePic} title={selected.title} subtitle="direct message to" />
                )
            }
        } else {
            return null
        }
    }

    const ParentItem = ({ profilePic, title, subtitle, type }) => {
        return (
            <Flex align="center" bg="secondary.200" rounded="full" px={2} py="1px">
                <Text color="grey.300" fontSize="sm">
                    {subtitle}
                </Text>
                <Icon as={FaArrowRight} boxSize="12px" color="blue.100" mx={3} />
                {profilePic ? (
                    <Avatar src={profilePic} boxSize="16px" mx={1} />
                ) : type === 'class' ? (
                    <Circle boxSize={3} mx={1} bg="green.100" />
                ) : (
                    <Text mx={1} color="primary.100">
                        #
                    </Text>
                )}
                <Text color="primary.100" fontSize="sm">
                    {title}
                </Text>
            </Flex>
        )
    }

    function getDateStamp(idx) {
        const options = { weekday: 'long', month: 'long', day: 'numeric' }
        const current = messages[idx]
        const curDate = new Date(current.createdAt)
        const curDateStr = curDate.toLocaleDateString('en-us', options)
        const today = new Date()
        if (idx > 0) {
            const previous = messages[idx - 1]
            const prevDate = new Date(previous.createdAt)
            if (curDate.getDate() === prevDate.getDate()) return null
            else return formatStamp()
        } else {
            return formatStamp()
        }

        function formatStamp() {
            if (
                curDate.getMonth() === today.getMonth() &&
                curDate.getFullYear() === today.getFullYear() &&
                curDate.getDate() === today.getDate()
            )
                return 'Today'
            else if (
                curDate.getMonth() === today.getMonth() &&
                curDate.getFullYear() === today.getFullYear() &&
                today.getDate() - curDate.getDate() === 1
            ) {
                return 'Yesterday'
            } else return curDateStr
        }
    }

    return (
        <Flex direction="column" flex={1}>
            <Flex p={5} bg="secondary.100" borderBottomColor="border.50" borderBottomWidth="1px" align="center">
                <Flex align="center">
                    <Text color="grey.300" fontWeight="normal">
                        Search result for
                    </Text>
                    <Avatar src={uiStore.searchUserDetail.profilePic} mx={2} ml={4} size="sm" />
                    <Text color="grey.100" fontSize="xl" fontWeight="semibold">
                        {uiStore.searchUserDetail.name}
                    </Text>
                </Flex>
            </Flex>
            <Flex direction="column" flex={1} overflowY="auto" css={uiStore.scrollCSS} mr={1}>
                {messages.map((x, idx) => {
                    const timestamp = getDateStamp(idx)
                    return (
                        <Flex direction="column">
                            {timestamp && (
                                <Flex justify="center" align="center" bg="secondary.100">
                                    <Divider bg="border.50" h="1px" flex={1} />
                                    <Text fontSize="xs" px={2} py="2px" color="grey.100">
                                        {timestamp}
                                    </Text>
                                    <Divider bg="border.50" h="1px" flex={1} />
                                </Flex>
                            )}
                            <Flex direction="row" _hover={{ bg: 'border.50' }} p={6} py={3}>
                                <Avatar
                                    src={uiStore.searchUserDetail?.profilePic}
                                    name={uiStore.searchUserDetail?.name}
                                    boxSize={10}
                                    mr={3}
                                >
                                    <AvatarBadge
                                        boxSize={2}
                                        bg="green.100"
                                        borderColor="transparent"
                                        mr="2px"
                                        mb="2px"
                                    />
                                </Avatar>
                                <Flex direction="column">
                                    <Flex align="center">
                                        <Text color="grey.100" fontWeight="semibold" fontSize="sm">
                                            {uiStore.searchUserDetail?.name}
                                        </Text>
                                        <Text color="grey.300" fontSize="xs" ml={3}>
                                            {new Intl.DateTimeFormat('en', {
                                                hour12: true,
                                                hour: 'numeric',
                                                minute: '2-digit',
                                            }).format(new Date(x.createdAt))}
                                        </Text>
                                        <Flex align="center" ml={3} rounded="lg" px={1}>
                                            {createParent(x.parentId)}
                                        </Flex>
                                    </Flex>
                                    <Text color="grey.200" pt={1} fontSize="sm" fontWeight="medium">
                                        {x.msg}
                                    </Text>
                                </Flex>
                            </Flex>
                        </Flex>
                    )
                })}
            </Flex>
        </Flex>
    )
})

export default AdminUserSearch
