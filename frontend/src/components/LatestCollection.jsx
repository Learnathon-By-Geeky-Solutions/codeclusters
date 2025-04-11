// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import HashLoader from "react-spinners/HashLoader";

const LatestCollection = () => {
  const { products, loading } = useContext(ShopContext);

  const [latestProducts, setLatestProducts] = useState([]);
  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={"LATEST"} text2={"COLLECTIONS"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dicta nihil
          vero illo ab inventore possimus minima necessitatibus sunt? Dolore,
          alias.
        </p>
      </div>

      {loading && (
        <div className="flex justify-center">
          <HashLoader size={40} loading={loading} speedMultiplier={1.5} />
        </div>
      )}
      {/* rendering products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {latestProducts.map((item) => (
          <ProductItem
            key={item._id}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
            sellingPrice={item.sellingPrice}
            bestSeller={item.bestSeller}
          />
        ))}
      </div>
    </div>
  );
};

export default LatestCollection;
