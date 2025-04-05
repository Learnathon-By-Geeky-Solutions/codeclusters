/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
// import { products } from "../assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "৳";
  const deliver_fee = 100;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  // const [search, setSearch] = useState("");

  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");

  //state for search
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTotalPages, setSearchTotalPages] = useState(1);
  const [searchPage, setSearchPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // State for Pagination & Filters
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");
  // const [userName, setUsername] = useState("");
  const navigate = useNavigate();

  //Search
  const debouncedSearch = async () => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await axios.get(
        `${backendUrl}/api/product/search?page=${searchPage}&limit=20&search=${encodeURIComponent(
          searchQuery
        )}`
      );
      console.log(res);
      if (res) {
        setSearchResults(res.data.products);
        setSearchTotalPages(res.data.totalPages);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.warning("Select Product Size");
      return;
    }
    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);

    cartData[itemId][size] = quantity;
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, quantity },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalAmount;
  };

  // const getProductsData = async () => {
  //   try {
  //     const res = await axios.get(backendUrl + "/api/product/list");
  //     if (res.data.success) {
  //       setProducts(res.data.products);

  //       // console.log(res.data.products);
  //     } else {
  //       toast.error(res.data.message);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error(error.message);
  //   }
  // };
  // get product data using pagination
  const getProductsData = async (
    page = 1,
    category = [],
    subCategory = [],
    sortType = "relevant"
  ) => {
    try {
      const categoryQuery =
        category.length > 0 ? `&category=${category.join(",")}` : "";
      const subCategoryQuery =
        subCategory.length > 0 ? `&subCategory=${subCategory.join(",")}` : "";
      const sortQuery = sortType !== "relevant" ? `&sort=${sortType}` : "";

      const res = await axios.get(
        `${backendUrl}/api/product/list?page=${page}&limit=20${categoryQuery}${subCategoryQuery}${sortQuery}`
      );

      if (res.data.success) {
        setProducts(res.data.products);
        setTotalPages(res.data.totalPages);
        setCurrentPage(res.data.currentPage);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getUserCart = async (token) => {
    try {
      const res = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { token } }
      );
      if (res.data.success) {
        setCartItems(res.data.cartData);
        // setUsername(res.data.name);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // useEffect(() => {
  //   getProductsData();
  // }, []);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      getUserCart(localStorage.getItem("token"));
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      debouncedSearch();
    }, 500); // Delay API call by 500ms

    return () => clearTimeout(timer);
  }, [searchQuery, searchPage]); // Runs whenever `searchQuery` or `searchPage` changes
  // Fetch products when filters change
  useEffect(() => {
    getProductsData(currentPage, category, subCategory, sortType);
  }, [currentPage, category, subCategory, sortType]);
  const value = {
    products,
    currency,
    deliver_fee,

    showSearch,
    setShowSearch,
    addToCart,
    cartItems,
    setCartItems,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    token,
    setToken,
    currentPage,
    setCurrentPage,
    totalPages,
    category,
    setCategory,
    subCategory,
    setSubCategory,
    sortType,
    setSortType,
    searchResults,
    searchTotalPages,
    searchPage,
    setSearchPage,
    searchQuery,
    setSearchQuery,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
