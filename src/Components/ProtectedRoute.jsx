import React, { useEffect, useState } from 'react'
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../Config/Firebase/firebaseMethod';
import { useNavigate } from 'react-router-dom'

const ProtectedRoutes = ({ component }) => {
  const [isUser, setIsUser] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {

    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsUser(true);
      } else {
        document.getElementById('my_modal_1').showModal();
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    });
  }, [navigate]);


  return (
    <>
      {isUser ? (component) : (
        <dialog id="my_modal_1" className="modal">
          <div className="min-h-[400px] modal-box flex justify-center items-center bg-gray-300">
            <p className="text-3xl font-medium text-center py-4">You have to Login First</p>
          </div>
        </dialog>
      )}
    </>
  )
}

export default ProtectedRoutes