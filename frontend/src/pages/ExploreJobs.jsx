import React from 'react';

const jobData = [
  {
    position: 'Manager',
    department: 'Sales',
    location: 'Rajshahi',
    deadline: 'May 10, 2025',
  },
 
  {
    position: 'Sales Associate',
    department: 'Sales',
    location: 'Rajshahi',
    deadline: 'May 20, 2025',
  },
];

const ExploreJobs = () => {
  return (
    <div className="min-h-screen bg-gray-100 font-sans p-4">
      <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg overflow-x-auto">
        <h1 className="text-center text-3xl mb-8 font-semibold">Job Openings</h1>
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-4 border-b">Position</th>
              <th className="p-4 border-b">Department</th>
              <th className="p-4 border-b">Location</th>
              <th className="p-4 border-b">Deadline</th>
              <th className="p-4 border-b">Apply</th>
            </tr>
          </thead>
          <tbody>
            {jobData.map((job, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="p-4 border-b">{job.position}</td>
                <td className="p-4 border-b">{job.department}</td>
                <td className="p-4 border-b">{job.location}</td>
                <td className="p-4 border-b">{job.deadline}</td>
                <td className="p-4 border-b">
                  <button className="bg-black text-white rounded-md px-4 py-2 hover:bg-gray-800 transition">
                    Apply Now
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExploreJobs;
