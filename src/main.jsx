import React from 'react'
import ReactDOM from 'react-dom/client'
<<<<<<< HEAD
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { system } from './theme'
=======
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { system } from './theme'
import { store } from './app/store'
>>>>>>> 1f7908aaed02400d7441d351ceff84dab95da44b
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
<<<<<<< HEAD
    <ChakraProvider value={system}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChakraProvider>
=======
    <Provider store={store}>
      <ChakraProvider value={system}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ChakraProvider>
    </Provider>
>>>>>>> 1f7908aaed02400d7441d351ceff84dab95da44b
  </React.StrictMode>
)
