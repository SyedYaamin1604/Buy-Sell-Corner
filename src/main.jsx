import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Layout'
import Home from './Pages/Home/Home'
import Product from './Pages/Product/Product'
import NotFound from './Pages/Not Found/NotFound'
import Login from './Pages/Login/Login'
import Signup from './Pages/Signup/Signup'
import Cart from './Pages/Cart/Cart'
import ProtectedRoutes from './Components/ProtectedRoute'
import Profile from './Pages/Profile/Profile'
import { Provider } from 'react-redux'
import Store from './Config/Redux/Store/Store'


const router = createBrowserRouter([

  {
    path: '',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: 'profile',
        element: <ProtectedRoutes component={<Profile />} />
      },
      {
        path: 'product',
        element: <ProtectedRoutes component={<Product />} />
      },
      {
        path: 'product/:productId',
        element: <ProtectedRoutes component={<Product />} />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'signup',
        element: <Signup />
      },
      {
        path: 'cart',
        element: <ProtectedRoutes component={<Cart />} />
      },
      {
        path: '*',
        element: <NotFound />
      },
    ]
  }])

createRoot(document.getElementById('root')).render(
  <Provider store={Store}>
    <RouterProvider router={router}></RouterProvider>
  </Provider>
)
