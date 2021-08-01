import { SearchIcon } from '@chakra-ui/icons'
import { Avatar, Flex, Input, InputGroup, InputLeftElement, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { Member } from '../../store/classes/member'
import { Class, Group } from '../../store/classes/messageGroups'
import { useStores } from '../../store/rootStore'
import { truncateString } from '../../utils/truncate'

const AdminSearch = observer(({ type, arr, title, history }) => {
    const { uiStore, HTTP, adminStore } = useStores()
    const rootStore = useStores()
    const [filtered, setFiltered] = useState(arr)
    const [filter, setFilter] = useState('')
    return (
        <Flex p={5} pb={4} direction="column">
            <Flex align="center" pb={3}>
                <Text fontWeight="semibold" bg="primary.100" color="white" px={2} pt="1px" rounded="full" fontSize="sm">
                    {title}
                </Text>
            </Flex>
            <InputGroup>
                <InputLeftElement pointerEvents="none" children={<SearchIcon color="border.100" mb={2} />} />
                <Input
                    boxShadow="md"
                    rounded="full"
                    size="sm"
                    value={filter}
                    onChange={(e) => {
                        setFilter(e.target.value)
                        if (e.target.value.length > 0) {
                            setFiltered(arr.filter((x) => x.title.includes(e.target.value)))
                        } else {
                            setFiltered(arr)
                        }
                    }}
                    focusBorderColor="primary.100"
                    placeholder={'Search'}
                    bg="secondary.100"
                    _placeholder={{ color: 'border.100' }}
                    color="grey.100"
                />
            </InputGroup>
            <Flex maxH="200px" mt={3} direction="column" overflowY="auto" css={uiStore.scrollCSS}>
                {filtered.map((x) => {
                    const isSelected = x._id === uiStore.selectedId
                    return (
                        <Flex
                            key={x._id}
                            p={1}
                            cursor="pointer"
                            onClick={async () => {
                                let result

                                uiStore.selectedId = ''
                                uiStore.subSelected = ''
                                uiStore.innerSelected = ''

                                if (type === 'class') {
                                    if (adminStore.existsClass(x._id)) {
                                        navigate()
                                    } else {
                                        result = await HTTP('admin/class', { classId: x._id })
                                        result.members.forEach((mem) => {
                                            // if (!rootStore.memberStore.members.get(mem._id)) {
                                            rootStore.memberStore.members.set(mem._id, new Member(mem))
                                            // }
                                        })
                                        adminStore.classes.push(new Class(result.cls, rootStore))

                                        // console.log(result)
                                        // console.log(adminStore.classById(x._id))
                                        navigate()
                                    }
                                    console.log(result)
                                } else {
                                    if (adminStore.existsGroup(x._id)) {
                                        navigate()
                                    } else {
                                        result = await HTTP('admin/group', { groupId: x._id })
                                        result.members.forEach((mem) => {
                                            if (!rootStore.memberStore.members.get(mem._id)) {
                                                rootStore.memberStore.members.set(mem._id, new Member(mem))
                                            }
                                        })
                                        adminStore.groups.push(new Group(result.group, rootStore))
                                        console.log(result)
                                        console.log(adminStore.groupById(x._id))
                                        navigate()
                                    }
                                }
                                function navigate() {
                                    uiStore.selectedId = x._id
                                    uiStore.subSelected = type
                                    uiStore.innerSelected = ''
                                    console.log('go to ' + `/chat/${type}/${x._id}`)
                                    history.push(`/chat/${type}/${x._id}`)
                                }
                            }}
                        >
                            <Avatar
                                name={x.title}
                                size="xs"
                                bg={isSelected ? 'primary.100' : 'secondary.300'}
                                color={isSelected ? 'secondary.300' : 'grey.100'}
                                fontWeight="bold"
                                mr={2}
                            />
                            <Text
                                color={isSelected ? 'primary.100' : 'grey.100'}
                                fontWeight={isSelected ? 'bold' : 'normal'}
                                _hover={{
                                    fontWeight: 'semibold',
                                    color: 'primary.100',
                                }}
                                fontSize="sm"
                            >
                                {truncateString(x.title)}
                            </Text>
                        </Flex>
                    )
                })}
            </Flex>
        </Flex>
    )
})

export default AdminSearch
