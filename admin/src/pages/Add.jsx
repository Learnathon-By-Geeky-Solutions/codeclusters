import React, { useRef, useState } from "react";
import upload from "../assets/image-upload.png";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

import PropTypes from "prop-types";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [sizes, setSizes] = useState([]);
  const [bestSeller, setBestSeller] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = [
        "text/csv",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error("Please select a CSV or XLSX file!");
        e.target.value = null; // Clear the input
        return;
      }
      setFile(selectedFile);
    }
  };
  const handleUpload = async () => {
    if (!file) {
      return toast.error("No file Selected");
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        backendUrl + "/api/product/uploadBulkProduct",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token,
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else toast.error(res.data.message);
    } catch (err) {
      console.error(err);
    }
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    if (image1 === false) {
      return toast.error("Image required");
    }
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("sellingPrice", sellingPrice);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("bestSeller", bestSeller);

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const res = await axios.post(backendUrl + "/api/product/add", formData, {
        headers: { token },
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setName("");
        setDescription("");
        setPrice("");
        setSellingPrice("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  Add.propTypes = {
    token: PropTypes.string.isRequired,
  };
  return (
    <>
      <div className="flex flex-col sm:flex-row  gap-2 mb-6">
        <label className=" flex flex-col">
          {" "}
          Upload CSV/XSLX file{" "}
          <input
            className="w-full max-w-[500px] px-3 py-2 text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            type="file"
            ref={fileInputRef}
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={handleFileChange}
          />
        </label>
        <button
          onClick={handleUpload}
          type="button"
          className="sm:mt-6 py-2 px-6 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-75"
        >
          Upload
        </button>
      </div>
      <hr />
      <form
        className="flex flex-col w-full items-start gap-3"
        onSubmit={submitHandler}
      >
        <div>
          <p className="mb-2">Upload Image</p>
          <div className="flex gap-2 ">
            <label htmlFor="image1" className="cursor-pointer">
              <span className="sr-only">Upload image 1</span>
              <img
                className="w-20 border-dashed border-2 px-2 py-2"
                src={!image1 ? upload : URL.createObjectURL(image1)}
                alt=""
              />
              <input
                type="file"
                onChange={(e) => setImage1(e.target.files[0])}
                id="image1"
                hidden
              />
            </label>
            <label htmlFor="image2" className="cursor-pointer">
              <span className="sr-only">Upload image 2</span>
              <img
                className="w-20 border-dashed border-2 px-2 py-2"
                src={!image2 ? upload : URL.createObjectURL(image2)}
                alt=""
              />
              <input
                type="file"
                onChange={(e) => setImage2(e.target.files[0])}
                id="image2"
                hidden
              />
            </label>
            <label htmlFor="image3" className="cursor-pointer">
              <span className="sr-only">Upload image 3</span>
              <img
                className="w-20 border-dashed border-2 px-2 py-2"
                src={!image3 ? upload : URL.createObjectURL(image3)}
                alt=""
              />
              <input
                type="file"
                onChange={(e) => setImage3(e.target.files[0])}
                id="image3"
                hidden
              />
            </label>
            <label htmlFor="image4" className="cursor-pointer">
              <span className="sr-only">Upload image 4</span>
              <img
                className="w-20 border-dashed border-2 px-2 py-2"
                src={!image4 ? upload : URL.createObjectURL(image4)}
                alt=""
              />
              <input
                type="file"
                onChange={(e) => setImage4(e.target.files[0])}
                id="image4"
                hidden
              />
            </label>
          </div>
        </div>
        <div className="w-full">
          <p className="mb-2">Product name</p>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
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
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2"
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
            >
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>
          </div>

          <div>
            <p className="mb-2">Product price</p>
            <input
              type="number"
              className=" w-full px-3 py-2 sm:w-[120px]"
              placeholder="0.00"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
            />
          </div>
          <div>
            <p className="mb-2">Selling price</p>
            <input
              type="number"
              className=" w-full px-3 py-2 sm:w-[120px]"
              placeholder="0.00"
              onChange={(e) => setSellingPrice(e.target.value)}
              value={sellingPrice}
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
            onChange={() => setBestSeller((prev) => !prev)}
            checked={bestSeller}
          />
          <label className="cursor-pointer" htmlFor="bestseller">
            Add to bestseller
          </label>
        </div>
        <button
          className=" w-28 py-3 mt-4 text-white hover:bg-teal-700 bg-black"
          type="submit"
        >
          ADD
        </button>
      </form>
    </>
  );
};

export default Add;
