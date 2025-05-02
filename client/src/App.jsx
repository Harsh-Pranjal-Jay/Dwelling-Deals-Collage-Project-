import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Header from './components/Header'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import AdminRoute from './components/AdminRoute'
import AdminListingInfoPage from './pages/AdminListingInfoPage'
import AdminListingsPage from './pages/AdminListingsPage'
import AdminUserInfoPage from './pages/AdminUserInfoPage'
import AdminUsersPage from './pages/AdminUsersPage'
import PrivateRoute from './components/PrivateRoute'
import SellerRoute from './components/SellerRoute'
import CreatePost from './pages/CreatePost'
import UpdatePost from './pages/UpdatePost'
import ListingPage from './pages/ListingPage'
import SaveListing from './pages/SaveListing'
import ForgotPassword from './pages/ForgetPassword'
import Search from './pages/Search'
import Message from './pages/Message'
import SocketConnection from './components/SocketConnection'
import AboutUs from './components/AboutUs'
import Team from './pages/Team'
import { useSelector } from 'react-redux'

function App() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <>
      <SocketConnection />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Header />
        <Routes>
          {currentUser && currentUser.email === "dwellingdeals777@gmail.com" ? (
            <Route path='/' element={<Admin/>} />
          ) : (
            <Route path='/' element={<Home/>} />
          )}
          <Route path='/home' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/forget' element={<ForgotPassword />} />
          <Route path='/listing/:id' element={<ListingPage />} />
          <Route path='/search?' element={<Search />} />
          <Route path='/about' element={<AboutUs/>} />
          <Route path='/team' element={<Team/>} />

          {/* Protected Routes */}
          {currentUser && currentUser.email === 'dwellingdeals777@gmail.com' && 
            <>
              <Route path='/users' element={<AdminUsersPage />} />
              <Route path='/users/:id' element={<AdminUserInfoPage />} />
              <Route path='/posts' element={<AdminListingsPage />} />
              <Route path='/posts/:id' element={<AdminListingInfoPage />} />
            </>
          }
          <Route element={<PrivateRoute />}>
            <Route path='/profile' element={<Profile />} />
            <Route path='/saved_listing' element={<SaveListing />} />
            <Route path='/message' element={<Message />} />
          </Route>

          {/* Seller-only Routes */}
          <Route element={<SellerRoute />}>
            <Route path='/create_post' element={<CreatePost />} />
            <Route path='/update_post/:id' element={<UpdatePost />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path='/admin' element={<Admin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
