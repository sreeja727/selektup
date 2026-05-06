import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const config = defineConfig({
  globalCss: {
    'body': {
      fontFamily: "'Inter', sans-serif",
      color: '#1a1a2e',
      bg: '#ffffff',
    },
  },
  theme: {
    tokens: {
      colors: {
        // Pink / Magenta — primary accent (from logo)
        brand: {
          50:  { value: '#fce4ec' },
          100: { value: '#f8bbd0' },
          200: { value: '#f48fb1' },
          300: { value: '#f06292' },
          400: { value: '#ec407a' },
          500: { value: '#E91E8C' },   // logo pink
          600: { value: '#C2185B' },
          700: { value: '#880e4f' },
          800: { value: '#560027' },
          900: { value: '#2d0011' },
        },
        // Blue — secondary accent (from logo)
        sky: {
          50:  { value: '#e1f5fe' },
          100: { value: '#b3e5fc' },
          200: { value: '#81d4fa' },
          300: { value: '#4fc3f7' },
          400: { value: '#29b6f6' },
          500: { value: '#039BE5' },   // logo blue
          600: { value: '#0277BD' },
          700: { value: '#01579B' },
          800: { value: '#013a6b' },
          900: { value: '#001c3a' },
        },
        // Dark backgrounds
        dark: {
          500: { value: '#0C1222' },
          600: { value: '#08101a' },
          700: { value: '#050a10' },
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)
