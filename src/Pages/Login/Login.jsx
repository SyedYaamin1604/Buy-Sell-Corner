import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { auth, loginUser } from '../../Config/Firebase/firebaseMethod';
import Loading from '../../Components/Loading';

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [isUser, setIsUser] = useState(false);

  const loginUserWithFirebase = async (data) => {
    console.log(data);
    setLoading(true);
    try {
      const existingUser = await loginUser({
        email: data.emailVal,
        password: data.passwordVal,
      });
      console.log(existingUser);
      reset();
      navigate('/');
    }
    catch (error) {
      console.error("Error logging in:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-center items-center min-h-[90vh]'>
      <div className='border-2 border-purple-600 min-w-[280px] sm:min-w-[400px] min-h-[300px] rounded-xl py-6'>
        <h1 className='text-center text-5xl text-purple-600 font-bold mt-3'>Login</h1>
        <form onSubmit={handleSubmit(loginUserWithFirebase)} className='flex flex-col justify-center items-start text-purple-600 px-5 sm:px-8 mt-5'>
          <label className='text-md sm:text-lg font-medium px-1'>Email:</label>
          <input className='py-1 sm:py-2 rounded-xl w-full outline-none border-2 border-purple-600 mt-2 px-3' type="text" placeholder='Enter your Email' {...register("emailVal", { required: true })} />
          {errors.emailVal && <span className='text-red-600 text-lg my-1'>Email is required</span>}
          <label className='text-md sm:text-lg font-medium mt-1 px-1'>Password:</label>
          <input
            className='py-1 sm:py-2 rounded-xl w-full outline-none border-2 border-purple-600 mt-2 px-3'
            type="password"
            placeholder='Enter your Password'
            {...register("passwordVal", { required: true })}
          />
          {errors.passwordVal && <span className='text-red-600 text-lg my-1'>Password is required</span>}

          <div className='flex flex-col gap-2 mt-3 justify-center items-center w-full'>
            <button type='submit' className={`py-1 sm:py-2 px-7 font-semibold text-lg sm:text-xl rounded-xl bg-purple-600 text-white ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {loading ? <Loading /> : 'Login'}</button>
            <p className='text-blue-700'>
              <Link to={'/signup'}>Not a User? Please Register First</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
