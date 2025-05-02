import { React, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AiFillEdit, AiOutlineUser, AiOutlineMail, AiOutlineLock, AiOutlineHome, AiOutlineCamera } from "react-icons/ai";
import { BsFillPlusSquareFill, BsPersonBadge } from 'react-icons/bs'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { firebaseApp } from '../firebase.js'
import { loddingStart, signoutFailed, signoutSuccess, userDeleteFail, userDeleteSuccess, userUpdateFailed, userUpdateSuccess } from '../redux/user/userSlice.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard.jsx';
import Loading from '../components/Loading.jsx';
import { clearSavedListing } from '../redux/saveListing/saveListingSlice.js';
import Footer from '../components/Footer.jsx';

const Profile = () => {
  const { currentUser } = useSelector(state => state.user)
  const [file, setFile] = useState(undefined);
  const [uploadingPerc, setUploadingPerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [userPosts, setUserPost] = useState({
    isPostExist: false,
    posts: []
  })

  const [userPostLoading, setUserPostLoading] = useState(false)

  const fileRef = useRef(null);
  const { loading } = useSelector((state => state.user))
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("File size should be less than 5MB");
        return;
      }
      if (!selectedFile.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      setFile(selectedFile);
      setFileUploadError(false);
      setUploadingPerc(0);
    }
  };

  const handleFileUpload = (file) => {
    if (file) {
      const fireBaseStorage = getStorage(firebaseApp);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(fireBaseStorage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on("state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadingPerc(Math.round(progress));
        },
        (error) => {
          setFileUploadError(true);
          toast.error("Failed to upload image. Please try again.");
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(downloadUrl => {
            setFormData({ ...formData, avatar: downloadUrl });
            toast.success("Profile image updated successfully!");
          });
        }
      );
    }
  }

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Show password field if username or email is being changed
    if ((name === 'username' && value !== currentUser.username) || 
        (name === 'email' && value !== currentUser.email)) {
      setShowPasswordField(true);
    } else if (name === 'username' && value === currentUser.username && 
               formData.email === currentUser.email) {
      setShowPasswordField(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if password is required but not provided
    if (showPasswordField && !formData.password) {
      toast.error("Please enter your password to confirm changes", {
        autoClose: 2000,
      });
      return;
    }

    try {
      dispatch(loddingStart())
      const res = await fetch(`api/users/update/${currentUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const userData = await res.json();

      if (userData.success === false) {
        dispatch(userUpdateFailed(userData.message))
        toast.error(userData.message, {
          autoClose: 5000,
        })
      }
      else {
        dispatch(userUpdateSuccess(userData))
        toast.success('Profile updated successfully', {
          autoClose: 2000,
        })
        setShowPasswordField(false);
        setFormData({});
      }
    } catch (error) {
      dispatch(userUpdateFailed(error.message))
      toast.error("Email already exists", {
        autoClose: 2000,
      })
    }
  }

  const handleDelete = async () => {
    try {
      dispatch(loddingStart())
      const res = await fetch(`api/users/delete/${currentUser._id}`, {
        method: 'DELETE'
      })
      const resData = await res.json();
      if (resData.success === false) {
        dispatch(userDeleteFail(resData.message))
        toast.error(resData.message, {
          autoClose: 2000,
        })
      }
      else {
        dispatch(userDeleteSuccess())
      }
    } catch (error) {
      dispatch(userDeleteFail(error.message))
      toast.error(error.message, {
        autoClose: 2000,
      })
    }
  }

  const handleLogOut = async () => {
    try {
      const res = await fetch('api/auth/signout');
      const data = await res.json();
      if (!res.ok) {
        dispatch(signoutFailed(data.message))
        toast.error(data.message, {
          autoClose: 2000,
        })
      }
      else {
        dispatch(signoutSuccess())
        toast.success(data, {
          autoClose: 2000,
        })
        dispatch(clearSavedListing())
      }
    } catch (error) {
      dispatch(signoutFailed(error.message))
      toast.error(error.message, {
        autoClose: 2000,
      })
    }
  }

  useEffect(() => {
    const loadPost = async () => {
      try {
        setUserPostLoading(true)
        const res = await fetch(`api/users/posts/${currentUser._id}`)
        const data = await res.json();
        if (data.success === false) {
          toast.error(data.message, {
            autoClose: 2000,
          });
          setUserPostLoading(false)
          dispatch(signoutSuccess())
        }
        else {
          setUserPost({
            ...userPosts,
            isPostExist: true,
            posts: data,
          });
          setUserPostLoading(false)
        };
      } catch (error) {
        toast.error("failed", {
          autoClose: 2000,
        });
        setUserPostLoading(false)
      }
    }
    loadPost()
  }, [])

  const handlePostDelete = async (postId) => {
    try {
      const res = await fetch(`/api/posts/delete/${postId}`, {
        method: 'DELETE',
      })
      const data = await res.json();

      if (data.success === false) {
        toast.error(data.message, {
          autoClose: 2000,
        })
      }
      else {
        const restPost = userPosts.posts.filter(post => post._id !== postId)
        setUserPost({
          ...userPosts,
          posts: restPost
        })

        toast.success(data, {
          autoClose: 2000,
        })

      }
    } catch (error) {
      toast.error(error.message, {
        autoClose: 2000,
      })
    }
  }

  return (
    <>
      <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Profile Info Section - Left Side */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white rounded-3xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <div className="image_container w-44 h-44 rounded-full overflow-hidden border-4 border-brand-blue relative transform transition-transform duration-300 group-hover:scale-105">
                      <input 
                        onChange={handleFileChange}
                        hidden 
                        accept='image/*'
                        type="file" 
                        name="profile"
                        id="profile_image"
                        ref={fileRef}
                      />
                      <img 
                        src={formData.avatar || currentUser.avatar} 
                        onClick={() => fileRef.current?.click()} 
                        className="w-full h-full object-cover cursor-pointer" 
                        alt="profile" 
                      />
                      <div 
                        className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                        onClick={() => fileRef.current?.click()}
                      >
                        <div className="flex flex-col items-center">
                          <AiOutlineCamera className="text-white text-3xl mb-1" />
                          <span className="text-white text-sm">Change Photo</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {fileUploadError ? (
                    <p className="text-red-600 text-sm mt-3 flex items-center">
                      <span className="mr-1">⚠️</span> File upload failed
                    </p>
                  ) : uploadingPerc > 0 && uploadingPerc < 100 ? (
                    <div className="mt-3 w-full max-w-xs">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-brand-blue transition-all duration-300" 
                          style={{ width: `${uploadingPerc}%` }}
                        />
                      </div>
                      <p className="text-gray-600 text-sm mt-2 text-center">Uploading... {uploadingPerc}%</p>
                    </div>
                  ) : uploadingPerc === 100 && (
                    <p className="text-green-600 text-sm mt-3 flex items-center">
                      <span className="mr-1">✓</span> Upload successful!
                    </p>
                  )}

                  <h2 className="text-2xl font-bold mt-6 text-gray-800">{currentUser.username}</h2>
                  <p className="text-gray-600 text-sm mt-1">{currentUser.email}</p>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    {currentUser.role === "seller" ? (
                      <>
                        <AiOutlineHome className="mr-1" />
                        Property Seller
                      </>
                    ) : (
                      <>
                        <BsPersonBadge className="mr-1" />
                        Property Buyer
                      </>
                    )}
                  </div>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <AiOutlineUser className="h-5 w-5 text-gray-400 group-focus-within:text-brand-blue transition-colors duration-300" />
                      </div>
                      <input
                        defaultValue={currentUser.username}
                        name='username'
                        type="text"
                        placeholder="Username"
                        className="pl-12 pr-4 py-3 block w-full rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue shadow-sm transition-all duration-300 placeholder-gray-400 text-gray-700"
                        onChange={handleChange}
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <AiFillEdit className="h-4 w-4 text-gray-400 group-focus-within:text-brand-blue transition-colors duration-300" />
                      </div>
                    </div>

                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <AiOutlineMail className="h-5 w-5 text-gray-400 group-focus-within:text-brand-blue transition-colors duration-300" />
                      </div>
                      <input
                        defaultValue={currentUser.email}
                        name='email'
                        type="email"
                        placeholder="Email"
                        className="pl-12 pr-4 py-3 block w-full rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue shadow-sm transition-all duration-300 placeholder-gray-400 text-gray-700"
                        onChange={handleChange}
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <AiFillEdit className="h-4 w-4 text-gray-400 group-focus-within:text-brand-blue transition-colors duration-300" />
                      </div>
                    </div>

                    {/* Add password field when username or email is being changed */}
                    {showPasswordField && (
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <AiOutlineLock className="h-5 w-5 text-gray-400 group-focus-within:text-brand-blue transition-colors duration-300" />
                        </div>
                        <input
                          type="password"
                          name='password'
                          placeholder="Enter your password to confirm changes"
                          className="pl-12 pr-4 py-3 block w-full rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue shadow-sm transition-all duration-300 placeholder-gray-400 text-gray-700"
                          onChange={handleChange}
                          required
                        />
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                          <AiFillEdit className="h-4 w-4 text-gray-400 group-focus-within:text-brand-blue transition-colors duration-300" />
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    disabled={loading}
                    type='submit'
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Saving...
                      </div>
                    ) : 'Save Changes'}
                  </button>
                </form>

                <div className="mt-8 space-y-4">
                  <button
                    onClick={handleLogOut}
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <span className="mr-2">🚪</span> Log Out
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-red-800 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <span className="mr-2">🗑️</span> Delete Account
                  </button>
                </div>
              </div>
            </div>

            {/* My All Posts Section - Right Side */}
            {currentUser?.role === "seller" && (
              <div className="w-full lg:w-2/3">
                <div className="bg-white rounded-3xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">My All Posts</h2>
                    <button
                      onClick={() => navigate('/create_post')}
                      className="flex items-center gap-2 bg-brand-blue text-white px-4 py-2 rounded-lg hover:bg-brand-blue/90 transition-colors"
                    >
                      <BsFillPlusSquareFill className="text-xl" />
                      <span>Create New Post</span>
                    </button>
                  </div>

                  {userPostLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Loading />
                      <p className="mt-4 text-brand-blue text-lg font-medium">
                        Loading your posts...
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {userPosts.isPostExist ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {userPosts.posts.map(post => (
                            <PostCard key={post._id} postInfo={{ post, handlePostDelete }} />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01]">
                            <button
                              onClick={() => navigate('/create_post')}
                              className="w-full flex flex-col items-center justify-center py-8 px-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-brand-blue transition-colors duration-300"
                            >
                              <BsFillPlusSquareFill className="text-5xl text-brand-blue mb-4" />
                              <span className="text-xl font-semibold text-gray-700">Create Your First Post</span>
                              <p className="text-gray-500 text-sm mt-2">Start by adding a new property listing</p>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <ToastContainer />
      </section>
      <Footer />
    </>
  );
};

export default Profile;

