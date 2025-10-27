import React, { useState } from 'react';

const BookingPage = ({ propertyId, propertyTitle, propertyImage, dailyRate }) => {
  const [bookingData, setBookingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    checkIn: '',
    checkOut: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Calculate number of nights and total price
  const calculateBookingDetails = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) {
      return { nights: 0, total: 0 };
    }

    const checkInDate = new Date(bookingData.checkIn);
    const checkOutDate = new Date(bookingData.checkOut);
    
    // Calculate difference in days
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    const total = nights > 0 ? nights * dailyRate : 0;
    
    return { nights, total };
  };

  const { nights, total } = calculateBookingDetails();

  const handleInputChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call - replace with your actual booking endpoint
    try {
      const response = await fetch('http://127.0.0.1:5000/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          property_id: propertyId,
          first_name: bookingData.firstName,
          last_name: bookingData.lastName,
          email: bookingData.email,
          start_date: bookingData.checkIn,
          end_date: bookingData.checkOut,
          message: bookingData.message,
          total_price: total
        })
      });

      if (response.ok) {
        alert('🎉 Booking request sent successfully!');
        // Reset form
        setBookingData({
          firstName: '',
          lastName: '',
          email: '',
          checkIn: '',
          checkOut: '',
          message: ''
        });
      } else {
        alert('Failed to submit booking. Please try again.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Error submitting booking. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = bookingData.firstName && bookingData.lastName && 
                     bookingData.email && bookingData.checkIn && 
                     bookingData.checkOut && nights > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Booking</h1>
          <p className="text-gray-600">Fill in your details to book {propertyTitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Guest Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={bookingData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your first name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={bookingData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={bookingData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Booking Period */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Check-in Date *
                    </label>
                    <input
                      type="date"
                      name="checkIn"
                      value={bookingData.checkIn}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Check-out Date *
                    </label>
                    <input
                      type="date"
                      name="checkOut"
                      value={bookingData.checkOut}
                      onChange={handleInputChange}
                      min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Booking Summary */}
                {nights > 0 && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">Booking Summary</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>{nights} night{nights !== 1 ? 's' : ''}</span>
                        <span>KSh {(dailyRate * nights).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-semibold border-t border-blue-200 pt-2">
                        <span>Total</span>
                        <span className="text-blue-600">KSh {total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    name="message"
                    value={bookingData.message}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Any special requests or additional information..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!isFormValid || isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing Booking...
                    </div>
                  ) : (
                    `Book Now for KSh ${total > 0 ? total.toLocaleString() : '0'}`
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Property Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Property Details</h3>
              
              {propertyImage && (
                <img 
                  src={propertyImage} 
                  alt={propertyTitle}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              
              <h4 className="font-semibold text-gray-800 mb-2">{propertyTitle}</h4>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Daily Rate:</span>
                  <span className="font-semibold">KSh {dailyRate?.toLocaleString()}</span>
                </div>
                
                {nights > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span>Nights:</span>
                      <span>{nights}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2">
                      <span className="font-semibold">Total:</span>
                      <span className="font-semibold text-blue-600">KSh {total.toLocaleString()}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;