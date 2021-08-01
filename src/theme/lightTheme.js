import { extendTheme } from '@chakra-ui/react'
import { createBreakpoints } from '@chakra-ui/theme-tools'

const breakpoints = createBreakpoints({
    sm: '32em',
    md: '48em',
    lg: '62em',
    xl: '80em',
    '2xl': '96em',
})

const colors = {
    primary: {
        100: '#ff6a00',
        200: '#e85900',
    },
    blue: {
        100: '#4d84f1',
        200: '#3964b8',
    },
    green: {
        100: '#26ca4f',
    },
    red: {
        50: '#d05f5f',
        100: '#d64141',
    },
    gold: {
        100: '#eba41b',
    },
    secondary: {
        100: '#fafafa',
        150: '#f0f0f0',
        200: '#e8e8e8',
        300: '#d9d9d9',
    },
    input: {
        100: '#fafafa',
    },
    border: {
        50: '#e4e4e4',
        100: '#a1a1a1',
    },
    grey: {
        100: '#141414',
        200: '#313131',
        300: '#525252',
    },
}

const sizes = {}

export const lightTheme = extendTheme({
    colors,
    sizes,
    components: { Button: { baseStyle: { _focus: { boxShadow: 'none' } } } },
    shadows: { outline: '0 !important' },
    config: {
        useSystemColorMode: false,
        initialColorMode: 'light',
    },
    breakpoints,
    fonts: {
        heading: 'Raleway',
        body: 'Raleway',
    },
})
