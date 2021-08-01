import { Flex, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { useStores } from '../../store/rootStore'

const MessageItemHeader = observer(() => {
    const { uiStore } = useStores()
    const rootStore = useStores()
    let selected = null
    if (uiStore.selectedRole === 'admin') {
        if (uiStore.subSelected === 'class') {
            selected = rootStore.adminStore.selectedClass
        } else if (uiStore.subSelected === 'group') {
            if (rootStore.groupStore.exists(uiStore.selectedId)) {
                selected = rootStore.groupStore.selectedGroup
            } else selected = rootStore.adminStore.selectedGroup
        }
    } else {
        if (uiStore.subSelected === 'class') {
            selected = rootStore.classStore.selectedClass
        } else if (uiStore.subSelected === 'group') {
            selected = rootStore.groupStore.selectedGroup
        }
    }
    const Container = ({ children }) => {
        return (
            <Flex
                direction="column"
                color="grey.100"
                p={8}
                py={12}
                borderBottomWidth="1px"
                borderColor="border.50"
                boxShadow="inner"
            >
                {children}
            </Flex>
        )
    }

    function getHeader() {
        if (uiStore.selected === 'chat') {
            if (uiStore.subSelected === 'class') {
                if (uiStore.innerSelected === 'announcement') {
                    return (
                        <Container>
                            <Text fontWeight="semibold">
                                This the very beginning of{' '}
                                <Text as="span" color="blue.100" cursor="pointer">
                                    # {selected.title}
                                </Text>{' '}
                                announcements
                            </Text>
                        </Container>
                    )
                } else if (uiStore.innerSelected === 'assignment') {
                    return (
                        <Container>
                            <Text fontWeight="semibold">
                                This the very beginning of{' '}
                                <Text as="span" color="blue.100" cursor="pointer">
                                    # {selected.selectedAssignment.title}
                                </Text>{' '}
                                discussion
                            </Text>
                            <Text color="grey.300" fontSize="sm">
                                if you have any questions you can ask here
                            </Text>
                        </Container>
                    )
                } else {
                    return (
                        <Container>
                            <Text fontWeight="semibold">
                                This the very beginning of{' '}
                                <Text as="span" color="blue.100" cursor="pointer">
                                    # {selected.title}
                                </Text>{' '}
                                discussion
                            </Text>
                            <Text color="grey.300" fontSize="sm">
                                if you have any questions you can ask here
                            </Text>
                        </Container>
                    )
                }
            } else if (uiStore.subSelected === 'group') {
                return (
                    <Container>
                        <Text fontWeight="semibold">
                            This the very beginning of{' '}
                            <Text as="span" color="blue.100" cursor="pointer">
                                # {selected.title}
                            </Text>{' '}
                            room
                        </Text>
                        {selected.description && (
                            <Text fontSize="sm" my={2} mb={8}>
                                Description: {selected.description}
                            </Text>
                        )}
                        <Text color="grey.300" fontSize="sm">
                            Please note that all messages are monitored
                        </Text>
                    </Container>
                )
            } else if (uiStore.subSelected === 'direct') {
                return (
                    <Container>
                        <Text fontWeight="semibold">This is the beginning of the conversation</Text>
                        <Text fontSize="sm" color="grey.300">
                            Please note that all messages are monitored
                        </Text>
                    </Container>
                )
            }
        } else return null
    }

    return (
        <Flex flex={1} direction="column">
            {getHeader()}
        </Flex>
    )
})
export default MessageItemHeader
