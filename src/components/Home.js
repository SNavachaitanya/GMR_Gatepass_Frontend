import React, { useState, useEffect } from 'react';
import './styles/Home.css';

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
          prevColors[2], 
          prevColors[0], 
          prevColors[1],
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
            <h1 className="text-white text-3xl font-bold" style={{ fontSize: "35px", marginBottom: "10px" }}>
              Welcome to <span style={{ color: colors[0], opacity: 0.8 }}>G</span>
              <span style={{ color: colors[1], opacity: 0.8 }}>M</span>
              <span style={{ color: colors[2], opacity: 0.8 }}>R</span> Institute of Technology
            </h1>
            <h2 className="text-white text-3xl font-bold">GatePass Generation</h2>
          </div>
        </div>

        {/* Floating Download Button */}
        <a 
          href="/GMR Gatepass.apk" 
          download
          className="fixed bottom-20 right-5 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition transform hover:scale-110 z-50"
          title="Download APK"
        >
          {/* Download icon (SVG) */}
          <img 
              src="/download-icon.png"  // We'll put your uploaded image inside public folder
              alt="Download APK" 
              className="w-8 h-8"
          />
        </a>
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
