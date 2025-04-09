// CategoryComponent.jsx

import { assets } from "../assets/assets";
import Title from "./Title";
import { ShopContext } from "../context/ShopContext";
import { useContext } from "react";

const Category = () => {
  const { setCategory, navigate } = useContext(ShopContext);

  const categories = [
    {
      name: "Men",
      image: assets.men,
      description: "Explore our latest mens collection",
    },
    {
      name: "Women",
      image: assets.women,
      description: "Discover stylish women apparel",
    },
    {
      name: "Kids",
      image: assets.kid,
      description: "Find cute kids clothing",
    },
  ];
  const handleClick = (category) => {
    setCategory([category]);
    navigate("/Collection");
  };
  return (
    <div className="container mx-auto px-4 py-8">
      {/* <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2> */}

      <div className="text-center py-8 text-3xl">
        <Title text1={"DISCOVER YOUR"} text2={"STYLE"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Explore our collections for everyone in your family
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {categories.map((category) => (
          <div
            key={category.name}
            className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-[120px] sm:h-[200px] object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center p-2">
              <div className="text-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-2xl font-semibold sm:mb-2">
                  {category.name}
                </h3>
                <p className="text-sm mb-2 sm:mb-4">{category.description}</p>
                <button
                  onClick={() => handleClick(category.name)}
                  className="bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-gray-200 transition-colors"
                >
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
