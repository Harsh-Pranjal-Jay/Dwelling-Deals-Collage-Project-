import React, { useState } from 'react';
import { 
  FaBuilding, FaUsers, FaHandshake, FaChartLine, FaHome, 
  FaSearch, FaHeart, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaStar, FaAward, FaTrophy, FaGlobe, FaLightbulb, FaRocket,
  FaLinkedin, FaTwitter
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AboutUs = () => {
  const [showContactForm, setShowContactForm] = useState(false);
  const [activeTab, setActiveTab] = useState('mission');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const teamMembers = [
    {
      name: 'John Doe',
      role: 'CEO & Founder',
      image: '/images/team/team1.jpg',
      description: 'With over 15 years of experience in real estate, John leads our team with vision and expertise.',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      social: {
        linkedin: '#',
        twitter: '#'
      }
    },
    {
      name: 'Jane Smith',
      role: 'Head of Sales',
      image: '/images/team/team2.jpg',
      description: 'Jane brings 10 years of sales experience and a passion for connecting people with their dream homes.',
      email: 'jane@example.com',
      phone: '+1 (555) 123-4568',
      social: {
        linkedin: '#',
        twitter: '#'
      }
    },
    {
      name: 'Mike Johnson',
      role: 'Property Manager',
      image: '/images/team/team3.jpg',
      description: 'Mike ensures all our properties are maintained to the highest standards.',
      email: 'mike@example.com',
      phone: '+1 (555) 123-4569',
      social: {
        linkedin: '#',
        twitter: '#'
      }
    }
  ];

  const achievements = [
    { icon: <FaStar className="text-4xl text-amber-400" />, number: '1000+', label: 'Happy Clients' },
    { icon: <FaAward className="text-4xl text-brand-blue" />, number: '50+', label: 'Awards Won' },
    { icon: <FaTrophy className="text-4xl text-amber-600" />, number: '15+', label: 'Years Experience' },
    { icon: <FaGlobe className="text-4xl text-green-500" />, number: '500+', label: 'Properties' }
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

  const handleContactSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent successfully! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
    setShowContactForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      
      {/* Hero Section with Enhanced Parallax */}
      <div className="relative h-[90vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/90 to-blue-600/90" />
        <div className="absolute inset-0 bg-[url('/images/about-hero.jpg')] bg-cover bg-center bg-no-repeat bg-fixed" />
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col md:flex-row gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-brand-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                onClick={() => setShowContactForm(true)}
              >
                Get in Touch
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                View Properties
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Achievements Section with Enhanced Cards */}
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

      {/* Mission/Vision/Approach Tabs with Enhanced UI */}
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

      {/* Team Section with Enhanced Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our dedicated team of professionals is here to help you every step of the way.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2"
              >
                <div className="relative h-96">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <div className="text-white space-y-4">
                      <div className="flex space-x-4">
                        <a href={member.social.linkedin} className="hover:text-brand-blue transition-colors">
                          <FaLinkedin className="text-2xl" />
                        </a>
                        <a href={member.social.twitter} className="hover:text-brand-blue transition-colors">
                          <FaTwitter className="text-2xl" />
                        </a>
                      </div>
                      <div className="space-y-2">
                        <a href={`mailto:${member.email}`} className="block hover:underline">{member.email}</a>
                        <a href={`tel:${member.phone}`} className="block hover:underline">{member.phone}</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-brand-blue mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section with Enhanced Form */}
      <section className="py-20 bg-gradient-to-r from-brand-blue to-blue-600">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center text-white mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Find Your Dream Home?</h2>
            <p className="text-xl mb-8">Let us help you make your real estate dreams come true.</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowContactForm(true)}
                className="bg-white text-brand-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                Contact Us
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                View Properties
              </motion.button>
            </div>
          </motion.div>

          <AnimatePresence>
            {showContactForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-2xl mx-auto bg-white rounded-xl shadow-2xl p-8"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Get in Touch</h3>
                  <button
                    onClick={() => setShowContactForm(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-colors"
                    ></textarea>
                  </div>
                  <div className="flex justify-end gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setShowContactForm(false)}
                      className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="px-6 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Send Message
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default AboutUs; 