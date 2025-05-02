import { useState } from 'react'
import { BsJustifyRight, BsMessenger, BsPlusCircle } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import MobileMenu from './mobileMenu'
import {  useSelector } from 'react-redux'
import { MdOutlineClose } from "react-icons/md";
import { FaHome, FaBuilding, FaInfoCircle, FaUsers, FaList } from "react-icons/fa";
import ProfileOption from './ProfileOption'
import logo1 from '../assets/icon.png'

const Header = () => {
    const [isActiveMoblie, setisActiveMoblie] = useState(false)
    const { currentUser } = useSelector((state) => state.user)
    const { notificationsDB } = useSelector(state => state.notification)
    // const navigate = useNavigate()
    // const dispatch = useDispatch()
    // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <>
            <div className={`navbar pl-0 pr-0 pt-1.5 pb-1.5 ${currentUser?.email === "dwellingdeals777@gmail.com" ? "bg-slate-800" : "bg-white"} shadow-sm border-b`}>
                <div className="px-3 max-w-screen-2xl w-full !mx-auto grid grid-cols-12 gap-1">
                    {/* Logo container  */}
                    <div className="col-span-3 sm:col-span-2">
                        <h1 className={`font-blach sm:text-xl text-sm text-left hover:bg-transparent uppercase tracking-tighter w-full font-heading font-bold flex items-center justify-start ${currentUser?.email === "dwellingdeals777@gmail.com" ? "text-white" : "text-brand-blue"}`}>
                            <Link to={'/home'} className='flex items-center justify-start hover:opacity-80 transition-opacity duration-200'>
                            <img src={logo1} className='w-[40px] h-[40px] mr-3'></img>
                                <span className='hidden sm:block'>Dwelling Deals</span>
                            </Link>
                        </h1>
                    </div>

                    {currentUser && currentUser.email === 'dwellingdeals777@gmail.com' ? (
                        <>
                            {/* Admin Navigation */}
                            <div className="col-span-6 sm:col-span-8 flex items-center justify-center">
                                <ul className="hidden sm:flex items-center justify-center space-x-10 font-medium">
                                    <li>
                                        <Link to='/admin' className={`flex items-center gap-2 transition-colors duration-300 text-lg py-2.5 px-4 rounded-lg hover:bg-slate-700 ${currentUser?.email === "dwellingdeals777@gmail.com" ? "text-white" : "text-gray-700"}`}>
                                            <FaHome className="text-xl" />
                                            <span>Dashboard</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to='/users' className={`flex items-center gap-2 transition-colors duration-300 text-lg py-2.5 px-4 rounded-lg hover:bg-slate-700 ${currentUser?.email === "dwellingdeals777@gmail.com" ? "text-white" : "text-gray-700"}`}>
                                            <FaUsers className="text-xl" />
                                            <span>Users</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to='/posts' className={`flex items-center gap-2 transition-colors duration-300 text-lg py-2.5 px-4 rounded-lg hover:bg-slate-700 ${currentUser?.email === "dwellingdeals777@gmail.com" ? "text-white" : "text-gray-700"}`}>
                                            <FaList className="text-xl" />
                                            <span>Listings</span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Admin Profile Section */}
                            <div className="col-span-3 sm:col-span-2 flex items-center justify-end">
                                <div className="flex items-center space-x-4">
                                    <ProfileOption user={currentUser} />
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Regular User Navigation */}
                            <div className="col-span-6 sm:col-span-8 flex items-center justify-center">
                                <ul className="hidden sm:flex items-center justify-center space-x-10 font-medium text-gray-700">
                                    <li>
                                        <Link to='/home' className="flex items-center gap-2 hover:text-brand-blue transition-colors duration-300 text-lg py-2.5 px-4 rounded-lg hover:bg-gray-50">
                                            <FaHome className="text-xl" />
                                            <span>Home</span>
                                        </Link>
                                    </li>

                                    <li>
                                        <Link to='/about' className="flex items-center gap-2 hover:text-brand-blue transition-colors duration-300 text-lg py-2.5 px-4 rounded-lg hover:bg-gray-50">
                                            <FaInfoCircle className="text-xl" />
                                            <span>About Us</span>
                                        </Link>
                                    </li>

                                    <li>
                                        <Link to='/search' className="flex items-center gap-2 hover:text-brand-blue transition-colors duration-300 text-lg py-2.5 px-4 rounded-lg hover:bg-gray-50">
                                            <FaBuilding className="text-xl" />
                                            <span>Listings</span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Regular User Actions */}
                            <div className="col-span-3 sm:col-span-2 flex items-center justify-end">
                                <ul className="hidden sm:flex items-center justify-end space-x-4">
                                    <li>
                                        <Link to={`${currentUser ? "/message" : "/login"}`} className="p-3 rounded-lg transition-colors duration-200 relative group">
                                            <BsMessenger className='text-2xl text-gray-700 group-hover:text-brand-blue transition-colors duration-200' />
                                            {
                                                notificationsDB.length === 0
                                                ?
                                                <p className={`text-xs px-[2px] font-heading font-medium bg-lime-600 text-white absolute top-[-13px] right-[-14px] flex items-center justify-center rounded-sm`}>new</p>
                                                :
                                                <p className={`text-[11px] font-content font-medium bg-[#c00] text-white absolute top-[-10px] h-4 ${notificationsDB.length < 9 ? "w-3 right-[-8px]" : "w-4 right-[-10px]"} flex items-center justify-center rounded-sm`}>{notificationsDB.length}</p>
                                            }
                                        </Link>
                                    </li>

                                    {currentUser ? (
                                        <>
                                            {currentUser.role === 'seller' && (
                                                <li>
                                                    <Link 
                                                        to="/create_post" 
                                                        className="flex items-center gap-2 bg-brand-blue text-white px-6 py-2.5 rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-sm hover:shadow-md min-w-[160px] justify-center whitespace-nowrap font-medium"
                                                    >
                                                        <BsPlusCircle className="text-lg" />
                                                        <span>Post Property</span>
                                                    </Link>
                                                </li>
                                            )}
                                            <li>
                                                <ProfileOption user={currentUser} />
                                            </li>
                                        </>
                                    ) : (
                                        <li>
                                            <Link to='/login' className='text-white px-6 py-2.5 font-medium rounded-lg bg-brand-blue text-sm hover:bg-blue-600 transition-all duration-300 shadow-sm hover:shadow-md'>
                                                Login
                                            </Link>
                                        </li>
                                    )}
                                </ul>

                                <div className="nav_mobile flex items-center justify-center sm:hidden gap-2">
                                    <Link to={`${currentUser ? "/message" : "/login"}`} className='p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 relative group'>
                                        <span className='relative'>
                                            <BsMessenger className='text-2xl text-gray-700 group-hover:text-brand-blue transition-colors duration-200' />
                                            {
                                                notificationsDB.length === 0
                                                ?
                                                <p className={`text-xs px-[2px] font-heading font-normal bg-lime-600 text-white absolute top-[-13px] right-[-9px] flex items-center justify-center rounded-sm`}>new</p>
                                                :
                                                <p className={`text-[11px] font-content font-medium bg-[#c00] text-white absolute top-[-10px] h-4 ${notificationsDB.length < 9 ? "w-3 right-[-8px]" : "w-4 right-[-10px]"} flex items-center justify-center rounded-sm`}>{notificationsDB.length}</p>
                                            }
                                        </span>
                                    </Link>

                                    <button
                                        className="p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                        onClick={() => setisActiveMoblie(!isActiveMoblie)}
                                    >
                                        {
                                            isActiveMoblie ? <MdOutlineClose className='text-xl text-red-600' /> : <BsJustifyRight className='text-xl text-gray-700' />
                                        }
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
            {
                isActiveMoblie && <MobileMenu menuStatus={{ isActiveMoblie, setisActiveMoblie }} />
            }
        </>
    )
}

export default Header