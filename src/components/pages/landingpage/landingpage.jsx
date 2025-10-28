import React from "react";
import logo from "../../../assets/logo.png";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      
      <nav className="absolute top-0 left-0 w-full bg-transparent z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          
          <div className="flex items-center space-x-3">
            <img src={logo} alt="RentEase Logo" className="h-20 w-auto" />
            <h1 className="text-black font-bold text-white drop-shadow-lg">
              RentEase
            </h1>
          </div>

          
          <div className="hidden md:flex space-x-6">
            <div className="flex space-x-6">
                <button className="text-black-700 hover:text-black font-medium">Home</button>
                <button className="text-black-700 hover:text-black font-medium">About</button>
                <button className="text-black-700 hover:text-black font-medium">Contact</button>
           </div>
            <a
              href="#"
              className="bg-white text-black px-5 py-2 rounded-lg hover:bg-gray-200 transition font-semibold"
            >
              Get Started
            </a>
          </div>
        </div>
      </nav>

      
      <section className="relative h-screen flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600"
          alt="Modern Home"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Find Your Perfect Rental Property
          </h1>
          <p className="max-w-2xl mx-auto text-lg mb-8 text-gray-100 drop-shadow">
            Browse, list, and manage properties with ease — simplicity and
            comfort in every move.
          </p>
          <a
            href="#services"
            className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Explore Now
          </a>
        </div>
      </section>


      <section className="py-20 bg-gray-50" id="about">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">What We Do</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                title: "Communication",
                desc: "We connect landlords and tenants directly for transparent communication.",
              },
              {
                title: "Reliability",
                desc: "Verified listings and users ensure trust in every transaction.",
              },
              {
                title: "Speed",
                desc: "Instant confirmations and smooth user experience.",
              },
              {
                title: "For Everyone",
                desc: "Listings for families, students, and professionals alike.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold text-black mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-700">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-10 text-gray-900">
            Featured Rental
          </h2>
          <div className="flex flex-col md:flex-row items-center bg-white rounded-2xl shadow-md overflow-hidden">
            <img
              src="src/assets/francesca-tosolini-6japTIjUQoI-unsplash (1).jpg"
              alt="Luxury Bedroom"
              className="w-full md:w-1/2 h-80 object-cover"
            />
            <div className="p-8 text-left md:w-1/2">
              <h3 className="text-2xl font-semibold text-black mb-3">
                Luxury 
              </h3>
              <p className="text-gray-700 mb-4">
                A beautiful apartment located in a serene neighborhood with
                modern amenities and high security standards.
              </p>
              <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition">
                Explore Properties
              </button>
            </div>
          </div>
        </div>
      </section>

    
      <section id="contact" className="py-20 bg-pink-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">
            Get in Touch
          </h2>
          <div className="bg-white p-8 rounded-2xl shadow-md max-w-2xl mx-auto">
            
            <p className="text-gray-700">
              <strong>Email:</strong> support@rentease.com
            </p>
            <p className="text-gray-700">
              <strong>Phone:</strong> +254 712 345 678
            </p>
            <p className="text-gray-700">
              <strong>Location:</strong> Nairobi, Kenya
            </p>
            
          </div>
        </div>
      </section>

      
      <footer className="bg-black text-white py-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-xl font-semibold mb-3">RentEase</h3>
          
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} RentEase. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
