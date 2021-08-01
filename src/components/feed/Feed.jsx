import React, { useState, useEffect } from 'react'
import {
    Box,
    Text,
    Center,
    Flex,
    Image,
    Circle,
    Stack,
    Icon,
    Button,
    Skeleton,
    useToast,
    Avatar,
    Divider,
    Input,
} from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { useStores } from '../../store/rootStore'
import { FiSend } from 'react-icons/fi'
import { TiArrowSortedDown, TiArrowSortedUp } from 'react-icons/ti'
import { MdDelete } from 'react-icons/md'
import FeedModal from './FeedModal'
const Feed = observer(({ history }) => {
    const { t } = useStores()
    const rootStore = useStores()
    const toast = useToast()

    function trimMessage(msg, count) {
        return msg.length > count ? `${msg.substring(0, count)}...` : msg
    }

    const FlexItem = observer(({ data }) => {
        const [loading, setLoaded] = useState(false)
        const [comment, setComment] = useState('')
        return (
            <Flex
                w="650px"
                bg="secondary.200"
                rounded={5}
                overflow="hidden"
                border="1px"
                borderColor="secondary.300"
                boxShadow="base"
                mt={4}
                mb={4}
                key={data._id}
                flexShrink={0}
            >
                <Flex flex={1} direction="column">
                    <Flex align="center" m={2}>
                        <Avatar src={data.user?.profilePic} size="xs" />
                        <Text flex={1} fontSize="sm" color="grey.200" ml={2}>
                            Posted by {data.user?.name}
                        </Text>
                        <Icon as={FiSend} mr={3} color="blue.100" />
                        <Icon
                            as={MdDelete}
                            color="red.100"
                            boxSize="20px"
                            cursor="pointer"
                            onClick={() => {
                                rootStore.feedStore.remove(data._id)
                                toast({
                                    title: 'Post Removed.',
                                    description: `Post by ${data.user.name} was deleted.`,
                                    status: 'success',
                                    duration: 5000,
                                    isClosable: true,
                                })
                            }}
                        />
                    </Flex>
                    <Divider bg="border.50" />
                    <Text m={3} my={4} fontSize="lg" fontWeight="semibold" color="grey.100">
                        {data.title}
                    </Text>
                    <Text m={3} mt={0} color="grey.100">
                        {trimMessage(data.description, 400)}
                    </Text>
                    {data.image && (
                        <>
                            <Image
                                src={'https://vc-static-server.nyc3.digitaloceanspaces.com/flathat-feed/' + data._id}
                                onLoad={() => setLoaded(true)}
                            />
                            {!loading && (
                                <Stack>
                                    <Skeleton height="20px" />
                                    <Skeleton height="20px" />
                                    <Skeleton height="20px" />
                                    <Skeleton height="20px" />
                                    <Skeleton height="20px" />
                                    <Skeleton height="20px" />
                                </Stack>
                            )}
                        </>
                    )}
                    <Divider bg="border.100" />
                    <Flex m={3} direction="column">
                        <Flex align="center">
                            <Text color="blue.100" fontSize="sm" cursor="pointer" fontWeight="semibold">
                                {data.comments.length > 0 ? data.comments.length + ' comments' : 'No comments'}
                            </Text>
                        </Flex>
                        <Flex mt={2} direction="column">
                            {data.comments.slice(Math.max(data.comments.length - 2, 0)).map((comment) => {
                                return (
                                    <Flex key={comment._id} align="center" my={1} color="grey.100">
                                        <Avatar src={comment?.user?.profilePic} size="2xs" />
                                        <Text ml={2} fontSize="sm">
                                            {comment?.user?.name}
                                        </Text>
                                        <Text ml={2} fontSize="sm" color="grey.300">
                                            {trimMessage(comment?.message, 50)}
                                        </Text>
                                    </Flex>
                                )
                            })}
                        </Flex>
                    </Flex>
                    <Flex m={3} mt={0} direction="column">
                        <Input
                            value={comment}
                            placeholder="Say something..."
                            bg="secondary.100"
                            focusBorderColor="primary.100"
                            onChange={(e) => setComment(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && comment.length > 0) {
                                    setComment('')
                                    // addComment({ message: comment, feedId: data._id })
                                }
                            }}
                        ></Input>
                    </Flex>
                </Flex>

                <Flex direction="column" bg="secondary.300" align="center" justify="center" p={3} color="grey.100">
                    <Icon as={TiArrowSortedUp} />
                    <Text>495</Text>
                    <Icon as={TiArrowSortedDown} />
                </Flex>
            </Flex>
        )
    })

    return (
        <Flex flex={1} direction="column">
            <Flex p={5} bg="secondary.200" key="1">
                <Text color="grey.100" fontWeight="semibold" fontSize="xl" flex={1}>
                    Flathat High News
                </Text>
                <Button
                    size="sm"
                    bg="primary.100"
                    color="white"
                    _hover={{ color: 'primary.100', bg: 'transparent' }}
                    onClick={() => {
                        rootStore.uiStore.modal = 'feed'
                    }}
                >
                    Create Post
                </Button>
            </Flex>
            <Flex direction="column" align="center" overflowY="auto" css={rootStore.uiStore.scrollCSS} key="2">
                {rootStore.feedStore.feed.map((data) => {
                    return <FlexItem data={data} />
                })}
            </Flex>
            <FeedModal />
        </Flex>
    )
})

export default Feed
