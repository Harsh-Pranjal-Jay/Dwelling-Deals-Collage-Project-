import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaHome, FaInfoCircle, FaSearch, FaUsers, FaArrowUp, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearInterval(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gradient-to-r from-slate-700 to-slate-800 text-white relative mt-8">
      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-brand-blue text-white p-3 rounded-full shadow-lg hover:bg-brand-blue/90 transition-colors z-50"
          aria-label="Back to top"
        >
          <FaArrowUp className="text-xl" />
        </button>
      )}

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/home" className="flex items-center space-x-2">
              <img
                className="w-8 h-8"
                src="https://img.icons8.com/sf-black-filled/64/ffffff/home.png"
                alt="logo"
              />
              <h2 className="text-xl font-bold tracking-tight">Dwelling Deals</h2>
            </Link>
            <p className="text-gray-300 text-sm">
              Your trusted partner in finding the perfect property. We connect buyers and sellers with the best real estate deals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/home" className="flex items-center text-gray-300 hover:text-white transition-colors duration-300">
                  <FaHome className="mr-2" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/search" className="flex items-center text-gray-300 hover:text-white transition-colors duration-300">
                  <FaSearch className="mr-2" />
                  Search Listings
                </Link>
              </li>
              <li>
                <Link to="/about" className="flex items-center text-gray-300 hover:text-white transition-colors duration-300">
                  <FaInfoCircle className="mr-2" />
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/team" className="flex items-center text-gray-300 hover:text-white transition-colors duration-300">
                  <FaUsers className="mr-2" />
                  Our Team
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-300">
                <FaEnvelope className="mr-2 text-white" />
                <a href="mailto:www.tenderapproach.com" className="hover:text-white transition-colors">
                  www.tenderapproach.com
                </a>
              </li>
              <li className="flex items-center text-gray-300">
                <FaPhone className="mr-2 text-white" />
                <a href="tel:+917990932991" className="hover:text-white transition-colors">
                  +91 7990932991
                </a>
              </li>
              <li className="flex items-start text-gray-300">
                <FaMapMarkerAlt className="mr-2 text-white mt-1" />
                <span>
                  B-433, Sumel-7, Soni Ni Chali Cross Road,<br />
                  Rakhiyal Road, Ahmedabad-382350
                </span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/share/1Znp8m1qcb/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/tenderapproach?igsh=MWtucTZnem5tYm92eQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-600">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              &copy; {new Date().getFullYear()} Dwelling Deals. All rights reserved.
            </p>
            <p className="text-gray-300 text-sm mt-2 md:mt-0">
              Current Time: {currentDate.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
