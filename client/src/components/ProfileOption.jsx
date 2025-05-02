import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice';
import { FaUserCircle, FaSignOutAlt, FaBookmark } from 'react-icons/fa';
import { clearSavedListing } from '../redux/saveListing/saveListingSlice';

const ProfileOption = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSignOut = async () => {
        try {
            const res = await fetch('api/auth/signout');
            const data = await res.json();
            if (data.success === false) {
                console.log(data.message);
                return;
            }
            dispatch(signoutSuccess());
            dispatch(clearSavedListing());
            navigate('/login');
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 ${user.username === "Admin" ? "text-white" : "text-brand-blue hover:text-gray-700 transition duration-300"}`}
            >
                <FaUserCircle className={`text-2xl ${user.username === "Admin" ? "text-white" : ""}`} />
                <span className={`hidden sm:inline text-sm font-medium ${user.username === "Admin" ? "text-white" : ""}`}>
                    {user?.username || 'Profile'}
                </span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => setIsOpen(false)}
                    >
                        <FaUserCircle className="text-gray-500" />
                        Profile
                    </Link>
                    <Link
                        to="/saved_listing"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => setIsOpen(false)}
                    >
                        <FaBookmark className="text-amber-500" />
                        Saved Listings
                    </Link>
                    <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                        <FaSignOutAlt className="text-red-500" />
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileOption;
