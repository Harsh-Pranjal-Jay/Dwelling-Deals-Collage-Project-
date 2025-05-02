import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { loddingStart, signinSuccess, signinFailed } from '../redux/user/userSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';

const SingIn = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.user)
    
    const [showPassword, setShowPassword] = useState(false);

    //======handling form submting function =====//
    const onSubmit = async (formData) => {
        dispatch(loddingStart())
        try {
            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const userData = await res.json();

            //===checking request success or not ===//
            if (!res.ok) {
                dispatch(signinFailed(userData.message))
                
                //===showing error in toastify====//
                toast.error(userData.message, {
                    autoClose: 2000,
                    position: toast.POSITION.TOP_CENTER,
                })
            }
            else {

                dispatch(signinSuccess(userData))
                toast.success('Login successful!', {
                    autoClose: 2000,
                    position: toast.POSITION.TOP_CENTER,
                });

                if (
                    formData.email == "dwellingdeals777@gmail.com" &&
                    formData.password == "admin1234") 
                {
                    navigate("/admin");
                    console.log("Admin is logged");
                } 
                else {
                    navigate('/');
                }
            }
        }
        catch (error) {
            dispatch(signinFailed(error.message))
            toast.error('Please enter valid credentials.', {
                autoClose: 2000,
                position: toast.POSITION.TOP_CENTER,
            })
        }
    };

    return (
        <>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
            >
                <div className="relative">
                    <input 
                        {...register("email", { required: true })} 
                        type="email" 
                        placeholder="Email" 
                        className="form_input bg-transparent pl-10" 
                    />
                </div>
                {errors.email && <span className='text-red-700 font-semibold text-sm'>This field is required</span>}

                <div className="relative">
                    <input 
                        {...register("userPassword", { required: true })} 
                        type={showPassword ? 'text' : 'password'} 
                        placeholder="Password" 
                        className="form_input bg-white pl-10" 
                    />
                </div>
                {errors.userPassword && <span className='text-red-700 font-semibold text-sm'>This field is required</span>}

                <button
                    type='submit'
                    disabled={loading}
                    className="btn bg-brand-blue text-white rounded-md w-full py-2 hover:bg-brand-blue/[.90]"
                >
                    {loading ? 'Loading...' : 'Login'}
                </button>
            </form>
            <ToastContainer limit={1} />
        </>
    )
}

export default SingIn;
