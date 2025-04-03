/* eslint-disable no-unused-vars */
// {// eslint-disable-next-line no-unused-vars
// import React, { useContext, useEffect, useState } from "react";
// import { ShopContext } from "../context/ShopContext";
// import { assets } from "../assets/assets";
// import Title from "../components/Title";
// import ProductItem from "../components/ProductItem";}

// const Collection = () => {
//   const { products, search, showSearch } = useContext(ShopContext);
//   const [showFilter, setShowFilter] = useState(false);
//   const [filterProducts, setFilterProducts] = useState([]);
//   const [category, setCategory] = useState([]);
//   const [subCategory, setSubCategory] = useState([]);
//   const [sortType, setSortType] = useState("relevant");

//   const toggleCategory = (e) => {
//     if (category.includes(e.target.value)) {
//       setCategory((prev) => prev.filter((item) => item !== e.target.value));
//     } else {
//       setCategory((prev) => [...prev, e.target.value]);
//     }
//   };

//   const toggleSubCategory = (e) => {
//     if (subCategory.includes(e.target.value)) {
//       setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
//     } else {
//       setSubCategory((prev) => [...prev, e.target.value]);
//     }
//   };

//   const applyFilter = () => {
//     let productsCopy = products.slice();
//     if (showSearch && search) {
//       productsCopy = productsCopy.filter((item) =>
//         item.name.toLowerCase().includes(search.toLowerCase())
//       );
//     }
//     if (category.length > 0) {
//       productsCopy = productsCopy.filter((item) =>
//         category.includes(item.category)
//       );
//     }

//     if (subCategory.length > 0) {
//       productsCopy = productsCopy.filter((item) =>
//         subCategory.includes(item.subCategory)
//       );
//     }

//     setFilterProducts(productsCopy);
//   };

//   const sortProducts = () => {
//     let filterProductsCopy = filterProducts.slice();

//     switch (sortType) {
//       case "lowHigh":
//         setFilterProducts(filterProductsCopy.sort((a, b) => a.price - b.price));
//         break;
//       case "highLow":
//         setFilterProducts(filterProductsCopy.sort((a, b) => b.price - a.price));
//         break;

//       default:
//         applyFilter();
//         break;
//     }
//   };

//   useEffect(() => {
//     applyFilter();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [category, subCategory, search, showSearch, products]);

//   useEffect(() => {
//     sortProducts();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [sortType]);
//   return (
//     <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'">
//       {/*filter option */}
//       <div className="min-w-60">
//         <p
//           onClick={() => setShowFilter(!showFilter)}
//           className="my-2 text-xl flex items-center cursor-pointer gap-2"
//         >
//           FILTERS
//           <img
//             className={`h-3 sm:hidden ${showFilter ? "rotate-90 " : ""}`}
//             src={assets.dropdown_icon}
//             alt=""
//           />
//         </p>
//         {/*Category FIlters */}
//         <div
//           className={` border border-gray-300 pl-5 py-3 mt-6 ${
//             showFilter ? "" : "hidden"
//           } sm:block`}
//         >
//           <p className="mb-3 text-sm font-medium">CATEGORIES</p>
//           <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
//             <p className="flex gap-2">
//               <input
//                 type="checkbox"
//                 className="w-3"
//                 value={"Men"}
//                 onChange={toggleCategory}
//               />
//               Men
//             </p>
//             <p className="flex gap-2">
//               <input
//                 type="checkbox"
//                 className="w-3"
//                 value={"Women"}
//                 onChange={toggleCategory}
//               />
//               Women
//             </p>
//             <p className="flex gap-2">
//               <input
//                 type="checkbox"
//                 className="w-3"
//                 value={"Kids"}
//                 onChange={toggleCategory}
//               />
//               Kids
//             </p>
//           </div>
//         </div>

