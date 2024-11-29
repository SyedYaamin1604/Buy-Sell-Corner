import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { signUpUser } from "../../Config/Firebase/firebaseMethod";
import Loading from '../../Components/Loading';

const Signup = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const signupUserWithFirebase = async (data) => {
    setLoading(true);
    try {
      const newUser = await signUpUser({
        username: data.userNameVal,
        email: data.emailVal,
        password: data.passwordVal
      });
      console.log(newUser);
      reset();
      navigate('/login');
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-center items-center min-h-[90vh]'>
      <div className='border-2 border-purple-600 min-w-[280px] sm:min-w-[400px] min-h-[300px] rounded-xl py-6'>
        <h1 className='text-center text-5xl text-purple-600 font-bold mt-3'>Signup</h1>
        <form onSubmit={handleSubmit(signupUserWithFirebase)} className='flex flex-col justify-center text-purple-600 items-start px-5 sm:px-8 mt-5'>
          <label className='text-md sm:text-lg font-medium px-1'>Username:</label>
          <input className='py-1 sm:py-2 rounded-xl w-full outline-none border-2 border-purple-600 px-3 my-1' type="text" placeholder='Enter your Username' {...register("userNameVal", { required: true })} />
          {errors.userNameVal && <span className='text-red-600 text-lg my-1'>This field is required</span>}
          <label className='text-md sm:text-lg font-medium px-1'>Email:</label>
          <input className='py-1 sm:py-2 rounded-xl w-full outline-none border-2 border-purple-600 px-3 my-1' type="text" placeholder='Enter your Email' {...register("emailVal", { required: true })} />
          {errors.emailVal && <span className='text-red-600 text-lg my-1'>This field is required</span>}
          <label className='text-md sm:text-lg font-medium px-1'>Password:</label>
          <input className='py-1 sm:py-2 rounded-xl w-full outline-none border-2 border-purple-600 px-3 my-1' type="password" placeholder='Enter your Password' {...register("passwordVal", { required: true })} />
          {errors.passwordVal && <span className='text-red-600 text-lg my-1'>This field is required</span>}
          <div className='flex flex-col gap-2 mt-3 justify-center items-center w-full'>
            <button type='submit' className={`py-1 sm:py-2 px-7 font-semibold text-lg sm:text-xl rounded-xl bg-purple-600 text-white ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {loading ? <Loading /> : 'Signup'}</button>
            <p className='text-blue-700'>
              <Link to={'/signup'}>Not a User? Please Register First</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
