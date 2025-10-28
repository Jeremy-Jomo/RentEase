import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookingPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  });
  
  const [loading, setLoading] = useState(false);
  const [cost, setCost] = useState({
    nights: 0,
    pricePerNight: 100,
    total: 0
  });

  // Calculate cost when dates change
  useEffect(() => {
    const calculateCost = () => {
      if (formData.checkIn && formData.checkOut) {
        const checkIn = new Date(formData.checkIn);
        const checkOut = new Date(formData.checkOut);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        
        if (nights > 0) {
          const total = nights * cost.pricePerNight;
          setCost(prev => ({ ...prev, nights, total }));
        }
      }
    };

    calculateCost();
  }, [formData.checkIn, formData.checkOut, cost.pricePerNight]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Transform data to match your backend expectations
      const bookingData = {
        tenant_id: 1, // You'll need to get this from user session/auth
        property_id: 1, // You'll need to get this from property selection
        start_date: formData.checkIn, // Your backend expects 'start_date'
        end_date: formData.checkOut,  // Your backend expects 'end_date'
      };
      
      await axios.post('/bookings', bookingData);
      alert(`Booking created! Total cost: $${cost.total}`);
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        checkIn: '',
        checkOut: '',
        guests: 1
      });
      setCost({ nights: 0, pricePerNight: 100, total: 0 });
      
    } catch (error) {
      alert('Error creating booking: ' + (error.response?.data?.error || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-8 px-4">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Book Your Stay</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Guest Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg mt-1"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg mt-1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mt-1"
                required
              />
            </div>
          </div>

          {/* Booking Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Booking Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Check-in Date</label>
                <input
                  type="date"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg mt-1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Check-out Date</label>
                <input
                  type="date"
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg mt-1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Guests</label>
              <select
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mt-1"
              >
                <option value={1}>1 guest</option>
                <option value={2}>2 guests</option>
                <option value={3}>3 guests</option>
                <option value={4}>4 guests</option>
              </select>
            </div>
          </div>

          {/* Cost Calculation */}
          {cost.nights > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-2">Cost Breakdown</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Price per night:</span>
                  <span>${cost.pricePerNight}</span>
                </div>
                <div className="flex justify-between">
                  <span>Number of nights:</span>
                  <span>{cost.nights}</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-semibold text-lg">
                  <span>Total Cost:</span>
                  <span>${cost.total}</span>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || cost.nights === 0}
            className="w-full bg-black text-white py-4 rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Booking...' : `Book Now ${cost.total > 0 ? `- $${cost.total}` : ''}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;