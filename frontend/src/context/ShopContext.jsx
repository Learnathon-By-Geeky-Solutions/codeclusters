/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "৳";
  const deliver_fee = 100;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTotalPages, setSearchTotalPages] = useState(1);
  const [searchPage, setSearchPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");

  const navigate = useNavigate();

  const debouncedSearch = async () => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await axios.get(
        `${backendUrl}/api/product/search?page=${searchPage}&limit=20&search=${encodeURIComponent(
          searchQuery
        )}&category=${category}&subCategory=${subCategory}&sort=${sortType}`
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

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount +=
              itemInfo?.sellingPrice * cartItems[items][item] ||
              itemInfo?.price * cartItems[items][item];
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalAmount;
  };

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
        setLoading(false);
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
        return res.data.cartData;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      return {};
    }
  };
  const mergeCart = async (localCart, serverCart) => {
    let mergedCart = structuredClone(serverCart);

    for (const itemId in localCart) {
      if (mergedCart[itemId]) {
        for (const size in localCart[itemId]) {
          if (mergedCart[itemId][size]) {
            mergedCart[itemId][size] += localCart[itemId][size];
          } else {
            mergedCart[itemId][size] = localCart[itemId][size];
          }
        }
      } else {
        mergedCart[itemId] = { ...localCart[itemId] };
      }
    }

    setCartItems(mergedCart);

    if (token) {
      try {
        for (const itemId in mergedCart) {
          for (const size in mergedCart[itemId]) {
            const quantity = mergedCart[itemId][size];
            if (quantity > 0) {
              await axios.post(
                backendUrl + "/api/cart/update",
                { itemId, size, quantity },
                { headers: { token } }
              );
            }
          }
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to sync cart with server");
      }
    }
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

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken && !token) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      const syncCart = async () => {
        const serverCart = await getUserCart(token);
        await mergeCart(cartItems, serverCart);
      };
      syncCart();
    }
  }, [token]);
  useEffect(() => {
    const timer = setTimeout(() => {
      debouncedSearch();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, searchPage]);

  useEffect(() => {
    getProductsData(currentPage, category, subCategory, sortType);
  }, [currentPage, category, subCategory, sortType]);
  const value = {
    products,
    currency,
    deliver_fee,

    showSearch,
    setShowSearch,
    getUserCart,
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
    loading,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
