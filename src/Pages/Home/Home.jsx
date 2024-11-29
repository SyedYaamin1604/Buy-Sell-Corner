import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { IoSearchSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import Loading from '../../Components/Loading';

const Home = () => {
  const [product, setProduct] = useState([]);

  useEffect(() => {
    handleData();
  }, [])


  const handleData = async () => {
    const response = await axios.get("https://fakestoreapi.com/products")
      .then((response) => {
        const data = response.data
        setProduct(data)
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const navigate = useNavigate();
  const SingleProduct = (id) => {
    navigate(`/product/${id}`);
  }

  return (
    <>
      <div className='min-h-[80vh] py-10 px-5 lg:px-16'>
        {/* Search Bar Start */}
        <div className='flex justify-start items-center border-2 border-purple-600 rounded-lg gap-3 px-5 py-1'>
          <span className='text-xl font-medium'>
            <IoSearchSharp />
          </span>
          <input type="search" placeholder='Search' className='w-full py-1 px-3 text-xl bg-transparent outline-none' />
        </div>
        {/* Search Bar End */}

        <h1 className='my-7 lg:text-7xl text-5xl font-bold text-center'>Products</h1>
        <div className='flex justify-center gap-10 items-center flex-wrap'>
          {product ? product.map((item) => {
            return (
              <div key={item.id} className='max-w-[380px] h-[450px] border-2 border-gray-400 rounded-2xl shadow-lg shadow-black flex flex-col'>
                <img className='w-full h-[250px] object-fix rounded-3xl p-4' src={item.image} alt={item.title} />
                <div className='py-2 px-4 flex flex-col justify-between h-full'>
                  <h1 className='text-lg font-bold line-clamp-2'>{item.title}</h1>
                  <p className='mt-1 text-md text-gray-500 line-clamp-3'>{item.description}</p>
                  <div className='mt-4 flex justify-between items-center'>
                    <h1 className='text-lg font-bold'>${item.price}</h1>
                    <button onClick={() => SingleProduct(item.id)} className='py-2 px-4 text-sm bg-purple-600 text-white rounded-md'>
                      MORE INFO
                    </button>
                  </div>
                </div>
              </div>
            )
          }) : <Loading />}

        </div>
      </div>
    </>
  )
}

export default Home