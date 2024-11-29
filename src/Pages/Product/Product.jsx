import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoSearchSharp } from 'react-icons/io5';
import { FaPhone } from "react-icons/fa6";
import { IoChatboxOutline } from "react-icons/io5";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addCart } from '../../Config/Redux/Reducers/CartSlice';
import Loading from '../../Components/Loading.jsx';
import { auth, getData, sendData, updateDocument } from '../../Config/Firebase/firebaseMethod.js';

const Product = () => {
  const { productId } = useParams();
  const [singleProduct, setSingleProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documentId, setDocumentUid] = useState(null);
  const dispatch = useDispatch();
  const uid = auth.currentUser.uid;


  useEffect(() => {
    const fetchProduct = async () => {
      if (productId) {
        try {
          const response = await axios.get(`https://fakestoreapi.com/products/${productId}`);
          setSingleProduct(response.data);
          // console.log(response.data);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchProduct();
  }, [productId]);

  const addToCart = async (id, price, title, image, quantity = 1) => {
    try {
      const cartItems = await getData('carts', uid);
      const existingItem = cartItems.find(item => item.id === id);
  
      if (existingItem) {
        const updatedQuantity = existingItem.quantity + quantity;
        const updatedPrice = updatedQuantity * price;
        
        const updatedCart = {
          id: id,
          price: updatedPrice,
          unitPrice: price,
          title: title,
          imageSrc: image,
          quantity: updatedQuantity,
          uid: uid,
        };
        await updateDocument(updatedCart, existingItem.documentId, 'carts');
        dispatch(addCart(updatedCart));
      } else {
        const newCart = {
          id: id,
          price: price,
          unitPrice: price,
          title: title,
          imageSrc: image,
          quantity: quantity,
          uid: uid,
        };
        const newCartData = await sendData(newCart, 'carts');
        dispatch(addCart(newCart));
      }
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };
  

  return (
    <div className='min-h-[100vh] py-10 sm:px-10 lg:px-20 px-4'>
      {/* Search Bar Start */}
      <div className='flex justify-start items-center border-2 border-purple-600 rounded-lg gap-3 px-5 py-2'>
        <span className='text-2xl font-medium'>
          <IoSearchSharp />
        </span>
        <input type="search" placeholder='Search' className='w-full py-1 px-3 text-xl bg-transparent outline-none' />
      </div>
      {/* Search Bar End */}

      {singleProduct ? (
        <>
          <h1 className='lg:text-4xl lg:text-left text-2xl sm:text-3xl text-center font-bold my-6 lg:my-16'>{singleProduct.title}</h1>
          <div className='flex flex-col md:flex-row justify-center items-center md:min-h-[450px] lg:min-h-[500px] rounded-2xl border-2 border-gray-500'>
            <div className='flex justify-center items-center border-r-2 md:border-gray-500 md:rounded-tl-2xl md:rounded-bl-2xl md:max-w-[40%] w-[100%] sm:w-[100%] sm:h-[350px] md:min-h-[450px] overflow-hidden'>
              <img className='md:h-full h-[350px] w-full object-fill rounded-tl-2xl rounded-tr-2xl md:rounded-tl-2xl md:rounded-bl-3xl' src={singleProduct.image} alt={singleProduct.title} />
            </div>
            <div className='border-2 md:max-w-[60%] min-h-[400px] px-4'>
              <h1 className='text-xl sm:text-2xl text-center md:text-left my-2 lg:text-3xl font-bold'>${singleProduct.price}</h1>
              <h2 className='text-xl sm-text-2xl text-center md:text-left lg:text-3xl font-bold'>{singleProduct.title}</h2>
              <p className='text-md md:text-left lg:text-lg my-2'>{singleProduct.description}</p>
              <div className='w-full rounded-xl bg-transparent border-2 border-black shadow-lg shadow-black min-h-[150px] flex flex-col md:flex-row md:gap-10 justify-start p-5 items-center'>
                <div className='min-w-[80px] min-h-[80px] lg:min-h-[100px] lg:min-w-[100px] rounded-full border-2 border-black'></div>
                <div>
                  <h1 className='text-black font-semibold text-center md:text-left text-lg lg:text-xl'>John Doe</h1>
                  <p className='text-black font-semibold text-center md:text-left text-md lg:text-lg'>Member Since June XXXX</p>
                  <div className='flex justify-center items-center gap-2 mt-2'>
                    <button className='flex justify-center items-center gap-2 text-white btn btn-ghost text-sm lg:text-lg py-2 px-5 rounded-xl active:bg-purple-500 hover:bg-purple-500 bg-purple-600'>
                      <span><FaPhone /></span> Call Now
                    </button>
                    <button className='flex justify-center items-center gap-2 text-white btn btn-ghost text-sm lg:text-lg py-2 px-5 rounded-xl bg-purple-600 active:bg-purple-500 hover:bg-purple-500'>
                      <span><IoChatboxOutline /></span> Chat
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label onClick={() => addToCart(singleProduct.id, singleProduct.price, singleProduct.title, singleProduct.image)} className="flex justify-center items-center py-3 rounded-xl mt-5 mb-2 text-white btn btn-ghost text-sm px-10 bg-purple-600 active:bg-purple-500 hover:bg-purple-500">ADD TO CART</label>
              </div>
            </div>
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50" role="dialog">
              <div className="modal-box bg-gray-300 border-4 border-black flex flex-col justify-center items-center min-w-[400px] min-h-[400px]">
                <h1 className="text-center font-bold text-5xl">Item Added to Cart Successfully</h1>
                <span className="mt-2 text-7xl text-black">
                  <IoIosCheckmarkCircleOutline />
                </span>
                <button onClick={() => setIsModalOpen(false)} className="btn bg-purple-600 hover:bg-purple-500 text-white mt-4">
                  Close
                </button>
              </div>
            </div>
          )}
          {/* Modal End */}
        </>
      ) : (
        <div className='flex w-full min-h-[100vh] justify-center items-center'>
          <span className='text-6xl font-black'>
            <Loading />
          </span>
        </div>
      )}
    </div>
  );
};

export default Product;
