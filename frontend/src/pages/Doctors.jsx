import { React, useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Doctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);
  const [hoveredDoctor, setHoveredDoctor] = useState(null);

  return (
    <div>
      <h1 className="text-lg font-bold text-center">All Available Doctors</h1>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-5 px-3 sm:px-0">
        {doctors.slice(0, 10).map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(`/appointment/${item._id}`)}
            onMouseEnter={() => setHoveredDoctor(index)}
            onMouseLeave={() => setHoveredDoctor(null)}
            className="relative border border-blue-200 rounded-xl cursor-pointer hover:translate-y-[-5px] transition-all duration-300 p-4 bg-white"
          >
            <img
              className="bg-blue-50 w-full h-40 object-cover rounded-lg"
              src={item.image}
              alt={item.name}
            />
            <div className="p-4">
              <div className="flex items-center gap-2 text-sm text-green-500">
                <p className="w-2 h-2 bg-green-500 rounded-full"></p>
                <p>Available</p>
              </div>
              <p className="text-gray-900 text-lg font-medium">{item.name}</p>
              <p className="text-gray-600 text-sm">{item.speciality}</p>
            </div>

            {hoveredDoctor === index && (
              <div className="absolute top-1/3 left-0 w-full overflow-y-auto bg-white border border-gray-300 shadow-lg rounded-lg p-4 z-[1000] bottom-0">
                <h3 className="text-lg font-bold text-blue-700">{item.name}</h3>
                <p className="text-gray-900 font-bold">{item.speciality}</p>
                <p className="text-sm text-gray-700 font-bold">{item.degree}</p>
                <p className="text-sm text-gray-700 font-bold">{item.experience} of experience</p>
                <p className="text-gray-700 mt-2 text-sm">{item.about}</p>
                <p className="text-blue-600 font-bold mt-2">
                  Consultation Fee: ₹{item.fees}
                </p>
                <p className="text-black text-sm">
                  Address: {item.address.line1}, {item.address.line2}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Doctors;
