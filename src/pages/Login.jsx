import { Divider, Flex, Image, Text, useToast } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { GoogleLogin } from 'react-google-login'
import googleBtn from '../assets/images/googleBtn.png'
// import bg from '../assets/images/login-bg.png'
import logo from '../assets/images/logo.svg'
import { DICT } from '../store/classes/localize'
import { useStores } from '../store/rootStore'
const Login = observer((props) => {
    const toast = useToast()
    const { login } = useStores()
    const rootStore = useStores()
    const googleError = async (err) => {
        alert('Cookies are not enabled, google sign in failed. You might be browsing in a private session.')
        props.history.push('/login')
        // console.log(err)
    }

    const responseGoogle = async ({ accessToken }) => {
        await login(accessToken)
        if (!props.location.state) props.history.push('/')
        else {
            props.history.push(props.location.state.from)
        }
    }

    return (
        <Flex w="100vw" h="100vh" bg="secondary.200">
            {/* <Image src={bg} w={[0, null, null, 400, 700]} objectFit="cover" /> */}
            <Flex flex={1} align="center" justify="center" direction="column">
                <Image src={logo} objectFit="contain" boxSize={36} mb={4} />
                <Text color="grey.300">Flathat High School</Text>
                <Text color="grey.100" mt={12} fontWeight="semibold" fontSize="4xl">
                    {rootStore.t(DICT.signin)}
                </Text>

                <GoogleLogin
                    clientId="83440482211-1u7ofcmmj40ij1krbbd70aigbgnqa8kg.apps.googleusercontent.com"
                    buttonText="Login"
                    onSuccess={responseGoogle}
                    onFailure={googleError}
                    cookiePolicy={'single_host_origin'}
                    render={(renderProps) => {
                        return (
                            <Image
                                src={googleBtn}
                                onClick={renderProps.onClick}
                                objectFit="contain"
                                mt={4}
                                cursor="pointer"
                                _hover={{ opacity: 0.8 }}
                            />
                        )
                    }}
                />

                <Divider bg="grey.300" w={64} mt={16} mb={4} />
                <Flex>
                    <Text
                        mx={2}
                        fontWeight={rootStore.language === 'en' ? 'semibold' : 'normal'}
                        color={rootStore.language === 'en' ? 'grey.100' : 'grey.300'}
                        cursor="pointer"
                        onClick={() => {
                            rootStore.language = 'en'
                            localStorage.setItem('lng', 'en')
                        }}
                    >
                        English
                    </Text>
                    <Text
                        mx={2}
                        fontWeight={rootStore.language === 'es' ? 'semibold' : 'normal'}
                        color={rootStore.language === 'es' ? 'grey.100' : 'grey.300'}
                        cursor="pointer"
                        onClick={() => {
                            rootStore.language = 'es'
                            localStorage.setItem('lng', 'es')
                        }}
                    >
                        Español
                    </Text>
                </Flex>
            </Flex>
        </Flex>
    )
})

export default Login
