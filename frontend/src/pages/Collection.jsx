import { useContext, useState } from "react";
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
    category,
    setCategory,
    subCategory,
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
        <button
          type="button"
          onClick={() => {
            setCategory([]);
            setSubCategory([]);
          }}
          className={`text-base rounded-full px-4 py-2 bg-gray-200 ${
            category.length > 0 || subCategory.length > 0 ? " " : "hidden"
          }`}
        >
          All Products
        </button>
        <button
          type="button"
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTERS{" "}
          <img
            className={`h-3 sm:hidden ${showFilter ? "rotate-90 " : ""}`}
            src={assets.dropdown_icon}
            alt=""
          />
        </button>

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
                  checked={category.includes(item)}
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
                  checked={subCategory.includes(item)}
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
          <Title
            text1={`${
              category.length > 0
                ? category.join(", ").toUpperCase() + " "
                : "ALL "
            }`}
            text2={"COLLECTIONS"}
          />

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
        {showSearch && searchResults.length > 0 ? (
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
                  sellingPrice={item.sellingPrice}
                  bestSeller={item.bestSeller}
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
                sellingPrice={item.sellingPrice}
                bestSeller={item.bestSeller}
              />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {showSearch && searchResults.length > 0 ? (
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
