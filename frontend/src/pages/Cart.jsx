// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";

// Placeholder for Title component (ensure you import the actual component)
const Title = ({ text1, text2 }) => (
  <h2 className="text-2xl font-bold">
    {text1} <span className="text-primary">{text2}</span>
  </h2>
);

const Cart = () => {
  const { products, cartItems, updateQuantity } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (!cartItems) return;

    const tempData = Object.entries(cartItems).flatMap(([productId, sizes]) =>
      Object.entries(sizes)
        .filter(([_, quantity]) => quantity > 0)
        .map(([size, quantity]) => ({
          _id: productId,
          size,
          quantity,
        }))
    );

    setCartData(tempData);
  }, [cartItems]);

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      <div>
        {cartData.length > 0 ? (
          cartData.map((item, index) => {
            const productData = products?.find(
              (product) => product._id === item._id
            );

            if (!productData) return null;

            return (
              <div
                key={index}
                className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
              >
                <div className="flex items-start gap-6">
                  <img
                    src={productData.image?.[0]}
                    alt={productData.name || "Product"}
                    className="w-16 sm:w-20"
                  />
                  <div>
                    <p className="text-xs sm:text-lg font-medium">
                      {productData.name}
                    </p>
                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                    <p className="text-sm text-gray-500">
                      Price: {productData.price}
                    </p>
                  </div>
                </div>
                <input className="border max-w-10 sm:max-w-20 px-1 sm:px-2" type="number" min={1} defaultValue={item.quantity} />
                <img onClick={()=>updateQuantity(item._id, item.size, 0)} className="w-4 mr-4 sm:w-5 cursor-pointer" src={assets.bin_icon} alt="" />
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">Your cart is empty.</p>
          
        )}
      </div>
    </div>
  );
};

export default Cart;
