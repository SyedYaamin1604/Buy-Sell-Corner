import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth, getData, signOutUser } from '../Config/Firebase/firebaseMethod';
import { onAuthStateChanged } from 'firebase/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const [isUser, setIsUser] = useState(false);
  const [allCartData, setAllCartData] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        setIsUser(true);
        const fetchCart = async () => {
          const cartData = await getData('carts', uid);
          setAllCartData(cartData);
        };
        fetchCart();
      } else {
        setIsUser(false);
        navigate("/login");
      }
    });
  }, [navigate, allCartData]);

  useEffect(() => {
    const calculateTotalPrice = () => {
      const total = allCartData.reduce((acc, item) => acc + item.price * item.quantity, 0);
      setTotalPrice(total);
    };
    calculateTotalPrice();
  }, [allCartData]);

  const AddtoCart = () => {
    navigate("/cart");
  }


  const logOutUserFromFirebase = async () => {
    const logout = await signOutUser();
    navigate("/login");
  }


  return (
    <div className="navbar bg-purple-600">
      <div className="flex-1">
        <button className="btn btn-ghost text-2xl text-white">
          <Link to={"/"}>Buy/Sell Corner</Link>
        </button>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <div className="indicator">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="badge badge-sm indicator-item">{isUser ? allCartData.length : 0}</span>
            </div>
          </div>

          <div className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow">
            <div className="card-body">
              <span className="text-lg font-bold">{isUser ? allCartData.length : 0} Items</span>
              {isUser && allCartData.length > 0 ? (
                <span className="text-black">SubTotal: ${totalPrice.toFixed(2)}</span>
              ) : (
                <span className="text-black">No items in Cart</span>
              )}
              <div className="card-actions">
                <button onClick={AddtoCart} className="btn btn-ghost bg-purple-600 text-white btn-block hover:bg-purple-500">
                  View cart
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
            <li><Link className="px-4 py-2 text-md hover:bg-gray-300 rounded-xl cursor-pointer" to={"/profile"}>Profile</Link></li>
            <li onClick={logOutUserFromFirebase} className={`${isUser ? "block px-4 py-2 text-md hover:bg-gray-300 rounded-xl cursor-pointer" : "hidden"}`}>
              Logout
            </li>
            <li className={`${isUser ? "hidden" : "active"}`}>
              <Link className="px-4 py-2 text-md hover:bg-gray-300 rounded-xl cursor-pointer" to={"/login"}>Login</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar