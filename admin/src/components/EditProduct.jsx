import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

const EditProduct = ({ isOpen, onClose, product, token }) => {
  const [productId, setProductId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [sizes, setSizes] = useState([]);
  const [bestSeller, setBestSeller] = useState(false);
  console.log(sellingPrice);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const data = {
        productId,
        name,
        description,
        price,
        sellingPrice,
        category,
        subCategory,
        sizes: JSON.stringify(sizes),
        bestSeller,
      };

      const res = await axios.post(
        backendUrl + "/api/product/updateProduct",
        data,
        {
          headers: { token },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  console.log("productId: ", productId);
  useEffect(() => {
    if (product) {
      setProductId(product._id);
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setSellingPrice(product.sellingPrice);
      setCategory(product.category);
      setSubCategory(product.subCategory);
      setSizes(product.size);
      setBestSeller(product.bestSeller);
    }
  }, [product]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-80%">
        <form
          className="flex flex-col w-full items-start gap-3"
          onSubmit={submitHandler}
        >
          <div className="w-full">
            <p className="mb-2">Product name</p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="w-full max-w-[500px] px-3 py-2"
              placeholder="ex. Sweatshirt"
              required
            />
          </div>
          <div className="w-full">
            <p className="mb-2">Product description</p>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              type="text"
              className="w-full max-w-[500px] px-3 py-2"
              placeholder="Write description..."
              required
            />
          </div>
          <div className=" flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
            <div>
              <p className="mb-2">Product Category</p>
              <select
                className="w-full px-3 py-2"
                onChange={(e) => setCategory(e.target.value)}
                value={category}
              >
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
              </select>
            </div>

            <div>
              <p className="mb-2">Sub Category</p>
              <select
                className="w-full px-3 py-2"
                onChange={(e) => setSubCategory(e.target.value)}
                value={subCategory}
              >
                <option value="Topwear">Topwear</option>
                <option value="Bottomwear">Bottomwear</option>
                <option value="Winterwear">Winterwear</option>
              </select>
            </div>

            <div>
              <p className="mb-2">Product price</p>
              <input
                onChange={(e) => setPrice(e.target.value)}
                value={price}
                type="number"
                className=" w-full px-3 py-2 sm:w-[120px]"
                placeholder="0.00"
              />
            </div>
            <div>
              <p className="mb-2">Selling price</p>
              <input
                onChange={(e) => setSellingPrice(e.target.value)}
                value={sellingPrice}
                type="number"
                className=" w-full px-3 py-2 sm:w-[120px]"
                placeholder="0.00"
              />
            </div>
          </div>
          <div>
            <p className="mb-2">Product Sizes</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes("S")
                      ? prev.filter((item) => item !== "S")
                      : [...prev, "S"]
                  )
                }
              >
                <p
                  className={`${
                    sizes.includes("S") ? "bg-sky-200" : "bg-slate-200"
                  } px-3 py-1 cursor-pointer`}
                >
                  S
                </p>
              </button>
              <button
                type="button"
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes("M")
                      ? prev.filter((item) => item !== "M")
                      : [...prev, "M"]
                  )
                }
              >
                <p
                  className={`${
                    sizes.includes("M") ? "bg-sky-200" : "bg-slate-200"
                  } px-3 py-1 cursor-pointer`}
                >
                  M
                </p>
              </button>
              <button
                type="button"
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes("L")
                      ? prev.filter((item) => item !== "L")
                      : [...prev, "L"]
                  )
                }
              >
                <p
                  className={`${
                    sizes.includes("L") ? "bg-sky-200" : "bg-slate-200"
                  } px-3 py-1 cursor-pointer`}
                >
                  L
                </p>
              </button>
              <button
                type="button"
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes("XL")
                      ? prev.filter((item) => item !== "XL")
                      : [...prev, "XL"]
                  )
                }
              >
                <p
                  className={`${
                    sizes.includes("XL") ? "bg-sky-200" : "bg-slate-200"
                  } px-3 py-1 cursor-pointer`}
                >
                  XL
                </p>
              </button>
              <button
                type="button"
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes("XXL")
                      ? prev.filter((item) => item !== "XXL")
                      : [...prev, "XXL"]
                  )
                }
              >
                <p
                  className={`${
                    sizes.includes("XXL") ? "bg-sky-200" : "bg-slate-200"
                  } px-3 py-1 cursor-pointer`}
                >
                  XXL
                </p>
              </button>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <input
              type="checkbox"
              id="bestseller"
              checked={bestSeller === "true"}
              onChange={() => setBestSeller((prev) => !prev)}
            />
            <label className="cursor-pointer" htmlFor="bestseller">
              Add to bestseller
            </label>
          </div>
          <button className=" w-28 py-3 mt-4 text-white bg-black" type="submit">
            UPDATE
          </button>
        </form>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-800 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default EditProduct;
