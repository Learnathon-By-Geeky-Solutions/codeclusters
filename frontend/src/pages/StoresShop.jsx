import React from 'react';

const stores = [
  {
    district: 'Dhaka',
    area: 'ASHKONA',
    address: '398, Ashkona Bazar Road, Dhakkin Khan',
    phone: '01713115820',
  },
  {
    district: 'Dhaka',
    area: 'Bashundara City',
    address: 'Bashundara Mall, Panthapath, Dhaka',
    phone: '01713115782',
  },
  {
    district: 'Dhaka',
    area: 'Bashundara Hushpuppies',
    address: 'Bashundara Mall, Panthapath, Dhaka',
    phone: '01713115797',
  },
];

const StoresShop = () => {
  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white font-sans text-gray-800">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-3">STORES</h1>
        <p className="text-red-500 text-lg mb-8">
          <span>Store Opening Time: <strong className="text-black">10 AM</strong></span><br />
          <span>Store Closing Time: <strong className="text-black">8 PM</strong></span>
        </p>
        <h2 className="text-2xl font-semibold mb-4">Dhaka Division</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr className="bg-sky-200 text-left font-semibold">
              <th className="p-4 border-b">District</th>
              <th className="p-4 border-b">Area</th>
              <th className="p-4 border-b">Store Address</th>
              <th className="p-4 border-b">Mobile Number</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="p-4 border-b">{store.district}</td>
                <td className="p-4 border-b">{store.area}</td>
                <td className="p-4 border-b">{store.address}</td>
                <td className="p-4 border-b">{store.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StoresShop;
