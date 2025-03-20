import React, { useState, useEffect } from 'react';
import './styles/Home.css';
import { FaUniversity } from 'react-icons/fa'; // Importing an icon from react-icons

const Home = () => {
  // Image array with source links
  const images = [
    "https://gmrit.edu.in/images/facilities/Facilities-2-BHostel1.jpg",
    "https://gmrit.edu.in/images/facilities/Facilities-2-BHostel2.jpg",
    "https://gmrit.edu.in/images/facilities/Facilities-2-BHostel3.jpg",
    "https://gmrit.edu.in/images/facilities/Facilities-2-GHostel1.jpg",
    "https://gmrit.edu.in/images/facilities/Facilities-2-GHostel2.jpg"
  ];
  
  const initialColors = ['#0000FF', '#FF0000', '#FFFF00']; // Blue, Red, Yellow
  const [colors, setColors] = useState(initialColors);
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const colorInterval = setInterval(() => {
      setColors((prevColors) => {
        return [
          prevColors[2], // Move R to G
          prevColors[0], // Move G to M
          prevColors[1], // Move M to R
        ];
      });
    }, 1000);
    return () => clearInterval(colorInterval);
  }, []);

  return (
    <div className="h-screen w-full overflow-hidden fixed">
      {/* Carousel Container */}
      <div className="relative h-full w-full">
        <div
          className="flex transition-transform duration-700"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {images.map((src, index) => (
            <div key={index} className="w-full h-full flex-shrink-0">
              <img
                src={src}
                alt={`Slide ${index + 1}`}
                className="images"
              />
            </div>
          ))}
        </div>

        {/* Welcome Box */}
        <div className="welcome absolute inset-0 flex items-center justify-center z-20">
          <div className="bg-opacity-60 p-4 rounded text-center">
            <h1 className="text-3xl font-bold">
              <FaUniversity className="inline-block mr-2" size={40} color="#00c6ff" />
              Welcome to <span style={{ color: colors[0], opacity: 0.8 }}>G</span>
              <span style={{ color: colors[1], opacity: 0.8 }}>M</span>
              <span style={{ color: colors[2], opacity: 0.8 }}>R</span> Institute of Technology
            </h1>
            <h2 className="text-3xl font-bold">GatePass Generation</h2>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          position: 'fixed',
          bottom: 0,
          width: '100%',
          background: 'rgba(0, 0, 0, 0.6)',
          color: 'white',
          padding: '10px',
          textAlign: 'center',
          fontSize: '12px',
          zIndex: 50,
        }}
      >
Designed and Developed by  S.Navachaitanya , S.Sanjay Krishna , U.Krishna Chaitanya, H.Shruthi, T.Bhargav under the guidance of <b>Dr.K.Lakshman Rao</b> , Professor , GMRIT @2022-26      </footer>
    </div>
  );
};

export default Home;