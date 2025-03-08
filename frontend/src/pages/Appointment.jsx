import { useParams, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { FaArrowLeft } from "react-icons/fa";

const Appointment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { doctors } = useContext(AppContext);
  const [date, setDate] = useState("");
  const [error, setError] = useState("");  
  
  const doctor = doctors.find((doc) => doc._id === id);

  if (!doctor)
    return <p className="text-center text-red-500">Doctor not found.</p>;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!date) {
      setError("Please select a date.");
      return;
    }

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    if (selectedDate < today) {
      setError("Please choose a future date.");
      return;
    }

    setError("");

    navigate("/my-appointments");
  };

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold mb-4"
      >
        <FaArrowLeft />
        Back
      </button>
      <div className="p-10 flex flex-col md:flex-row items-center md:items-start gap-8 max-w-4xl mx-auto">
        <div className="md:w-1/3 flex justify-center">
          <img
            className=" object-cover rounded-lg shadow-md"
            src={doctor.image}
            alt={doctor.name}
          />
        </div>

        <div className="w-full md:w-2/3 bg-white shadow-lg p-6 rounded-lg">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">
            Book an Appointment
          </h1>
          <div className="flex justify-between items-center mb-4">
            <p className="text-lg font-semibold text-blue-700">{doctor.name}</p>
            <p className="text-gray-800 font-semibold">Fee: ₹{doctor.fees}</p>
          </div>
          <p className="text-gray-600">{doctor.speciality}</p>
          <p className="text-gray-500">{doctor.experience} of experience</p>
          <p className="text-gray-700 text-justify">{doctor.about}</p>
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
            <input
              type="text"
              placeholder="Your Name"
              required
              className="p-3 border rounded-md w-full"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="p-3 border rounded-md w-full"
            />
            <input
              type="tel"
              placeholder="Your Mobile"
              required
              className="p-3 border rounded-md w-full"
            />
            <input required type="date" className="p-3 border rounded-md w-full" 
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setError("");
            }}/>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md font-semibold">
              Confirm Appointment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
