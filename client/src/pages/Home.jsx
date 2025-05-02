import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import SaleListing from '../components/SaleListing';
import RentListing from '../components/RentListing';
import OfferedListing from '../components/OfferedListing';
import HomepageImage from '../assets/home3.jpeg'
import {  useDispatch } from 'react-redux';
import { setSearchTermState } from '../redux/search/searchSlice';
import { BsSearch, BsHouse, BsBuilding } from 'react-icons/bs';
import { FaHandshake } from 'react-icons/fa';

const Home = () => {
    const navigate = useNavigate();
    // const { currentUser } = useSelector(state => state.user);
    const [searchValue, setSearchValue] = useState("");
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate(`/search`);
        setSearchValue("");
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            {/* Hero Section */}
            <section className="relative h-[90vh] w-full overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${HomepageImage})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 to-gray-800/60"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                    <div className="max-w-2xl text-white">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
                            Find Your Perfect 
                            <span className="block text-gray-200">Home Today</span>
                        </h1>
                        
                        <p className="text-xl sm:text-2xl mb-8 text-gray-100">
                            Discover amazing properties in your desired location
                        </p>

                        {/* Search Bar */}
                        <form onSubmit={handleSubmit} className="mb-8">
                            <div className="flex items-center bg-white/90 rounded-lg shadow-xl overflow-hidden max-w-2xl">
                                <input
                                    type="text"
                                    placeholder="Search by location, price, or property type..."
                                    className="w-full px-6 py-4 text-gray-800 placeholder-gray-500 focus:outline-none text-lg font-medium bg-white rounded-l-lg"
                                    onChange={(e) => {
                                        dispatch(setSearchTermState(e.target.value));
                                        setSearchValue(e.target.value);
                                    }}
                                    value={searchValue}
                                />
                                <button
                                    type="submit"
                                    className="bg-gray-700 hover:bg-gray-800 text-white px-4 mr-4 rounded-lg py-4 transition duration-300"
                                >
                                    <BsSearch className="text-xl" />
                                </button>
                            </div>
                        </form>

                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => navigate('/search')}
                                className="px-8 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-semibold transition duration-300"
                            >
                                Browse Properties
                            </button>
                            <button
                                onClick={() => navigate('/about')}
                                className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition duration-300"
                            >
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                            Why Choose Dwelling Deals?
                        </h2>
                        <p className="text-xl text-gray-600">
                            Your trusted partner in finding the perfect property
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition duration-300">
                            <div className="text-gray-700 mb-4">
                                <BsHouse className="text-4xl" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                Wide Selection
                            </h3>
                            <p className="text-gray-600">
                                Browse through thousands of properties to find your perfect match
                            </p>
                        </div>

                        <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition duration-300">
                            <div className="text-gray-700 mb-4">
                                <BsBuilding className="text-4xl" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                Trusted Sellers
                            </h3>
                            <p className="text-gray-600">
                                Connect with verified property owners and real estate agents
                            </p>
                        </div>

                        <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition duration-300">
                            <div className="text-gray-700 mb-4">
                                <FaHandshake className="text-4xl" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                Easy Process
                            </h3>
                            <p className="text-gray-600">
                                Simple and transparent property buying and selling experience
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Listings Sections */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <OfferedListing />
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="max-[1000px] px-4 sm:px-6 lg:px-8">
                    <SaleListing />
                </div>
            </section>

            <section className="py-16 bg-gray-50">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <RentListing />
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-gray-500 to-gray-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">
                        Ready to Find Your Dream Home?
                    </h2>
                    <p className="text-xl text-gray-100 mb-8">
                        Start your property search journey with us today
                    </p>
                    <button
                        onClick={() => navigate('/search')}
                        className="px-8 py-3 bg-white text-gray-800 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
                    >
                        Get Started
                    </button>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
