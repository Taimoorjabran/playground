import { Avatar, Circle, Flex, Icon, Text, Center } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { ImBook } from 'react-icons/im'
import { MdAdd, MdEdit } from 'react-icons/md'
import { DICT } from '../../store/classes/localize'
import { useStores } from '../../store/rootStore'
import MemberItem from './MemberItem'
const ClassPanel = observer(({ history, location }) => {
    const rootStore = useStores()
    const { t, uiStore } = useStores()
    let current = null
    if (uiStore.selectedRole !== 'admin') {
        current = rootStore.classStore.selectedClass
    } else current = rootStore.adminStore.selectedClass

    const Announcement = observer(({ title }) => {
        return (
            <Flex
                py={2}
                px={5}
                align="center"
                fontWeight={uiStore.innerSelected === 'announcement' ? 'bold' : 'semibold'}
                color={uiStore.innerSelected === 'announcement' ? 'primary.100' : 'grey.300'}
                borderRightWidth={2}
                borderLeftWidth={2}
                borderRightColor="transparent"
                borderLeftColor="transparent"
                bg="secondary.100"
                _hover={{
                    borderRightColor: 'primary.100',
                    borderLeftColor: 'primary.100',
                    bg: 'secondary.150',
                }}
                cursor="pointer"
                onClick={() => {
                    if (rootStore.uiStore.innerSelected !== 'announcement') {
                        rootStore.uiStore.innerSelected = 'announcement'
                        rootStore.uiStore.innerSelectedId = ''
                        const classId = location.pathname.split('/')[3]
                        history.push(`/chat/class/${classId}/announcement`)
                    }
                }}
            >
                <Text flex={1}>{title ? title : t(DICT.announcements)}</Text>
                <Text opacity={0.5}>{current?.announcements.length}</Text>
            </Flex>
        )
    })

    const Discussion = observer(({ title }) => {
        return (
            <Flex
                mt={3}
                py={2}
                px={5}
                align="center"
                fontWeight={uiStore.innerSelected === '' ? 'bold' : 'semibold'}
                color={uiStore.innerSelected === '' ? 'primary.100' : 'grey.300'}
                borderRightWidth={2}
                borderLeftWidth={2}
                borderRightColor="transparent"
                borderLeftColor="transparent"
                bg="secondary.100"
                _hover={{
                    borderRightColor: 'primary.100',
                    borderLeftColor: 'primary.100',
                    bg: 'secondary.150',
                }}
                cursor="pointer"
                onClick={() => {
                    if (rootStore.uiStore.innerSelected !== '') {
                        rootStore.uiStore.innerSelected = ''
                        rootStore.uiStore.innerSelectedId = ''
                        const classId = location.pathname.split('/')[3]
                        history.push(`/chat/class/${classId}`)
                    }
                }}
            >
                <Text flex={1}>{title ? title : t(DICT.discussion)}</Text>
                <Text opacity={0.5}>{current?.messages.length}</Text>
            </Flex>
        )
    })

    return (
        <Flex direction="column" minW={300} bg="secondary.100" boxShadow="2xl">
            <Flex mb={2} pt={2} align="center" borderBottomWidth="1px" borderBottomColor="border.50">
                <Flex direction="column" flex={1} pb={2}>
                    <Text
                        color="grey.100"
                        pb="1px"
                        fontWeight="semibold"
                        fontSize="lg"
                        borderLeftWidth={4}
                        borderLeftColor="primary.100"
                        px={5}
                    >
                        {current?.title}
                    </Text>
                    <Text color="grey.300" fontSize="xs" mt={2} px={5}>
                        MWF 4:30 PM - 5:30 PM
                    </Text>
                </Flex>
                <Icon
                    as={MdEdit}
                    color="grey.200"
                    cursor="pointer"
                    _hover={{ color: 'primary.100' }}
                    mr={5}
                    onClick={() => (uiStore.modal = 'edit_class')}
                />
            </Flex>

            <Flex direction="column" overflowY="auto" css={uiStore.scrollCSS} mr="3px">
                <Discussion title="Discussion Room" />
                <Announcement />

                <Flex direction="column" py={3}>
                    <Flex align="center" pb={3}>
                        <Text flex={1} fontWeight="semibold" color="grey.300" px={5}>
                            {t(DICT.assignments)}
                        </Text>
                        {uiStore.selectedRole === 'teacher' && (
                            <Center
                                boxSize={3}
                                bg="secondary.300"
                                p={3}
                                rounded="full"
                                mr={4}
                                cursor="pointer"
                                _hover={{ color: 'primary.100' }}
                                onClick={() => {
                                    uiStore.modal = 'create_assignment'
                                }}
                            >
                                <Icon as={MdAdd} />
                            </Center>
                        )}
                    </Flex>
                    {current?.assignments?.map((item) => {
                        return (
                            <Flex
                                px={5}
                                fontSize="sm"
                                py={2}
                                align="center"
                                cursor="pointer"
                                key={item._id}
                                borderRightWidth={2}
                                borderLeftWidth={2}
                                borderRightColor="transparent"
                                borderLeftColor="transparent"
                                fontWeight={uiStore.innerSelectedId === item._id ? 'bold' : 'semibold'}
                                color={uiStore.innerSelectedId === item._id ? 'blue.100' : 'grey.300'}
                                bg="secondary.100"
                                _hover={{
                                    borderRightColor: 'blue.100',
                                    borderLeftColor: 'blue.100',
                                    bg: 'secondary.150',
                                }}
                                onClick={() => {
                                    if (rootStore.uiStore.innerSelectedId !== item._id) {
                                        rootStore.uiStore.innerSelected = 'assignment'
                                        rootStore.uiStore.innerSelectedId = item._id
                                        const classId = location.pathname.split('/')[3]
                                        history.push(`/chat/class/${classId}/assignment/${item._id}`)
                                    }
                                }}
                            >
                                <Icon as={ImBook} mr={3} mb="2px" />
                                <Text flex={1}>{item.title}</Text>
                                <Text>0</Text>
                            </Flex>
                        )
                    })}
                </Flex>

                <Flex direction="column" py={3}>
                    <Text fontWeight="semibold" color="grey.300" px={5} pb={3}>
                        {t(DICT.teachers)}
                    </Text>
                    {current?.teachers.map((item) => {
                        return <MemberItem item={item} history={history} />
                    })}
                </Flex>
                {uiStore.selectedRole !== 'guardian' && (
                    <Flex direction="column" py={3}>
                        <Text fontWeight="semibold" color="grey.300" px={5} pb={3}>
                            {t(DICT.teachingAssistants)}
                        </Text>
                        {current?.teachingAssistants.map((item) => {
                            return <MemberItem item={item} history={history} />
                        })}
                    </Flex>
                )}
                {uiStore.selectedRole !== 'guardian' && (
                    <Flex direction="column" py={3}>
                        <Text fontWeight="semibold" color="grey.300" px={5} pb={3}>
                            {t(DICT.students)}
                        </Text>
                        {current?.students.map((item) => {
                            return <MemberItem item={item} history={history} />
                        })}
                    </Flex>
                )}
                {uiStore.selectedRole !== 'guardian' && (
                    <Flex direction="column" py={3}>
                        <Text fontWeight="semibold" color="grey.300" px={5} pb={3}>
                            {t(DICT.guardians)}
                        </Text>
                        {current?.guardians.map((item) => {
                            return <MemberItem item={item} guardian history={history} />
                        })}
                    </Flex>
                )}
            </Flex>
        </Flex>
    )
})

export default ClassPanel
