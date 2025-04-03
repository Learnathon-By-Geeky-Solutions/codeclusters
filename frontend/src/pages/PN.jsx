/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line no-unused-vars
// import React, { useContext, useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { assets } from "../assets/assets";
// import { ShopContext } from "../context/ShopContext";

// const Product = () => {
//   const { productId } = useParams();
//   const { products, currency } = useContext(ShopContext);
//   const [productData, setProductData] = useState(false);
//   const [image, setImage] = useState("");
//   const [size, setSize] = useState("");

//   const fetchProductData = async () => {
//     products.map((item) => {
//       if (item._id === productId) {
//         setProductData(item);
//         setImage(item.image[0]);
//       }
//     });
//   };

//   useEffect(() => {
//     fetchProductData();
//   }, [productId, products]);
//   return productData ? (
//     <div className="border-t2 pt-10 transition-opacity ease-in duration-500 opacity-100">
//       {/**Product data */}

//       <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
//         {/**Product images */}
//         <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
//           <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.5%] w-full">
//             {productData.image.map((item, index) => (
//               <img
//                 onClick={() => setImage(item)}
//                 src={item}
//                 key={index}
//                 className="w-[24%] sm:w-full sm:mb-3 flex-shrink cursor-pointer"
//               />
//             ))}
//           </div>
//           <div className="w-full sm:w-[80%]">
//             <img className="w-full h-auto" src={image} alt="" />
//           </div>
//         </div>

//         {/**Product Info */}
//         <div className="flex-1">
//           <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
//           <div className="flex items-center gap-1 mt-2">
//             <img src={assets.star_icon} alt="" className="w-3.5" />
//             <img src={assets.star_icon} alt="" className="w-3.5" />
//             <img src={assets.star_icon} alt="" className="w-3.5" />
//             <img src={assets.star_icon} alt="" className="w-3.5" />
//             <img src={assets.star_dull_icon} alt="" className="w-3.5" />
//             <p className="pl-2">(122)</p>
//           </div>
//           <p className="mt-5 text-3xl font-medium">
//             {currency}
//             {productData.price}
//           </p>
//           <p className="mt-5 text-gray-500 md:w-4/5">
//             {productData.description}
//           </p>
//           <div className="flex flex-col gap-4 my-8">
//             <p>Select Size</p>
//             <div className="flex gap-2">
//               {productData.sizes.map((item, index) => (
//                 <button
//                   onClick={() => setSize(item)}
//                   className={`border py-2 px-4 bg-gray-100 ${
//                     item === size ? "border-orange-500" : ""
//                   }`}
//                   key={index}
//                 >
//                   {item}
//                 </button>
//               ))}
//             </div>
//           </div>
//           <button className="bg-black text-white px-8 py-3 tex-sm active:bg-gray-700">
//             ADD TO CART
//           </button>
//           <hr className="mt-8 sm:w-4/5" />
//           <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
//             <p>100% Original Product</p>
//             <p>Cash on delivery is available</p>
//             <p>Easy return and exchange policy within 7 days</p>
//           </div>
//         </div>
//       </div>
//       {/**Review sec */}
//       <div className="mt-20">
//         <div className="flex">
//           <b className="border px-5 py-3 text-sm">Description</b>
//           <b className="border px-5 py-3 text-sm">Reviews(122)</b>
//         </div>
//         <div className="flex flex-col gap-4 border p-6 text-sm text-gray-500">
//           <p>
//             Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
//             quas expedita deleniti, temporibus animi omnis dolores laboriosam
//             eaque eum ad illum qui nobis commodi? Minus corporis illum
//             exercitationem possimus cum?
//           </p>
//           <p>
//             Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cupiditate
//             dicta sapiente minima debitis, a deleniti nam vel officia corporis
//             veniam?
//           </p>
//         </div>
//       </div>
//     </div>
//   ) : (
//     <div className="opacity-0"></div>
//   );
// };

// export default Product;

{
  /**----------------------------------- */
}
/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";

const Product = () => {
  const { productId } = useParams();
  const { products, currency } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [selectedTab, setSelectedTab] = useState("description");
  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);
      }
    });
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);
  return productData ? (
    <div className="border-t2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/**Product data */}

      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/**Product images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.5%] w-full">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink cursor-pointer"
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto" src={image} alt="" />
          </div>
        </div>

        {/**Product Info */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_icon} alt="" className="w-3.5" />
            <img src={assets.star_dull_icon} alt="" className="w-3.5" />
            <p className="pl-2">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 bg-gray-100 ${
                    item === size ? "border-orange-500" : ""
                  }`}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <button className="bg-black text-white px-8 py-3 tex-sm active:bg-gray-700">
            ADD TO CART
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original Product</p>
            <p>Cash on delivery is available</p>
            <p>Easy return and exchange policy within 7 days</p>
          </div>
        </div>
      </div>
      {/**Review sec */}
      <div className="mt-20">
        <div className="flex">
          <b
            className={`border px-5 py-3 text-sm cursor-pointer ${
              selectedTab === "description" ? "bg-gray-200" : ""
            }`}
            onClick={() => setSelectedTab("description")}
          >
            Description
          </b>
          <b
            className={`border px-5 py-3 text-sm cursor-pointer ${
              selectedTab === "reviews" ? "bg-gray-200" : ""
            }`}
            onClick={() => setSelectedTab("reviews")}
          >
            Reviews(122)
          </b>
        </div>
        {/* <div className="flex flex-col gap-4 border p-6 text-sm text-gray-500">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            quas expedita deleniti, temporibus animi omnis dolores laboriosam
            eaque eum ad illum qui nobis commodi? Minus corporis illum
            exercitationem possimus cum?
          </p>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cupiditate
            dicta sapiente minima debitis, a deleniti nam vel officia corporis
            veniam?
          </p>
        </div> */}
      </div>

      {selectedTab === "description" ? (
        <div className="border p-6 text-sm text-gray-500">
          <p>{productData.description}</p>
        </div>
      ) : (
        <div className="border p-6 text-sm text-gray-500 flex flex-col gap-4">
          {/* {productData.reviews.length > 0 ? (
            productData.reviews.map((review, index) => (
              <div key={index} className="border-b pb-4">
                <div className="flex items-center gap-2">
                  <img
                    src={review.userImage}
                    alt="user"
                    className="w-8 h-8 rounded-full"
                  />
                  <p className="font-medium">{review.userName}</p>
                </div>
                <div className="flex mt-1">
                  {[...Array(5)].map((_, i) => (
                    <img
                      key={i}
                      src={
                        i < review.rating
                          ? assets.star_icon
                          : assets.star_dull_icon
                      }
                      alt="star"
                      className="w-3"
                    />
                  ))}
                </div>
                <p className="mt-2">{review.comment}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet. Be the first to review this product!</p>
          )} */}
          <p>No reviews yet. Be the first to review this product!</p>
        </div>
      )}
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
