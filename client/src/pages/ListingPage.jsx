import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { BsHospital } from "react-icons/bs";
import { BiSolidArea } from "react-icons/bi";
import PropTypes from 'prop-types';
import {
  FaLocationArrow,
  FaBed,
  FaBath,
  FaShare,
  FaLock,
  FaBookmark,
  FaExpand,
  FaCompress,
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
  FaList,
  FaDownload,
  FaTimes,
} from "react-icons/fa";
import Loading from "../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import Contact from "../components/Contact";
import {
  handleLisingRemove,
  handleSave,
} from "../redux/saveListing/saveListingSlice";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';

const ListingPage = () => {
  const [listings, setListings] = useState({});
  const [loading, setLoading] = useState(false);
  const [savedListing, setSavedListing] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const {
    area,
    address,
    bath,
    bed,
    park,
    school,
    hospital,
    transpotation,
    elevator,
    gym,
    description,
    discountPrice,
    furnished,
    parking,
    price,
    title,
    builtyear,
    Road,
    condition,
    housetype,
    living,
    BHK,
    type,
    _id,
  } = listings;


  const navigate = useNavigate();
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  const { saveListings } = useSelector((state) => state.savedListing);

  const dispatch = useDispatch();

  //====== Loading Post Data Here ======//
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/posts/${params.id}`);
        const json = await res.json();
        
        if (!res.ok || json.success === false) {
          toast.error(json.message || "Failed to fetch listing", {
            autoClose: 2000,
          });
          setLoading(false);
          return;
        }
        setListings(json); 

        setLoading(false);

        const _id = json._id; 
        if (_id) {
          const isSaved = saveListings.some(
            (saveListing) => saveListing._id === _id
          );
          setSavedListing(isSaved);
        }
      } catch (error) {
        toast.error("An error occurred while fetching listing", {
          autoClose: 2000,
        });
        setLoading(false);
      }
    })();
  }, [params.id, saveListings,listings.userRef]);

  const lat = listings.location?.lat;
  const lng = listings.location?.lng;


  //====SLider Functions=====//
  function SamplePrevArrow({ onClick }) {
    return (
      <button
        onClick={onClick}
        className="absolute top-1/2 left-4 -translate-y-1/2 z-20 p-2 rounded-full bg-white/90 hover:bg-white transition-colors shadow-lg"
        title="Previous image"
      >
        <FaChevronLeft className="text-brand-blue text-xl" />
      </button>
    );
  }
  function SampleNextArrow({ onClick }) {
    return (
      <button
        onClick={onClick}
        className="absolute top-1/2 right-4 -translate-y-1/2 z-20 p-2 rounded-full bg-white/90 hover:bg-white transition-colors shadow-lg"
        title="Next image"
      >
        <FaChevronRight className="text-brand-blue text-xl" />
      </button>
    );
  }

  // Add PropTypes validation for arrow components
  SamplePrevArrow.propTypes = {
    onClick: PropTypes.func
  };

  SampleNextArrow.propTypes = {
    onClick: PropTypes.func
  };

  const mainSliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (current, next) => setCurrentImageIndex(next),
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    lazyLoad: 'ondemand',
    fade: true,
    cssEase: 'linear',
    adaptiveHeight: true,
    waitForAnimate: true,
    swipeToSlide: true,
    touchThreshold: 10,
    initialSlide: currentImageIndex,
    afterChange: (index) => setCurrentImageIndex(index),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
    sliderRef?.slickGoTo(index);
  };

  const [sliderRef, setSliderRef] = useState(null);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleUrlShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);

      toast.success("URL coppied !", {
        autoClose: 1000,
      });
    } catch (error) {
      toast.error("URL coppied failed!", {
        autoClose: 2000,
      });
    }
  };

  const handleSaveListing = () => {
    const isSaved = saveListings.some((saveListing) => saveListing._id === _id);
    if (isSaved) {
      const restListings = saveListings.filter(
        (savedListing) => savedListing._id !== _id
      );
      dispatch(handleLisingRemove(restListings));
      setSavedListing(false);
    } else {
      const listingToAdd = listings;
      dispatch(handleSave(listingToAdd));
      setSavedListing(true);
    }
  };


  //for parking 
  const getParkingDescription = (parking) => {
    if (parking === 0) {
      return "No Parking Space";
    } else if (parking === 1) {
      return "1 Bike or 1 Car parking space";
    }else {
      return `${parking} Car parking spaces`;
    }
  };

  //for condtition 
  const getOverallCondition = (condition) => {
    if (condition === 0) {
      return "House is in very poor condition and requires extensive repairs.";
    } else if (condition >= 1 && condition <= 5) {
      return "House is in good condition but could benefit from some improvements.";
    } else if (condition >= 6 && condition <= 8) {
      return "House is in better condition, well-maintained with minor improvements needed.";
    } else {
      return "House is in excellent condition, ready for immediate use.";
    }
  };

  // Format price with proper error handling
  const formatPrice = (price) => {
    if (!price) return "Price not available";
    return `₹${Number(price).toLocaleString()}`;
  };

  // Format area with proper error handling
  const formatArea = (area) => {
    if (!area) return "Area not available";
    return `${area} sqft`;
  };

  // Helper function to render boolean amenities
  const renderAmenity = (value, label) => (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${value ? 'bg-green-500' : 'bg-red-500'}`} />
      <span className="text-gray-600">{label}</span>
    </div>
  );

  // Add this new function to check if current user is the owner
  const isOwner = currentUser && listings.userRef === currentUser._id;

  const handleImageLoad = (e) => {
    setImageLoading(false);
    const img = e.target;
    setImageDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight
    });
  };

  const handleDownloadImage = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `property-image-${currentImageIndex + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("Image downloaded successfully!", {
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("Failed to download image", {
        autoClose: 2000,
      });
    }
  };

  const modalSliderSettings = {
    ...mainSliderSettings,
    className: "w-[90vw] h-[90vh] mx-auto",
    dots: true,
    dotsClass: "slick-dots slick-thumb",
  };

  const getImageStyle = () => {
    const maxWidth = window.innerWidth * 0.9;
    const maxHeight = window.innerHeight * 0.9;
    const aspectRatio = imageDimensions.width / imageDimensions.height;

    if (imageDimensions.width > maxWidth || imageDimensions.height > maxHeight) {
      if (aspectRatio > 1) {
        return { width: `${maxWidth}px`, height: 'auto' };
      } else {
        return { width: 'auto', height: `${maxHeight}px` };
      }
    }
    return { width: 'auto', height: 'auto' };
  };

  return (
    <>
      {loading ? (
        <>
          <Loading />
          <p className="text-brand-blue text-center font-heading text-xl">
            Loading your post…
          </p>
        </>
      ) : (
        <div className="listing_section pb-16">
          {/* Hero Image Gallery */}
          <div className="relative">
            {listings.imgUrl && listings.imgUrl.length > 0 ? (
              <div className="relative">
                {/* Main Image Slider */}
                <div className="h-[500px] relative overflow-hidden cursor-pointer" onClick={() => setShowImageModal(true)}>
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
                    </div>
                  )}
                  
                  <Slider 
                    {...mainSliderSettings} 
                    className="h-full"
                    ref={setSliderRef}
                  >
                    {listings.imgUrl.map((listing, index) => (
                      <div
                        key={index}
                        className="group relative overflow-hidden h-full flex items-center justify-center"
                      >
                        <img
                          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                          src={listing} 
                          alt={`Property image ${index + 1}`}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder-image.jpg';
                          }}
                          onLoad={handleImageLoad}
                          loading="eager"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    ))}
                  </Slider>

                  {/* Image Controls */}
                  <div className="absolute top-4 right-4 z-20 flex gap-2">
                    <button
                      onClick={() => handleDownloadImage(listings.imgUrl[currentImageIndex])}
                      className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors shadow-lg"
                      title="Download image"
                    >
                      <FaDownload className="text-brand-blue" />
                    </button>
                    <button
                      onClick={toggleFullscreen}
                      className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors shadow-lg"
                      title={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
                    >
                      {isFullscreen ? <FaCompress className="text-brand-blue" /> : <FaExpand className="text-brand-blue" />}
                    </button>
                    <button
                      onClick={handleUrlShare}
                      className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors shadow-lg"
                      title="Share listing"
                    >
                      <FaShare className="text-brand-blue" />
                    </button>
                    <button
                      onClick={handleSaveListing}
                      className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors shadow-lg"
                      title={savedListing ? "Remove from saved" : "Save listing"}
                    >
                      <FaBookmark className={savedListing ? "text-green-600" : "text-brand-blue"} />
                    </button>
                  </div>

                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-4 z-20 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {listings.imgUrl.length}
                  </div>
                </div>

                {/* Image Modal */}
                {showImageModal && (
                  <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
                    <div className="relative w-[90vw] h-[90vh] bg-white rounded-xl overflow-hidden shadow-2xl">
                      <button
                        onClick={() => setShowImageModal(false)}
                        className="absolute top-4 right-4 z-20 p-3 rounded-full bg-white/90 hover:bg-white transition-colors shadow-lg hover:scale-110"
                      >
                        <FaTimes className="text-brand-blue text-xl" />
                      </button>
                      <div className="absolute top-4 left-4 z-20 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {listings.imgUrl.length}
                      </div>
                      <Slider {...modalSliderSettings}>
                        {listings.imgUrl.map((listing, index) => (
                          <div key={index} className="h-full flex items-center justify-center p-4">
                            <div className="flex items-center justify-center w-full h-full">
                              <img
                                style={getImageStyle()}
                                className="object-contain rounded-lg"
                                src={listing}
                                alt={`Property image ${index + 1}`}
                                onLoad={handleImageLoad}
                              />
                            </div>
                          </div>
                        ))}
                      </Slider>
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                        {listings.imgUrl.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => handleThumbnailClick(index)}
                            className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                              currentImageIndex === index 
                                ? 'border-brand-blue scale-110' 
                                : 'border-white/30 hover:border-white/50'
                            }`}
                          >
                            <img
                              className="object-cover w-full h-full"
                              src={listings.imgUrl[index]}
                              alt={`Thumbnail ${index + 1}`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-[500px] flex items-center justify-center bg-gray-100">
                <p className="text-gray-500 text-lg">No images available</p>
              </div>
            )}
          </div>

          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="property_details_container pt-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-8">
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    {/* Header Section */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="font-heading text-brand-blue">
                          <span className="py-2 px-4 bg-brand-blue/10 rounded-full border border-brand-blue uppercase text-sm">
                            {type || "Not specified"}
                          </span>
                        </p>
                        <h1 className="font-heading font-bold text-3xl sm:text-4xl text-black capitalize mt-4">
                          {title || "Untitled Listing"}
                        </h1>
                        <p className="font-content text-lg flex items-center text-gray-600 mt-2">
                          <FaLocationArrow className="text-brand-blue mr-2" />
                          {address || "Address not available"}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={handleUrlShare}
                          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                          title="Share listing"
                        >
                          <FaShare className="text-brand-blue" />
                        </button>
                        <button
                          onClick={handleSaveListing}
                          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                          title={savedListing ? "Remove from saved" : "Save listing"}
                        >
                          <FaBookmark className={savedListing ? "text-green-600" : "text-brand-blue"} />
                        </button>
                      </div>
                    </div>

                    {/* Key Features */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <FaBed className="text-brand-blue text-xl mb-2" />
                        <p className="font-heading text-lg">{bed || "0"} Beds</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <FaBath className="text-brand-blue text-xl mb-2" />
                        <p className="font-heading text-lg">{bath || "0"} Baths</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <BiSolidArea className="text-brand-blue text-xl mb-2" />
                        <p className="font-heading text-lg">{formatArea(area)}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <BsHospital className="text-brand-blue text-xl mb-2" />
                        <p className="font-heading text-lg">{getParkingDescription(parking)}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                      <h2 className="font-heading text-2xl font-bold mb-4">Description</h2>
                      <p className="font-content text-gray-600 leading-relaxed">
                        {description || "No description available"}
                      </p>
                    </div>

                    {/* Property Details */}
                    <div className="mb-8">
                      <h2 className="font-heading text-2xl font-bold mb-4">Property Details</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <p className="text-gray-600">Property Type</p>
                            <p className="font-medium">{housetype || "Not specified"}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Built Year</p>
                            <p className="font-medium">{builtyear || "Not specified"} B.S</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Road Size</p>
                            <p className="font-medium">{Road || "Not specified"} Ft.</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Living Rooms</p>
                            <p className="font-medium">{living || "Not specified"}</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <p className="text-gray-600">Total Flats</p>
                            <p className="font-medium">{BHK || "Not specified"}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Furnished</p>
                            <p className="font-medium">{furnished ? "Yes" : "No"}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Condition</p>
                            <p className="font-medium">{getOverallCondition(condition)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="mb-8">
                      <h2 className="font-heading text-2xl font-bold mb-4">Amenities</h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {renderAmenity(school, "School")}
                        {renderAmenity(hospital, "Hospital")}
                        {renderAmenity(transpotation, "Transportation")}
                        {renderAmenity(elevator, "Elevator")}
                        {renderAmenity(gym, "Gym")}
                        {renderAmenity(park, "Park")}
                      </div>
                    </div>

                    {/* Architecture Design Images */}
                    {listings.architectureUrl && listings.architectureUrl.length > 0 && (
                      <div className="mb-8">
                        <h2 className="font-heading text-2xl font-bold mb-4">Architecture Design</h2>
                        <Slider {...mainSliderSettings} className="z-10 relative">
                          {listings.architectureUrl.map((listing, index) => (
                            <div
                              key={index}
                              className="h-[400px] content-center mx-auto z-10"
                            >
                              <img
                                className="object-cover w-full h-full rounded-lg"
                                src={listing} 
                                alt="architecture design"
                              />
                            </div>
                          ))}
                        </Slider>
                      </div>
                    )}

                    {/* Map Section */}
                    {lat && lng && !isNaN(lat) && !isNaN(lng) ? (
                      <div className="mb-8">
                        <h2 className="font-heading text-2xl font-bold mb-4">Location</h2>
                        <div className="h-[400px] rounded-lg overflow-hidden">
                          <MapContainer
                            center={[lat, lng]}
                            zoom={13}
                            scrollWheelZoom={false}
                            style={{ height: "100%", width: "100%" }}
                          >
                            <TileLayer
                              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={[lat, lng]}>
                              <Popup>{address || "Location"}</Popup>
                            </Marker>
                          </MapContainer>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-8">
                        <h2 className="font-heading text-2xl font-bold mb-4">Location</h2>
                        <div className="h-[200px] bg-gray-100 rounded-lg flex items-center justify-center">
                          <p className="text-gray-500">Location not available</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4">
                  <div className="sticky top-8">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                      <div className="mb-6">
                        <h2 className="font-heading text-2xl font-bold mb-2">Price</h2>
                        {discountPrice && (
                          <p className="text-3xl font-bold text-brand-blue">
                            {formatPrice(discountPrice)}
                          </p>
                        )}
                        <p className={`${discountPrice ? 'text-lg text-gray-500 line-through' : 'text-3xl font-bold text-brand-blue'}`}>
                          {formatPrice(price)}
                        </p>
                      </div>

                      <div className="mt-8 space-y-4">
                        {currentUser && currentUser.email ? (
                          isOwner ? (
                            // Show Update and My All Posts buttons for the owner
                            <div className="space-y-4">
                              <button
                                onClick={() => navigate(`/update_post/${listings._id}`)}
                                className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                              >
                                <FaEdit className="text-lg" />
                                Update Listing
                              </button>
                              <button
                                onClick={() => navigate("/profile")}
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                              >
                                <FaList className="text-lg" />
                                My All Posts
                              </button>
                            </div>
                          ) : (
                            // Show contact form for other users
                            <Contact listing={listings} loadingState={loading} />
                          )
                        ) : (
                          // Show login button for non-logged in users
                          <button
                            onClick={() => navigate("/login")}
                            className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2"
                          >
                            <FaLock />
                            Login to Contact
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ToastContainer />
        </div>
      )}
    </>
  );
};

export default ListingPage;
