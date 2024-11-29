import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { MdOutlineDeleteForever } from "react-icons/md";
import { IoAdd } from 'react-icons/io5';
import { FaMinus } from 'react-icons/fa6';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { auth, deleteDocument, getData, updateDocument } from '../../Config/Firebase/firebaseMethod';
import { addCart } from '../../Config/Redux/Reducers/CartSlice';


const Cart = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const uid = auth.currentUser.uid;
  const [allCartData, setAllCartData] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);


  useEffect(() => {
    const fetchCart = async () => {
      const cartData = await getData('carts', uid);
      setAllCartData(cartData);
    }
    fetchCart();
  }, [])

  useEffect(() => {
    console.log("All Cart Data:", allCartData);
    const calculateTotalPrice = async () => {
      const total = allCartData.reduce((acc, item) => acc + item.price * item.quantity, 0);
      setTotalPrice(total);
      console.log(totalPrice);
    };
    calculateTotalPrice();
  }, [allCartData, totalPrice]);

  const handleEditCart = async (id, type) => {
    const updatedCartData = allCartData.map((item) => {
      if (item.id === id) {
        const updatedQuantity = type === 'increment' ? item.quantity + 1 : item.quantity - 1;
        const newQuantity = updatedQuantity > 0 ? updatedQuantity : 1;
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setAllCartData(updatedCartData);
    const updatedItem = updatedCartData.find(item => item.id === id);
    await updateDocument(updatedItem, updatedItem.documentId, 'carts');
    dispatch(addCart(updatedItem));
  };


  const handleDeleteCart = async (documentId) => {
    const deleteCart = await deleteDocument(documentId, 'carts');
    const updatedCartData = allCartData.filter(item => item.documentId !== documentId);
    setAllCartData(updatedCartData);
    setIsModalOpen(true);
  }

  return (
    <>
      <div className='max-w-[100%] min-h-[100vh] py-5'>
        <h1 className='text-3xl font-bold text-center lg:text-5xl'>Buy/Sell Corner</h1>
        <div className='flex flex-col justify-center items-center gap-5 min-h-[200px] my-5 lg:my-10 mx-2 md:mx-10 lg:mx-20'>
          {allCartData.length > 0 ? allCartData.map((item) => {
            return (
              <div key={item.id} className='flex justify-start gap-5 items-center border-2 border-gray-600 rounded-xl p-5 w-full'>
                <div className='max-w-[100px] w-full h-[100px] md:max-w-[150px] md:h-[150px] border-2 border-black'>
                  <img className='w-full h-full' src={item.imageSrc} alt={item.title} /></div>
                <div className='flex justify-center lg:justify-between items-start lg:items-center gap-5 lg:gap-20 max-w-[85%] w-full flex-col lg:flex-row'>
                  <div className='lg:w-[70%]'>
                    <h1 className='text-sm sm:text-lg md:text-xl xl:text-2xl font-bold line-clamp-4 lg:w-full'>{item.title}</h1>
                  </div>
                  <div className='flex justify-start lg:justify-evenly items-center gap-10 sm:gap-16 w-full'>
                    <div className='flex justify-center items-center gap-2 sm:gap-5'>
                      <button className='p-2 text-xl sm:text-lg xl:text-4xl font-bold rounded-2xl bg-green-500 text-center' onClick={() => handleEditCart(item.id, 'increment')}><IoAdd /></button>
                      <h1 className='text-sm sm:text-lg font-bold xl:text-2xl'>{item.quantity}</h1>
                      <button className='p-2 text-xl sm:text-lg xl:text-4xl font-bold rounded-2xl bg-red-500 text-center' onClick={() => handleEditCart(item.id, 'decrement')}><FaMinus /></button>
                    </div>
                    <div className='font-bold text-sm sm:text-lg xl:text-2xl'>{item.unitPrice} $</div>
                    <div onClick={() => handleDeleteCart(item.documentId, 'delete')} className='text-xl sm:text-lg xl:text-4xl p-3 bg-red-500 rounded-full text-black cursor-pointer'><MdOutlineDeleteForever /></div>
                  </div>
                </div>
              </div>)
          }) : <h1 className='text-3xl font-bold'>Cart is Empty!</h1>}
        </div>
        <h1 className='text-center text-3xl font-bold'>Total: {totalPrice} $</h1>
      </div>
      {/* Modal Start */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50" role="dialog">
          <div className="modal-box bg-gray-300 border-4 border-black flex flex-col justify-center items-center min-w-[400px] min-h-[400px]">
            <h1 className="text-center font-bold text-5xl">Item Deleted From the Cart Successfully</h1>
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
  )
}

export default Cart