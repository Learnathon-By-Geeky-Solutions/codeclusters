/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

const OrderTrackingModal = ({ order, onClose }) => {
  const statusSteps = [
    { title: "Order Placed", description: "Your order has been received." },
    { title: "Packing", description: "Your order is being packed with care." },
    { title: "Shipped", description: "Your order is on its journey." },
    { title: "Out for Delivery", description: "Your order is almost there." },
    { title: "Delivered", description: "Your order has arrived!" },
  ];

  const currentStepIndex = statusSteps.findIndex(
    (step) => step.title.toLowerCase() === order.status.toLowerCase()
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Order Tracking</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✖
          </button>
        </div>

        <div className="space-y-4">
          {statusSteps.map((step, index) => (
            <div key={step.title} className="flex items-start">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 text-sm font-bold ${
                  index <= currentStepIndex
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {index + 1}
              </div>

              {index < statusSteps.length - 1 && (
                <div
                  className={`w-1 h-8 mx-4 ${
                    index < currentStepIndex ? "bg-green-500" : "bg-gray-200"
                  }`}
                ></div>
              )}

              <div className="ml-4">
                <h3
                  className={`font-semibold ${
                    index <= currentStepIndex
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default OrderTrackingModal;