//         {/*SubCategory FIlters */}
//         <div
//           className={` border border-gray-300 pl-5 py-3 my-5 ${
//             showFilter ? "" : "hidden"
//           } sm:block`}
//         >
//           <p className="mb-3 text-sm font-medium">TYPE</p>
//           <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
//             <p className="flex gap-2">
//               <input
//                 type="checkbox"
//                 className="w-3"
//                 onChange={toggleSubCategory}
//                 value={"Topwear"}
//               />
//               Dress
//             </p>
//             <p className="flex gap-2">
//               <input
//                 type="checkbox"
//                 className="w-3"
//                 onChange={toggleSubCategory}
//                 value={"Bottomwear"}
//               />
//               Shoes
//             </p>
//             <p className="flex gap-2">
//               <input
//                 type="checkbox"
//                 className="w-3"
//                 onChange={toggleSubCategory}
//                 value={"Winterwear"}
//               />
//               Cosmetics
//             </p>
//           </div>
//         </div>
//       </div>

//       {/*Right side */}
//       <div className="flex-1">
//         <div className="flex justify-between text-base sm:text-2xl mb-4">
//           <Title text1={"ALL"} text2={"COLLECTIONS"} />

//           {/**product sorts */}

//           <select
//             onChange={(e) => setSortType(e.target.value)}
//             className="border border-gray-300 text-sm px-2"
//           >
//             <option value="relevant">Sort by : Relevant</option>
//             <option value="lowHigh">Sort by : Low to High</option>
//             <option value="highLow">Sort by : High to Low</option>
//           </select>
//         </div>

//         {/**Map products */}
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 ">
//           {filterProducts.map((item, index) => (
//             <ProductItem
//               key={index}
//               id={item._id}
//               name={item.name}
//               image={item.image}
//               price={item.price}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Collection;

import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const {
    products,
    currentPage,
    setCurrentPage,
    totalPages,

    setCategory,

    setSubCategory,

    setSortType,
    searchResults,
    searchTotalPages,
    searchPage,
    setSearchPage,
    showSearch,
    searchQuery,
  } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);

  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setSubCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'">
      {/* Sidebar Filters */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTERS
          <img
            className={`h-3 sm:hidden ${showFilter ? "rotate-90 " : ""}`}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>

        {/* Category Filters */}
        <div
          className={` border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {["Men", "Women", "Kids"].map((item) => (
              <label key={item} className="flex gap-2">
                <input
                  type="checkbox"
                  className="w-3"
                  value={item}
                  onChange={toggleCategory}
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        {/* SubCategory Filters */}
        <div
          className={` border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">TYPE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {["Topwear", "Bottomwear", "Winterwear"].map((item) => (
              <label key={item} className="flex gap-2">
                <input
                  type="checkbox"
                  className="w-3"
                  value={item}
                  onChange={toggleSubCategory}
                />
                {item}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Product Section */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />

          {/* Product Sorting */}
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border border-gray-300 text-sm px-2"
          >
            <option value="relevant">Sort by : Relevant</option>
            <option value="lowHigh">Sort by : Low to High</option>
            <option value="highLow">Sort by : High to Low</option>
          </select>
        </div>

        {/* Display Products */}
        {showSearch && searchResults ? (
          <>
            <p className="text-gray-600 text-sm">
              Showing search results for: {searchQuery}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 ">
              {searchResults.map((item) => (
                <ProductItem
                  key={item._id}
                  id={item._id}
                  name={item.name}
                  image={item.image}
                  price={item.price}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 ">
            {products.map((item) => (
              <ProductItem
                key={item._id}
                id={item._id}
                name={item.name}
                image={item.image}
                price={item.price}
              />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {showSearch && searchResults ? (
          <div className="flex justify-center mt-5">
            <button
              disabled={searchPage === 1}
              onClick={() => setSearchPage(searchPage - 1)}
              className="px-4 py-2 mx-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 mx-2">
              Page {searchPage} of {searchTotalPages}
            </span>
            <button
              disabled={searchPage === searchTotalPages}
              onClick={() => setSearchPage(searchPage + 1)}
              className="px-4 py-2 mx-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        ) : (
          <div className="flex justify-center mt-5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-4 py-2 mx-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 mx-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-4 py-2 mx-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
