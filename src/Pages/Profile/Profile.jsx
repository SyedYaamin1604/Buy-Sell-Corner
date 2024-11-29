import React, { useEffect, useState } from 'react'
import { useRef } from 'react';
import { TiPencil } from "react-icons/ti";
import { auth, getData, updateDocument } from '../../Config/Firebase/firebaseMethod';
import { onAuthStateChanged } from 'firebase/auth';
import { doc } from 'firebase/firestore';


const Profile = () => {
  const [availability, setAvailability] = useState(false);
  const [profile, setProfile] = useState([]);
  const [id, setId] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        try {
          const userProfile = await getData('users', uid);
          setProfile(userProfile);
          if (userProfile.length > 0) {
            setId(userProfile[0].documentId);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        console.log("User is Signed Out!");
      }
    });
  }, []);


  useEffect(() => {
    console.log("Profile state updated:", profile);
  }, [profile]);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const mobileRef = useRef(null);
  const countryRef = useRef(null);

  const checkAvailability = async () => {
    setAvailability(true);
  }

  const updateUserFromFirebase = async () => {
    setAvailability(false);
    const updatedValue = {
      username: nameRef.current?.value || profile[0]?.username || "Default Name",
      email: emailRef.current?.value || profile[0]?.email || "yourname@email.com",
      mobile: mobileRef.current?.value || profile[0]?.mobile || "Add Number",
      country: countryRef.current?.value || profile[0]?.country || "PAK",
    };

    console.log("Updated Values:", updatedValue);
    console.log("Document ID:", id);

    try {
      const result = await updateDocument(updatedValue, id, "users");
      console.log("Update Result:", result);
    } catch (error) {
      console.error("Error Updating User:", error.message);
    }
  };



  return (
    <>
      <div className='flex flex-col gap-5 justify-center items-center min-h-[89.7vh] w-full'>
        <h1 className='text-center text-5xl font-bold'>Profile</h1>
        <div className=' flex flex-col justify-start items-center rounded-2xl px-5 bg-white w-[500px] min-h-[400px] shadow-md shadow-purple-600'>
          <div className='flex justify-start items-center w-full border-b-2 border-b-gray-300  p-5 mt-5 gap-5'>
            {/* User Profile Image Start */}
            {availability ? <div className='w-[80px] h-[80px] relative group'>
              <label htmlFor="newImage" className='flex justify-center items-center w-full h-full rounded-full bg-gray-300 hover:bg-gray-400 transition duration-500 shadow-md shadow-purple-600'>
                <span className='text-purple-600 font-bold text-sm'>Upload</span>
              </label>
              <input type="file" id='newImage' className='hidden' onChange={(event) => console.log(event.target.files[0])} />
            </div> : <div className='w-[80px] h-[80px] relative group'>
              <img className='shadow-md shadow-purple-600 w-full h-full rounded-full object-cover' src="https://placehold.co/80x80.png" alt="Profile" />
              <div onClick={checkAvailability} className="absolute inset-0 bg-gray-400 bg-opacity-50 opacity-0 group-hover:opacity-100 transition duration-300 flex justify-center items-center rounded-full cursor-pointer">
                <span className='text-xl text-center text-purple-600'><TiPencil /></span>
              </div>
            </div>
            }
            {/* User Profile Image End */}
            {profile[0] ? (
              <div className='flex flex-col justify-center'>
                <p className='text-md font-medium text-black'>{profile[0].username}</p>
                <p className='text-md font-medium text-gray-400'>{profile[0].email}</p>
              </div>
            ) : <h1>No Data Found</h1>}
          </div>
          {/* User Profile Information */}
          <div className='flex flex-col justify-start items-center px-7 w-full'>
            {/* User Profile Name */}
            <div className=' w-full flex justify-between items-center border-b-2 border-b-gray-100 py-4'>
              <p className='text-black font-medium text-md'>Name</p>
              {availability ? <input className='py-1.5 outline-none border-b-2 border-b-gray-400 placeholder:text-gray-400' type="text" placeholder='Update UserName' ref={nameRef} /> : <p className='text-gray-500 text-base'>{profile[0] ? profile[0].username : 'Your Name'}</p>}
            </div>
            {/* User Profile Email*/}
            <div className='w-full flex justify-between items-center border-b-2 border-b-gray-100 py-4'>
              <p className='text-black font-medium text-md'>Email Account</p>
              {availability ? <input className='py-1.5 outline-none border-b-2 border-b-gray-400 placeholder:text-gray-400' type="text" placeholder='Update Email' ref={emailRef} /> : <p className='text-gray-500 text-base'>{profile[0] ? profile[0].email : 'yourname@email.com'}</p>}
            </div>
            {/* User Profile Mobile Number */}
            <div className='w-full flex justify-between items-center border-b-2 border-b-gray-100 py-4'>
              <p className='text-black font-medium text-md'>Mobile Number</p>
              {availability ? <input className='py-1.5 outline-none border-b-2 border-b-gray-400 placeholder:text-gray-400' type="text" placeholder='Update Mobile Number' ref={mobileRef} /> : <p className='text-gray-500 text-base'>{profile[0] ? profile[0].mobile : 'Add Number'}</p>}
            </div>
            {/* User Profile Country */}
            <div className='w-full flex justify-between items-center border-b-2 border-b-gray-100 py-4'>
              <p className='text-black font-medium text-md'>Location</p>
              {availability ? <input className='py-1.5 outline-none border-b-2 border-b-gray-400 placeholder:text-gray-400' type="text" placeholder='Update Country' ref={countryRef} /> : <p className='text-gray-500 text-base'>{profile[0] ? profile[0].country : 'Add Country'}</p>}
            </div>
            <button onClick={updateUserFromFirebase} className={`${availability ? 'btn btn-ghost my-3 bg-purple-600 text-white hover:bg-purple-500 text-md block' : 'hidden'}`}>Save Changes</button>
          </div>
        </div>
      </div >
    </>
  )
}

export default Profile