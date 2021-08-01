import { ChakraProvider, Flex, Image, Spinner, Text, useToast } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import logo from './assets/images/logo.svg'
import AdminUserSearch from './components/admin/AdminUserSearch'
import ClassPanel from './components/class-panel/ClassPanel.jsx'
import Feed from './components/feed/Feed'
import MessagePanel from './components/message/MessagePanel'
import Sidebar from './components/sidebar/Sidebar'
import Home from './pages/Home'
import Login from './pages/Login'
import { useStores } from './store/rootStore'
import { darkTheme } from './theme/darkTheme'
import { lightTheme } from './theme/lightTheme'
const App = observer(() => {
    const rootStore = useStores()
    const [loading, setLoading] = useState(true)
    const toast = useToast()

    useEffect(() => {
        ;(async function () {
            const token = localStorage.getItem('fl_tkn')
            if (token) {
                rootStore.token = token
                await rootStore.fetch()
                setLoading(false)
            } else {
                setLoading(false)
            }
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // function showError() {
    //     console.log(rootStore.error.message)
    //     toast({
    //         status: 'error',
    //         duration: 5000,
    //         isClosable: true,
    //         render: (props) => (
    //             <Flex color="grey.100" p={3} bg="primary.100">
    //                 {console.log(props)}
    //                 {/* {rootStore.error.message} */}
    //             </Flex>
    //         ),
    //     })

    //     if (rootStore.error.errorCode === 1001 || rootStore.error.errorCode === 1002) {
    //         rootStore.token = ''
    //         localStorage.removeItem('fl_tkn')
    //     }
    //     rootStore.error = null
    // }

    const Loading = () => {
        return (
            <Flex
                h="100vh"
                w="100vw"
                bg="secondary.300"
                color="grey.100"
                justify="center"
                align="center"
                direction="column"
            >
                <Image src={logo} objectFit="contain" boxSize={48} mb={4} />
                <Text color="grey.300">Smart communications for schools</Text>
                <Spinner size="lg" mt={12} color="grey.300" />
            </Flex>
        )
    }

    function handleRerouting(location, history) {
        rootStore.uiStore.history = history
        const mainType = location.pathname.split('/')[1]
        if (!mainType) {
            history.push('/feed')
        }

        if (mainType !== 'chat' && mainType !== 'feed') {
            history.push('/feed')
            return
        }

        if (mainType === 'chat') {
            const type = location.pathname.split('/')[2]
            if (type) {
                if (type === 'class') {
                    const id = location.pathname.split('/')[3]
                    if (!rootStore.classStore.exists(id)) {
                        // history.push('/chat')
                    } else {
                        if (rootStore.uiStore.selectedId !== id) {
                            rootStore.uiStore.subSelected = 'class'
                            rootStore.uiStore.selectedId = id
                        }
                        const subtype = location.pathname.split('/')[4]
                        if (subtype) {
                            if (subtype === 'announcement') {
                                if (rootStore.uiStore.innerSelected !== 'announcement') {
                                    rootStore.uiStore.innerSelected = 'announcement'
                                    rootStore.uiStore.innerSelectedId = ''
                                }
                            } else if (subtype === 'assignment') {
                                const asgId = location.pathname.split('/')[5]
                                if (!rootStore.classStore.selectedClass.assignmentExists(asgId)) {
                                    history.push('/chat/class/' + id)
                                } else {
                                    if (rootStore.uiStore.innerSelected !== 'assignment') {
                                        rootStore.uiStore.innerSelected = 'assignment'
                                        if (rootStore.uiStore.innerSelectedId !== asgId) {
                                            rootStore.uiStore.innerSelectedId = asgId
                                        }
                                    }
                                }
                            } else {
                                history.push('/chat/class/' + id)
                            }
                        }
                    }
                } else if (type === 'group') {
                    const id = location.pathname.split('/')[3]
                    if (!rootStore.groupStore.exists(id)) {
                        // history.push('/chat')
                    } else {
                        if (rootStore.uiStore.selectedId !== id) {
                            rootStore.uiStore.subSelected = 'group'
                            rootStore.uiStore.selectedId = id
                        }
                    }
                } else if (type === 'direct') {
                } else if (type === 'search') {
                } else {
                    history.push('/chat')
                }
            }
        }
    }

    return (
        <ChakraProvider theme={rootStore.uiStore.theme === 'light' ? lightTheme : darkTheme}>
            {/* {rootStore.error && <>{showError()}</>} */}
            {loading ? (
                <Loading />
            ) : (
                <Router>
                    <Flex h="100vh" w="100vw" bg="secondary.100">
                        <Switch>
                            <Route path="/login" component={Login} />
                            <Route
                                path={`/`}
                                render={({ match, location, history }) => {
                                    history.push('/feed')
                                }}
                                exact
                            />
                            <Route
                                path="/"
                                render={({ match, location, history }) => {
                                    handleRerouting(location, history)
                                    return rootStore.isLoggedIn() ? (
                                        <>
                                            <Route path={`/`} component={Home} />
                                            <Route path={`/feed`} component={Feed} />

                                            <Route path={`/chat`} component={Sidebar} />
                                            {rootStore.uiStore.selectedRole === 'admin' && (
                                                <Route path={`/chat/search`} component={AdminUserSearch} />
                                            )}
                                            <Route
                                                path={`/chat/class`}
                                                render={({ location, history }) => {
                                                    return (
                                                        <>
                                                            <ClassPanel history={history} location={location} />
                                                            <MessagePanel history={history} location={location} />
                                                        </>
                                                    )
                                                }}
                                            />

                                            <Route
                                                path={`/chat/group`}
                                                render={({ location, history }) => {
                                                    return (
                                                        <>
                                                            <MessagePanel history={history} location={location} />
                                                        </>
                                                    )
                                                }}
                                            />

                                            <Route
                                                path={`/chat/direct`}
                                                render={({ location, history }) => {
                                                    return (
                                                        <>
                                                            <MessagePanel history={history} location={location} />
                                                        </>
                                                    )
                                                }}
                                            />
                                        </>
                                    ) : (
                                        <Redirect
                                            to={{
                                                pathname: '/login',
                                                state: { from: location.pathname },
                                            }}
                                        />
                                    )
                                }}
                            />
                        </Switch>
                    </Flex>
                </Router>
            )}
        </ChakraProvider>
    )
})

export default App
