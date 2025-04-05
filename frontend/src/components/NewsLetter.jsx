/* eslint-disable no-unused-vars */
import React, { use, useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

// const NewsLetter = () => {
//   const [email, setEmail] = useState("");
//   const [status, setStatus] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     console.log(email);
//     // Simulate API call
//     await new Promise((resolve) => setTimeout(resolve, 1000));

//     if (email.includes("@")) {
//       setStatus("success");
//       console.log(status);
//     } else {
//       setStatus("error");
//     }
//     setIsSubmitting(false);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
//       <div className="max-w-md w-full">
//         <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
//           {status !== "success" ? (
//             <>
//               <div className="text-center">
//                 <h2 className="text-3xl font-bold text-gray-900 mb-2">
//                   Stay Updated
//                 </h2>
//                 <p className="text-gray-600">
//                   Join our newsletter and get the latest updates straight to
//                   your inbox.
//                 </p>
//               </div>

//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="relative">
//                   <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="Enter your email"
//                     className={`w-full px-4 py-3 rounded-lg border ${
//                       status === "error"
//                         ? "border-red-300 focus:border-red-500 focus:ring-red-200"
//                         : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
//                     } focus:ring-4 focus:outline-none transition duration-200`}
//                     required
//                   />
//                   {status === "error" && (
//                     <div className="absolute right-3 top-3 text-red-500">
//                       <AlertCircle size={20} />
//                     </div>
//                   )}
//                 </div>

//                 {status === "error" && (
//                   <p className="text-red-500 text-sm">
//                     Please enter a valid email address.
//                   </p>
//                 )}

//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg
//                     flex items-center justify-center space-x-2 transition duration-200
//                     ${isSubmitting ? "opacity-80 cursor-not-allowed" : ""}`}
//                 >
//                   <span>{isSubmitting ? "Subscribing..." : "Subscribe"}</span>
//                   <Send
//                     size={18}
//                     className={isSubmitting ? "animate-pulse" : ""}
//                   />
//                 </button>
//               </form>

//               <p className="text-xs text-center text-gray-500">
//                 We respect your privacy. Unsubscribe at any time.
//               </p>
//             </>
//           ) : (
//             <div className="text-center space-y-4">
//               <div className="flex justify-center">
//                 <CheckCircle size={48} className="text-green-500" />
//               </div>
//               <h3 className="text-2xl font-bold text-gray-900">
//                 Thank you for subscribing!
//               </h3>
//               <p className="text-gray-600">
//                 We have sent a confirmation email to {email}. Please check your
//                 inbox.
//               </p>
//               <button
//                 onClick={() => {
//                   setStatus("idle");
//                   setEmail("");
//                 }}
//                 className="text-dark hover:text-gray-700 font-medium"
//               >
//                 Subscribe another email
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );

//   //   return (
//   //     // <div className="text-center">
//   //     //   <p className="text-2xl font-medium text-gray-800">
//   //     //     Subscribe Now & get 10% off
//   //     //   </p>
//   //     //   <p className="text-gray-400 mt-3">
//   //     //     Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum, quidem.
//   //     //   </p>
//   //     // </div>

//   // );
// };

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (email.includes("@")) {
      setIsSuccess(true);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex items-center justify-center p-4 bg-gray-200">
      <div className=" w-3/4">
        <div className=" ">
          {!isSuccess ? (
            <>
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Stay Updated
                </h2>
                <p className="text-gray-600">
                  Join our newsletter and get the latest updates straight to
                  your inbox.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="py-4 flex flex-col sm:flex-row gap-4 items-center  w-full text-center"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-200 focus:ring-4 focus:outline-none transition duration-200"
                  required
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-1/2 bg-black hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg 
                    flex items-center justify-center space-x-2 transition duration-200
                    ${isSubmitting ? "opacity-80 cursor-not-allowed" : ""}`}
                >
                  <span>{isSubmitting ? "Subscribing..." : "Subscribe"}</span>
                  <Send
                    size={18}
                    className={isSubmitting ? "animate-pulse" : ""}
                  />
                </button>
              </form>

              <p className="text-xs text-center text-gray-500">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle size={48} className="text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Thank you for subscribing!
              </h3>
              <p className="text-gray-600">
                We have sent a confirmation email to {email}. Please check your
                inbox.
              </p>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setEmail("");
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Subscribe another email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default NewsLetter;
