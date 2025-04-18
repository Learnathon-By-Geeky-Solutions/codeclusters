/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import HashLoader from "react-spinners/HashLoader";
import Title from "./Title";
import ProductItem from "./ProductItem";

const RelatedProducts = ({ category, subCategory }) => {
  const { products, loading } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();

      productsCopy = productsCopy.filter((item) => category === item.category);
      productsCopy = productsCopy.filter(
        (item) => subCategory === item.subCategory
      );

      setRelated(productsCopy.slice(0, 5));
    }
  }, []);

  return (
    <div className="my-24">
      <div className="text-center text-3xl py-2">
        <Title text1={"RELATED"} text2={"PRODUCTS"} />
      </div>
      {loading && (
        <div className="flex justify-center">
          <HashLoader size={40} loading={loading} speedMultiplier={1.5} />
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 ">
        {related.map((item) => (
          <ProductItem
            key={item._id}
            id={item._id}
            name={item.name}
            price={item.price}
            sellingPrice={item.sellingPrice}
            image={item.image}
            bestSeller={item.bestSeller}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
