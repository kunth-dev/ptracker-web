import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { router } from './router.tsx'
import { store } from './store'
import { AlertProvider } from './contexts/AlertContext'
import './i18n'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <AlertProvider>
        <RouterProvider router={router} />
      </AlertProvider>
    </Provider>
  </React.StrictMode>
)
