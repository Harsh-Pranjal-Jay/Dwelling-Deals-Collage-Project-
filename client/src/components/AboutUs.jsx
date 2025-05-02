import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBuilding, FaUsers, FaHandshake, FaChartLine, FaHome, 
  FaSearch, FaHeart, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaStar, FaAward, FaTrophy, FaGlobe, FaLightbulb, FaRocket
} from 'react-icons/fa';
import Footer from './Footer';

const AboutUs = () => {
  const [activeTab, setActiveTab] = useState('mission');

  const achievements = [
    { icon: <FaStar className="text-4xl text-amber-400" />, number: '50+', label: 'Happy Clients' },
    { icon: <FaAward className="text-4xl text-brand-blue" />, number: '10+', label: 'Awards Won' },
    { icon: <FaTrophy className="text-4xl text-amber-600" />, number: '7+', label: 'Years Experience' },
    { icon: <FaGlobe className="text-4xl text-green-500" />, number: '30+', label: 'Properties' }
  ];

  const values = [
    {
      icon: <FaHandshake className="text-4xl text-brand-blue" />,
      title: 'Trust',
      description: 'We build relationships based on trust and transparency.'
    },
    {
      icon: <FaSearch className="text-4xl text-brand-blue" />,
      title: 'Excellence',
      description: 'We strive for excellence in every aspect of our service.'
    },
    {
      icon: <FaHeart className="text-4xl text-brand-blue" />,
      title: 'Passion',
      description: 'We are passionate about helping people find their perfect home.'
    }
  ];

  const tabs = [
    { id: 'mission', label: 'Our Mission' },
    { id: 'vision', label: 'Our Vision' },
    { id: 'approach', label: 'Our Approach' }
  ];

  const tabContent = {
    mission: {
      title: 'Our Mission',
      content: 'To provide exceptional real estate services that help our clients achieve their property goals while maintaining the highest standards of integrity and professionalism.',
      icon: <FaRocket className="text-4xl text-brand-blue" />
    },
    vision: {
      title: 'Our Vision',
      content: 'To be the most trusted and preferred real estate partner, known for our commitment to excellence and customer satisfaction.',
      icon: <FaLightbulb className="text-4xl text-brand-blue" />
    },
    approach: {
      title: 'Our Approach',
      content: 'We combine market expertise with personalized service to deliver exceptional results for our clients.',
      icon: <FaChartLine className="text-4xl text-brand-blue" />
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/90 to-blue-600/90" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center bg-no-repeat" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white px-4 max-w-4xl mx-auto"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              About Us
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl mb-8"
            >
              Your Trusted Partner in Real Estate
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Achievements Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Achievements</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              We take pride in our accomplishments and the trust our clients place in us.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-8 bg-gray-50 rounded-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="mb-4 transform hover:scale-110 transition-transform duration-300">
                  {achievement.icon}
                </div>
                <h3 className="text-4xl font-bold text-gray-800 mb-2">{achievement.number}</h3>
                <p className="text-gray-600 font-medium">{achievement.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission/Vision/Approach Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Core Principles</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do and help us maintain our commitment to excellence.
            </p>
          </motion.div>

          <div className="flex justify-center mb-12">
            {tabs.map(tab => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 mx-2 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-brand-blue text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl p-8 shadow-xl"
            >
              <div className="flex items-center mb-6">
                <div className="p-4 bg-brand-blue/10 rounded-lg">
                  {tabContent[activeTab].icon}
                </div>
                <h2 className="text-3xl font-bold text-gray-800 ml-4">{tabContent[activeTab].title}</h2>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">{tabContent[activeTab].content}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              These core values define who we are and how we operate.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="mb-4 transform hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-brand-blue to-blue-600">
        <div className="max-w-6xl mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Find Your Dream Home?</h2>
            <p className="text-xl mb-8">Let us help you make your real estate dreams come true.</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link
                to="/search"
                className="bg-white text-brand-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                View Properties
              </Link>
              <Link
                to="/team"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Meet Our Team
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutUs;
