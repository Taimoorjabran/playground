import { SearchIcon } from '@chakra-ui/icons'
import {
    Avatar,
    AvatarBadge,
    Box,
    Circle,
    Divider,
    Flex,
    Icon,
    Input,
    InputGroup,
    InputLeftElement,
    Spacer,
    Text,
} from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { useEffect, useRef, useState } from 'react'
import { AiFillStar } from 'react-icons/ai'
import { FaQuoteRight } from 'react-icons/fa'
import { HiSpeakerphone } from 'react-icons/hi'
import { ImBook, ImLink } from 'react-icons/im'
import { MdDelete, MdError, MdGroup, MdGroupAdd, MdLock, MdNotificationsActive } from 'react-icons/md'
import { RiDiscussFill } from 'react-icons/ri'
import { DICT } from '../../store/classes/localize'
import { useStores } from '../../store/rootStore'
import InviteModal from './InviteModal'
import MessageItemHeader from './MessageItemHeader'

const MessagePanel = observer((history, location) => {
    const rootStore = useStores()
    const { uiStore, t, sendMessage, groupStore } = useStores()
    const [selected, setSelected] = useState('')
    /* #region  Header */
    const Header = observer(({ children, p = 5 }) => {
        return (
            <Flex p={p} bg="secondary.100" borderBottomColor="border.50" borderBottomWidth="1px" align="center">
                {children}
            </Flex>
        )
    })

    const HeaderTitle = observer(({ title, subtitle, icon, color, click }) => {
        return (
            <Flex align="center" onClick={click}>
                <Text color="grey.100" fontSize="xl" fontWeight="semibold" cursor={!click ? 'no-drop' : 'pointer'}>
                    {title}
                </Text>
                <Icon as={icon} ml={4} color={color ? color : 'blue.100'} />
                <Text ml={1} fontWeight="normal" color="grey.300" fontSize="sm">
                    {subtitle}
                </Text>
            </Flex>
        )
    })

    const HeaderQuote = observer(({ quote }) => {
        return (
            <Flex>
                <Text color="primary.100" fontWeight="semibold" mr={2}>
                    {quote}
                </Text>
                <Icon as={FaQuoteRight} boxSize={5} color="primary.200" />
            </Flex>
        )
    })

    const HeaderIconButton = ({ click, icon, iconSize = 4, color, textColor, title, mx }) => {
        return (
            <Flex
                align="center"
                cursor="pointer"
                borderColor="transparent"
                _hover={{ borderColor: 'border.50' }}
                borderWidth="1px"
                p={1}
                px={2}
                mx={mx ? mx : 3}
                rounded="full"
                onClick={click}
            >
                <Icon as={icon} color={color} mr={1} boxSize={iconSize} />
                <Text color={textColor ? textColor : 'grey.300'} fontSize="sm" fontWeight="semibold">
                    {title}
                </Text>
            </Flex>
        )
    }

    const AssignmentHeader = observer(() => {
        const selectedAssignment = rootStore.classStore.selectedClass.selectedAssignment
        return (
            <Flex
                p="11px"
                pl={5}
                pr={0}
                bg="secondary.100"
                borderBottomColor="border.50"
                borderBottomWidth="1px"
                align="center"
            >
                <Flex direction="column" flex={1}>
                    <Flex align="center">
                        <Text
                            color="grey.100"
                            fontSize="xl"
                            fontWeight="semibold"
                            onClick={() => {
                                uiStore.modal = 'edit_assignment'
                            }}
                            cursor="pointer"
                        >
                            {selectedAssignment.title}
                        </Text>
                        <Icon as={ImBook} ml={4} color="blue.100" />
                        <Text as="span" ml={1} fontWeight="normal" color="grey.300" fontSize="sm">
                            Assignemnt
                        </Text>
                    </Flex>
                    <Text color="grey.300" fontSize="xs" fontWeight="medium">
                        {selectedAssignment.description}
                    </Text>
                </Flex>
                <Box display={['none', null, null, null, 'block']}>
                    <Search />
                </Box>

                {selectedAssignment.link && (
                    <HeaderIconButton
                        title={selectedAssignment.linkTitle}
                        icon={ImLink}
                        iconSize={3}
                        color="primary.100"
                        textColor="primary.100"
                        click={() => window.open(selectedAssignment.link, '_blank').focus()}
                    />
                )}
                <Flex
                    direction="column"
                    textAlign="right"
                    borderLeftWidth="1px"
                    borderRightWidth="1px"
                    borderColor="border.50"
                    px={5}
                    display={['none', null, null, 'flex']}
                >
                    <Flex align="center">
                        <Icon as={MdError} mr={1} boxSize={4} color="red.100" />
                        <Text color="red.100" fontWeight="bold" fontSize="xs">
                            Due In
                        </Text>
                    </Flex>

                    <Text color="grey.300" fontWeight="bold">
                        2 Days
                    </Text>
                </Flex>
                <Box display={['none', null, null, null, 'block']}>
                    <HeaderIconButton
                        title={t(DICT.setReminder)}
                        icon={MdNotificationsActive}
                        iconSize={5}
                        color="green.100"
                        click={null}
                    />
                </Box>
            </Flex>
        )
    })

    /* #endregion */

    const BadgeItem = ({ title, icon }) => {
        return (
            <Flex align="center" ml={3} rounded="lg" px={1}>
                <Icon as={icon} boxSize={3} mr={1} color="blue.100" />
                <Text color="blue.200" fontWeight="semibold" fontSize="xs">
                    {title}
                </Text>
            </Flex>
        )
    }

    /**
     * @param {number}
     */
    function getDateStamp(idx) {
        const options = { weekday: 'long', month: 'long', day: 'numeric' }
        const current = uiStore.messages[idx]
        const curDate = new Date(current.createdAt)
        const curDateStr = curDate.toLocaleDateString('en-us', options)
        const today = new Date()
        if (idx > 0) {
            const previous = uiStore.messages[idx - 1]
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

    const MessageBody = observer(() => {
        const divRef = useRef(null)
        useEffect(() => {
            divRef?.current?.scrollIntoView({ behavior: 'auto' })
        }, [])
        useEffect(() => {
            divRef?.current?.scrollIntoView({ behavior: 'smooth' })
        })

        function validateUrl(value) {
            return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
                value,
            )
        }

        return (
            <>
                <Flex direction="column" flex={1} justify="flex-end">
                    <MessageItemHeader />
                    {uiStore.messages.map((x, idx) => {
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
                                <Flex direction="row" _hover={{ bg: 'secondary.150' }} p={6} py={3}>
                                    <Avatar
                                        src={x?.userDetail?.profilePic}
                                        name={x?.userDetail?.name}
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
                                                {x.userDetail.name}
                                            </Text>
                                            <Text color="grey.300" fontSize="xs" ml={3}>
                                                {new Intl.DateTimeFormat('en', {
                                                    hour12: true,
                                                    hour: 'numeric',
                                                    minute: '2-digit',
                                                }).format(new Date(x.createdAt))}
                                            </Text>
                                            {x.userDetail.roles === 'teacher' && (
                                                <BadgeItem title={t(DICT.teacher)} icon={AiFillStar} />
                                            )}
                                            <Icon
                                                as={MdDelete}
                                                color="red.100"
                                                ml={2}
                                                onClick={() => {
                                                    uiStore.removeMessage(x._id)
                                                }}
                                            />
                                        </Flex>
                                        {!validateUrl(x.message) ? (
                                            <Text color="grey.200" pt={1} fontSize="sm" fontWeight="medium">
                                                {x.message}
                                            </Text>
                                        ) : (
                                            <Text
                                                color="blue.100"
                                                pt={1}
                                                fontSize="sm"
                                                fontWeight="medium"
                                                bg="secondary.200"
                                                px={2}
                                                rounded="full"
                                                cursor="pointer"
                                                onClick={() => {
                                                    window.open(x.message, '_blank').focus()
                                                }}
                                            >
                                                {x.message}
                                            </Text>
                                        )}
                                    </Flex>
                                </Flex>
                            </Flex>
                        )
                        // return messageItem(x)
                    })}
                </Flex>
                <div ref={divRef} />
            </>
        )
    })

    const MessageInput = observer(() => {
        const [msg, setMsg] = useState('')

        return (
            // <Flex borderTopWidth="1px" borderTopColor="border.50" position="relative" w="100" bg="green">
            //     <Textarea position="absolute" bottom={5} bg="red" width="100%" />
            // </Flex>
            <Flex
                borderWidth="1px"
                bg="input.100"
                rounded="full"
                borderColor="border.50"
                m={5}
                px={2}
                __css={{ boxShadow: ' 5px 5px 10px rgba(0,0,0,.25)' }}
            >
                <Input
                    color="grey.100"
                    bg="transparent"
                    placeholder={uiStore.selectedTitle}
                    _placeholder={{ color: 'grey.300', opacity: 0.6 }}
                    focusBorderColor="transparent"
                    borderWidth={0}
                    value={msg}
                    onChange={(x) => setMsg(x.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && msg.length > 0) {
                            setMsg('')
                            sendMessage(msg)
                        }
                    }}
                />
            </Flex>
        )
    })

    const Search = observer(() => {
        return (
            <Box mx={3} w={140} mb="-2px">
                <InputGroup size="sm">
                    <InputLeftElement pointerEvents="none" children={<SearchIcon color="border.100" boxSize={3} />} />
                    <Input
                        borderWidth="1px"
                        borderColor="border.50"
                        boxShadow="inner"
                        rounded="full"
                        focusBorderColor="primary.100"
                        placeholder={t(DICT.search)}
                        fontSize="sm"
                        // bg="secondary.200"
                        _placeholder={{ color: 'border.100' }}
                        color="grey.100"
                    />
                </InputGroup>
            </Box>
        )
    })

    function header() {
        if (uiStore.subSelected === 'class') {
            let selected = null
            if (uiStore.selectedRole === 'admin') {
                selected = rootStore.adminStore.selectedClass
            } else {
                selected = rootStore.classStore.selectedClass
            }

            if (uiStore.innerSelected === '')
                return (
                    <Header>
                        <HeaderTitle title={selected.title} subtitle={t(DICT.classDiscuss)} icon={RiDiscussFill} />
                        <Spacer />
                        <Box display={['none', null, null, null, 'block']}>
                            <Search />
                        </Box>
                        <Box display={['none', null, null, null, null, 'block']}>
                            <HeaderQuote quote={selected.dailyMessage} />
                        </Box>
                    </Header>
                )
            else if (uiStore.innerSelected === 'announcement') {
                return (
                    <Header>
                        <HeaderTitle title={selected.title} subtitle={t(DICT.announcements)} icon={HiSpeakerphone} />
                        <Spacer />
                        <Box display={['none', null, null, null, 'block']}>
                            <Search />
                        </Box>
                    </Header>
                )
            } else if (uiStore.innerSelected === 'assignment') {
                return <AssignmentHeader />
            }
        } else if (uiStore.subSelected === 'group') {
            let group = null
            if (uiStore.selectedRole === 'admin' && !rootStore.groupStore.exists(uiStore.selectedId)) {
                group = rootStore.adminStore.selectedGroup
            } else {
                group = rootStore.groupStore.selectedGroup
            }

            return (
                <Header>
                    <HeaderTitle
                        title={group.title}
                        subtitle={group.isPrivate ? t(DICT.private) : t(DICT.public)}
                        icon={group.isPrivate ? MdLock : MdGroup}
                        color={group.isPrivate ? 'red.50' : 'primary.100'}
                        click={
                            group.isAdmin
                                ? null
                                : () =>
                                      (uiStore.modal = groupStore.selectedGroup.isGuidance
                                          ? 'edit_guidance'
                                          : 'edit_group')
                        }
                    />
                    <Spacer />
                    <Box display={['none', null, null, null, 'block']}>
                        <Search />
                    </Box>
                    <Flex w="1px" h={7} bg="border.50" ml={2} display={['none', null, null, 'flex']} />
                    <Box display={['none', null, null, 'block']}>
                        <HeaderIconButton
                            title={`${group.members.length} ${group.members.length === 1 ? 'Member' : 'Members'}`}
                            icon={MdGroup}
                            color="primary.100"
                            iconSize={5}
                            mx={2}
                        />
                    </Box>
                    <Box display={['none', null, null, 'block']}>
                        <HeaderIconButton
                            title="Invite"
                            icon={MdGroupAdd}
                            color="green.100"
                            iconSize={5}
                            mx={1}
                            click={() => {
                                uiStore.modal = 'invite'
                            }}
                        />
                    </Box>
                </Header>
            )
        } else if (uiStore.subSelected === 'direct') {
            const direct = rootStore.directStore.selectedDirect
            return (
                <Header>
                    {direct.otherMembers.map((x) => {
                        return (
                            <Flex key={x._id} ml={1}>
                                <Avatar src={x.profilePic} size="sm" mb="-1px" />
                            </Flex>
                        )
                    })}
                    <Text
                        color="grey.100"
                        fontSize="xl"
                        ml={2}
                        fontWeight="semibold"
                        display={
                            direct.otherMembers.length === 1
                                ? ['none', null, 'inline']
                                : ['none', null, null, null, 'inline']
                        }
                    >
                        {direct.otherMemeberNames(60)}
                    </Text>
                    {direct.otherMembers.length === 1 &&
                        (rootStore.selfUser.roles === 'student' || direct.otherMembers[0].roles === 'student') &&
                        direct.commonClasses.map((cls) => {
                            return (
                                <Flex key={cls._id} align="center" ml={3} display={['none', null, null, null, 'flex']}>
                                    <Circle boxSize="5px" bg="green.100" mx={1} />
                                    <Text color="grey.300">{cls.title}</Text>
                                </Flex>
                            )
                        })}
                    <Spacer />
                    <Box display={['none', null, null, null, 'block']}>
                        <Search />
                    </Box>
                    <Flex w="1px" h={7} bg="border.50" ml={2} display={['none', null, null, 'block']} />
                    {direct.otherMembers > 1 ? (
                        <Box display={['none', null, null, 'block']}>
                            <HeaderIconButton
                                title={`${direct.members.length} ${direct.members.length === 1 ? 'Member' : 'Members'}`}
                                icon={MdGroup}
                                color="primary.100"
                                iconSize={5}
                                mx={2}
                            />
                        </Box>
                    ) : (
                        direct.otherMembers[0].guardian &&
                        (uiStore.selectedRole === 'teacher' || uiStore.selectedRole === 'admin') && (
                            <Flex
                                direction="column"
                                align="flex-end"
                                mx={2}
                                ml={4}
                                my={-2}
                                display={['none', null, null, 'block']}
                            >
                                <Flex>
                                    <Text bg="blue.100" fontSize="xs" rounded="full" px={2} color="white">
                                        guardian
                                    </Text>
                                </Flex>
                                <Text fontSize="sm">{direct.otherMembers[0].guardian}</Text>
                            </Flex>
                        )
                    )}
                    <Box display={['none', null, null, 'block']}>
                        <HeaderIconButton
                            title="Invite"
                            icon={MdGroupAdd}
                            color="green.100"
                            iconSize={5}
                            mx={1}
                            click={() => {
                                uiStore.modal = 'invite'
                            }}
                        />
                    </Box>
                </Header>
            )
        }
    }

    function getInput() {
        if (uiStore.subSelected !== 'class' && uiStore.selected !== 'admin') return true
        else if (uiStore.innerSelected === 'announcement') {
            return uiStore.selectedRole === 'teacher' || uiStore.selectedRole === 'admin'
        } else if (uiStore.innerSelected === 'assignment') {
            return uiStore.selectedRole !== 'guardian'
        } else {
            return uiStore.selectedRole !== 'guardian'
        }
    }

    return (
        <Flex flex={1} direction="column" bg="secondary.100" borderLeftColor="border.50" borderLeftWidth="1px">
            {header()}
            <Flex direction="column" flex={1} overflowY="auto" css={uiStore.scrollCSS} mr={1}>
                <MessageBody />
            </Flex>
            {getInput() && <MessageInput />}
            <InviteModal />
        </Flex>
    )
})

export default MessagePanel
