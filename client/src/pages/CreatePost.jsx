import { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import { ToastContainer, toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MapComponent from "../components/MapComponent";

const CreatePost = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [imageFile, setImageFile] = useState([]);
  const [architectureFile, setArchitectureFile] = useState([]);
  const [uploadError, setUploadError] = useState({
    isError: false,
    message: "",
  });
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const [isOffer, setIsoffer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    imgUrl: [],
    architectureUrl: []
  });

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const [location, setLocation] = useState({ lat: null, lng: null });
  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
  };
  
  const images = [];
  const architectureImages = [];
  const handleImageUpload = async () => {
    setLoading(true);
    setUploadError({ isError: false, message: "" });
    try {
      if (imageFile.length > 0) {
        for (let i = 0; i < imageFile.length; i++) {
          const file = imageFile[i];
          
          // Validate file type
          if (!file.type.startsWith('image/')) {
            throw new Error(`File ${file.name} is not an image`);
          }
          
          // Validate file size (max 5MB)
          if (file.size > 5 * 1024 * 1024) {
            throw new Error(`File ${file.name} is too large. Maximum size is 5MB`);
          }

          const fileExtension = file.name.split(".").pop();
          const fileName = `${Math.random()}.${fileExtension}`;
          const filePath = `${fileName}`;
          
          const { data, error } = await supabase.storage
            .from("images")
            .upload(filePath, file);

          if (error) throw error;

          const { data: urlData } = await supabase.storage
            .from("images")
            .getPublicUrl(filePath);

          if (!urlData || !urlData.publicUrl) {
            throw new Error(`Failed to get public URL for ${file.name}`);
          }

          setFormData(prev => ({
            ...prev,
            imgUrl: [...prev.imgUrl, urlData.publicUrl]
          }));
        }
        setImageFile([]);
        toast.success("Images uploaded successfully");
      }

      if (architectureFile.length > 0) {
        for (let i = 0; i < architectureFile.length; i++) {
          const file = architectureFile[i];
          const fileExtension = file.name.split(".").pop();
          const fileName = `${Math.random()}.${fileExtension}`;
          const filePath = `${fileName}`;
          
          const { data, error } = await supabase.storage
            .from("images")
            .upload(filePath, file);

          if (error) throw error;

          const { data: urlData } = await supabase.storage
            .from("images")
            .getPublicUrl(filePath);

          if (urlData) {
            setFormData(prev => ({
              ...prev,
              architectureUrl: [...prev.architectureUrl, urlData.publicUrl]
            }));
          }
        }
        setArchitectureFile([]);
      }
    } catch (error) {
      setUploadError({
        isError: true,
        message: error.message,
      });
      toast.error(error.message, {
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (index,name) => {
    if (name === "houseImage") {
      setFormData({
        ...formData,
        imgUrl: formData.imgUrl.filter(
          (items) => items != formData.imgUrl[index]
        ),
      });
    }
    if (name === "architecture") {
      setFormData({
        ...formData,
        architectureUrl: formData.architectureUrl.filter(
          (items) => items != formData.architectureUrl[index]
        ),
      });
    }
  };

  uploadError.isError &&
    toast.error(uploadError.message, {
      autoClose: 2000,
    });

  const handleFormSubmit = async (data) => {
    try {
      console.log("Form data - ", data);
      setFormSubmitLoading(true);
      const res = await fetch("api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          status: "pending",
          imgUrl: formData.imgUrl,
          architectureUrl: formData.architectureUrl,
          location: location,
          userRef: currentUser._id,
        }),
      });
      const serverRes = await res.json();
      if (serverRes.success === false) {
        toast.error(serverRes.message, {
          autoClose: 2000,
        });
        setFormSubmitLoading(false);
      } else {
        navigate(`/listing/${serverRes._id}`);
        setFormSubmitLoading(false);
      }
    } catch (error) {
      toast.error(error.message, {
        autoClose: 2000,
      });
      setFormSubmitLoading(false);
    }
  };
  // Other states
  const [propertyType, setPropertyType] = useState("rent"); // State for dropdown
  // Watch the propertyType value from react-hook-form
  const watchedPropertyType = watch("type", propertyType);

  // Sync useState with react-hook-form when watchedPropertyType changes
  useEffect(() => {
    setPropertyType(watchedPropertyType);
  }, [watchedPropertyType]);

  // Function to handle dropdown change
  const handlePropertyTypeChange = (e) => {
    setPropertyType(e.target.value);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Create a New Listing
            </h1>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
              <div className="grid gap-8 md:grid-cols-2">
                {/* Left Column */}
                <div className="space-y-6">
                  <div className="form-group">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Property Name
                    </label>
                    <input
                      id="title"
                      type="text"
                      placeholder="Enter property name"
                      name="title"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                      {...register("title", {
                        required: "This field is required*",
                        minLength: {
                          value: 8,
                          message: "Title must be at least 8 characters*"
                        },
                        maxLength: {
                          value: 50,
                          message: "Title cannot exceed 50 characters*"
                        }
                      })}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Property Description
                    </label>
                    <textarea
                      id="description"
                      placeholder="Enter property description"
                      name="description"
                      rows="4"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                      {...register("description", {
                        required: "This field is required*",
                        minLength: {
                          value: 20,
                          message: "Description must be at least 20 characters*"
                        },
                        maxLength: {
                          value: 1000,
                          message: "Description cannot exceed 1000 characters*"
                        }
                      })}
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Property Address
                    </label>
                    <input
                      id="address"
                      type="text"
                      placeholder="Enter property address"
                      name="address"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                      {...register("address", {
                        required: "This field is required*",
                      })}
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.address.message}
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
                      Property Type
                    </label>
                    <select
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                      name="type"
                      id="propertyType"
                      value={propertyType}
                      onChange={handlePropertyTypeChange}
                      {...register("type", {
                        required: "This field is required*",
                      })}
                    >
                      <option value="rent">Rent</option>
                      <option value="sale">Sale</option>
                    </select>
                    {errors.type && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.type.message}
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                      Area (sqft)
                    </label>
                    <input
                      id="area"
                      type="number"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                      {...register("area", {
                        required: "This field is required*",
                        min: {
                          value: 250,
                          message: "Area must be at least 250 sqft*"
                        },
                        max: {
                          value: 10000,
                          message: "Area cannot exceed 10000 sqft*"
                        }
                      })}
                    />
                    {errors.area && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.area.message}
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="bed" className="block text-sm font-medium text-gray-700 mb-1">
                      Bedrooms
                    </label>
                    <input
                      id="bed"
                      type="number"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                      {...register("bed", {
                        required: "This field is required*",
                        min: {
                          value: 1,
                          message: "Must have at least 1 bedroom*"
                        },
                        max: {
                          value: 20,
                          message: "Cannot have more than 20 bedrooms*"
                        }
                      })}
                    />
                    {errors.bed && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.bed.message}
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="bath" className="block text-sm font-medium text-gray-700 mb-1">
                      Bathrooms
                    </label>
                    <input
                      id="bath"
                      type="number"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                      {...register("bath", {
                        required: "This field is required*",
                        min: {
                          value: 1,
                          message: "Must have at least 1 bathroom*"
                        },
                        max: {
                          value: 10,
                          message: "Cannot have more than 10 bathrooms*"
                        }
                      })}
                    />
                    {errors.bath && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.bath.message}
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="living" className="block text-sm font-medium text-gray-700 mb-1">
                      Living Rooms
                    </label>
                    <input
                      id="living"
                      type="number"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                      {...register("living", {
                        required: "This field is required*",
                        min: {
                          value: 1,
                          message: "Must have at least 1 living room*"
                        },
                        max: {
                          value: 5,
                          message: "Cannot have more than 5 living rooms*"
                        }
                      })}
                    />
                    {errors.living && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.living.message}
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="kitchen" className="block text-sm font-medium text-gray-700 mb-1">
                      Kitchen
                    </label>
                    <input
                      id="kitchen"
                      type="number"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                      {...register("kitchen", {
                        required: "This field is required*",
                        min: {
                          value: 1,
                          message: "Must have at least 1 kitchen*"
                        },
                        max: {
                          value: 3,
                          message: "Cannot have more than 3 kitchens*"
                        }
                      })}
                    />
                    {errors.kitchen && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.kitchen.message}
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="BHK" className="block text-sm font-medium text-gray-700 mb-1">
                      Total BHK
                    </label>
                    <input
                      id="BHK"
                      type="number"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                      {...register("BHK", {
                        required: "This field is required*",
                        min: {
                          value: 1,
                          message: "Must be at least 1 BHK*"
                        },
                        max: {
                          value: 10,
                          message: "Cannot be more than 10 BHK*"
                        }
                      })}
                    />
                    {errors.BHK && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.BHK.message}
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="builtyear" className="block text-sm font-medium text-gray-700 mb-1">
                      Built Year
                    </label>
                    <input
                      id="builtyear"
                      type="number"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                      {...register("builtyear", {
                        required: "This field is required*",
                        validate: {
                          notFutureYear: value => {
                            const currentYear = new Date().getFullYear();
                            if (value > currentYear) {
                              return "Built year cannot be in the future*";
                            }
                            if (value < 1800) {
                              return "Built year cannot be before 1800*";
                            }
                            if (value > currentYear + 5) {
                              return "Built year cannot be more than 5 years in the future*";
                            }
                            return true;
                          }
                        }
                      })}
                    />
                    {errors.builtyear && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.builtyear.message}
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="Yourarea" className="block text-sm font-medium text-gray-700 mb-1">
                      Select Your Area
                    </label>
                    <select
                      id="Yourarea"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                      {...register("Yourarea", {
                        required: "This field is required*",
                      })}
                    >
                      <option value="" disabled>Select location</option>
                      <option value="Ahmedabad">Ahmedabad</option>
                      <option value="Surat">Surat</option>
                      <option value="Vadodara">Vadodara</option>
                      <option value="Rajkot">Rajkot</option>
                      <option value="Bhavnagar">Bhavnagar</option>
                      <option value="Jamnagar">Jamnagar</option>
                      <option value="Gandhinagar">Gandhinagar</option>
                      <option value="Junagadh">Junagadh</option>
                      <option value="Anand">Anand</option>
                      <option value="Navsari">Navsari</option>
                      <option value="Mehsana">Mehsana</option>
                      <option value="Morbi">Morbi</option>
                      <option value="Patan">Patan</option>
                      <option value="Porbandar">Porbandar</option>
                      <option value="Valsad">Valsad</option>
                      <option value="Bharuch">Bharuch</option>
                      <option value="Dahod">Dahod</option>
                      <option value="Amreli">Amreli</option>
                      <option value="Nadiad">Nadiad</option>
                      <option value="Bhuj">Bhuj</option>
                      <option value="Gondal">Gondal</option>
                      <option value="Veraval">Veraval</option>
                      <option value="Godhra">Godhra</option>
                      <option value="Palanpur">Palanpur</option>
                      <option value="Surendranagar">Surendranagar</option>
                      <option value="Botad">Botad</option>
                      <option value="Modasa">Modasa</option>
                      <option value="Vapi">Vapi</option>
                      <option value="Himmatnagar">Himmatnagar</option>
                      <option value="Kalol">Kalol</option>
                      <option value="Bardoli">Bardoli</option>
                      <option value="Viramgam">Viramgam</option>
                      <option value="Sanand">Sanand</option>
                      <option value="Dholka">Dholka</option>
                      <option value="Mahuva">Mahuva</option>
                      <option value="Mandvi">Mandvi</option>
                      <option value="Kadi">Kadi</option>
                      <option value="Visnagar">Visnagar</option>
                      <option value="Unjha">Unjha</option>
                      <option value="Sidhpur">Sidhpur</option>
                      <option value="Dhoraji">Dhoraji</option>
                      <option value="Jetpur">Jetpur</option>
                      <option value="Khambhat">Khambhat</option>
                      <option value="Anjar">Anjar</option>
                      <option value="Savarkundla">Savarkundla</option>
                      <option value="Mangrol">Mangrol</option>
                      <option value="Manavadar">Manavadar</option>
                      <option value="Umreth">Umreth</option>
                      <option value="Lunawada">Lunawada</option>
                      <option value="Halol">Halol</option>
                      <option value="Bodeli">Bodeli</option>
                      <option value="Chhota Udaipur">Chhota Udaipur</option>
                      <option value="Dabhoi">Dabhoi</option>
                      <option value="Rajpipla">Rajpipla</option>
                      <option value="Vyara">Vyara</option>
                      <option value="Songadh">Songadh</option>
                      <option value="Idar">Idar</option>
                      <option value="Talaja">Talaja</option>
                      <option value="Mansa">Mansa</option>
                      <option value="Deesa">Deesa</option>
                      <option value="Kheda">Kheda</option>
                      <option value="Kapadvanj">Kapadvanj</option>
                      <option value="Petlad">Petlad</option>
                      <option value="Dhandhuka">Dhandhuka</option>
                      <option value="Wadhwan">Wadhwan</option>
                      <option value="Thangadh">Thangadh</option>
                      <option value="Morva Hadaf">Morva Hadaf</option>
                      <option value="Bayad">Bayad</option>
                      <option value="Kalavad">Kalavad</option>
                      <option value="Ranavav">Ranavav</option>
                      <option value="Jasdan">Jasdan</option>
                      <option value="Gadhada">Gadhada</option>
                      <option value="Bagasara">Bagasara</option>
                      <option value="Dhrol">Dhrol</option>
                      <option value="Keshod">Keshod</option>
                      <option value="Kodinar">Kodinar</option>
                      <option value="Una">Una</option>
                      <option value="Talala">Talala</option>
                      <option value="Maliya">Maliya</option>
                      <option value="Mundra">Mundra</option>
                      <option value="Mandvi (Kutch)">Mandvi (Kutch)</option>
                      <option value="Radhanpur">Radhanpur</option>
                      <option value="Tharad">Tharad</option>
                      <option value="Vijapur">Vijapur</option>
                      <option value="Kheralu">Kheralu</option>
                      <option value="Visavadar">Visavadar</option>
                      <option value="Savli">Savli</option>
                    </select>
                    {errors.Yourarea && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.Yourarea.message}
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="parking" className="block text-sm font-medium text-gray-700 mb-1">
                      Parking (number of cars or if bike then it will be 1)
                    </label>
                    <input
                      id="parking"
                      type="number"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                      {...register("parking", {
                        required: "This field is required*",
                        min: {
                          value: 0,
                          message: "Parking cannot be negative*"
                        },
                        max: {
                          value: 10,
                          message: "Cannot have more than 10 parking spaces*"
                        }
                      })}
                    />
                    {errors.parking && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.parking.message}
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Furnishing Status
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          value="furnished"
                          defaultChecked={true}
                          {...register("furnished", { required: "This field is required*" })}
                          className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">Furnished</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          value="semi-furnished"
                          {...register("furnished", { required: "This field is required*" })}
                          className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">Semi-Furnished</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          value="unfurnished"
                          {...register("furnished", { required: "This field is required*" })}
                          className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">Unfurnished</span>
                      </label>
                    </div>
                    {errors.furnished && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.furnished.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="form-group">
                    <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                      Overall Condition (1 = worst, 5 = good, 10 = excellent)
                    </label>
                    <input
                      id="condition"
                      type="number"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                      {...register("condition", {
                        required: "This field is required*",
                        min: {
                          value: 1,
                          message: "Condition must be at least 1*"
                        },
                        max: {
                          value: 10,
                          message: "Condition cannot exceed 10*"
                        }
                      })}
                    />
                    {errors.condition && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.condition.message}
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="housetype" className="block text-sm font-medium text-gray-700 mb-1">
                      House Type
                    </label>
                    <select
                      id="housetype"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                      {...register("housetype", { required: "Required" })}
                    >
                      <option value="" disabled>Select type</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Bungalow">Bungalow</option>
                      <option value="Cottage">PG</option>
                      <option value="Residential">Residential</option>
                      <option value="Villa">Villa</option>
                    </select>
                    {errors.housetype && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.housetype.message}
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="direction" className="block text-sm font-medium text-gray-700 mb-1">
                      Direction
                    </label>
                    <select
                      id="direction"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                      {...register("direction", {
                        required: "This field is required*",
                      })}
                    >
                      <option value="" disabled>Select direction</option>
                      <option value="East">East</option>
                      <option value="West">West</option>
                      <option value="North">North</option>
                      <option value="South">South</option>
                      <option value="South East">South East</option>
                      <option value="South West">South West</option>
                      <option value="North East">North East</option>
                      <option value="South-West">South-West</option>
                    </select>
                    {errors.direction && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.direction.message}
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="Road" className="block text-sm font-medium text-gray-700 mb-1">
                      Road Size in feet
                    </label>
                    <input
                      id="Road"
                      type="number"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                      {...register("Road", {
                        required: "This field is required*",
                        min: {
                          value: 10,
                          message: "Road size must be at least 10 feet*"
                        },
                        max: {
                          value: 100,
                          message: "Road size cannot exceed 100 feet*"
                        }
                      })}
                    />
                    {errors.Road && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.Road.message}
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <h2 className="text-lg font-medium text-gray-800 mb-4">Amenities</h2>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          {...register("hospital")}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700">Hospital</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          {...register("transpotation")}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700">Transportation</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          {...register("school")}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700">School</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          {...register("elevator")}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700">Elevator</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          {...register("gym")}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700">Gym</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          {...register("park")}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700">Park</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          {...register("restaurants")}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700">Restaurants</span>
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <MapComponent onLocationSelect={handleLocationSelect} />
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Property Images
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors duration-200">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => setImageFile(Array.from(e.target.files))}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                          <svg
                            className="w-8 h-8 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          Click to upload images or drag and drop
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          PNG, JPG, GIF up to 10MB
                        </span>
                      </label>
                    </div>
                    {imageFile.length > 0 && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            {imageFile.length} {imageFile.length === 1 ? 'image' : 'images'} selected
                          </span>
                          <button
                            type="button"
                            onClick={() => setImageFile([])}
                            className="text-sm text-red-500 hover:text-red-700"
                          >
                            Clear all
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {imageFile.map((file, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newFiles = [...imageFile];
                                  newFiles.splice(index, 1);
                                  setImageFile(newFiles);
                                }}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={handleImageUpload}
                          disabled={loading}
                          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <div className="flex items-center justify-center">
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Uploading...
                            </div>
                          ) : (
                            'Upload Images'
                          )}
                        </button>
                      </div>
                    )}
                    {formData.imgUrl.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images</h3>
                        <div className="grid grid-cols-3 gap-2">
                          {formData.imgUrl.map((url, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={url}
                                alt={`Property ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => handleDelete(index, "houseImage")}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Architecture Images
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors duration-200">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => setArchitectureFile(Array.from(e.target.files))}
                        className="hidden"
                        id="architecture-upload"
                      />
                      <label
                        htmlFor="architecture-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                          <svg
                            className="w-8 h-8 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          Click to upload architecture images or drag and drop
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          PNG, JPG, GIF up to 10MB
                        </span>
                      </label>
                    </div>
                    {architectureFile.length > 0 && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            {architectureFile.length} {architectureFile.length === 1 ? 'image' : 'images'} selected
                          </span>
                          <button
                            type="button"
                            onClick={() => setArchitectureFile([])}
                            className="text-sm text-red-500 hover:text-red-700"
                          >
                            Clear all
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {architectureFile.map((file, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newFiles = [...architectureFile];
                                  newFiles.splice(index, 1);
                                  setArchitectureFile(newFiles);
                                }}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={handleImageUpload}
                          disabled={loading}
                          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <div className="flex items-center justify-center">
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Uploading...
                            </div>
                          ) : (
                            'Upload Architecture Images'
                          )}
                        </button>
                      </div>
                    )}
                    {formData.architectureUrl.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Architecture Images</h3>
                        <div className="grid grid-cols-3 gap-2">
                          {formData.architectureUrl.map((url, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={url}
                                alt={`Architecture ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => handleDelete(index, "architecture")}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        {...register("offer")}
                        onChange={() => setIsoffer(!isOffer)}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-red-500 font-medium">Do you have any discount?</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      House Price
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                        Rs.
                      </span>
                      <input
                        id="price"
                        type="number"
                        className="flex-1 rounded-r-lg border border-gray-300 bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 px-4 py-3"
                        {...register("price", {
                          required: "This field is required*",
                          min: {
                            value: 1000,
                            message: "Price must be at least Rs. 1000*"
                          },
                          max: {
                            value: 1000000000,
                            message: "Price cannot exceed Rs. 1,000,000,000*"
                          }
                        })}
                      />
                    </div>
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.price.message}
                      </p>
                    )}
                  </div>

                  {isOffer && (
                    <div className="form-group">
                      <label htmlFor="discountPrice" className="block text-sm font-medium text-gray-700 mb-1">
                        Discount Price
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                          Rs.
                        </span>
                        <input
                          id="discountPrice"
                          type="number"
                          className="flex-1 rounded-r-lg border border-gray-300 bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 px-4 py-3"
                          {...register("discountPrice", {
                            required: "This field is required*",
                            min: {
                              value: 1000,
                              message: "Discount price must be at least Rs. 1000*"
                            },
                            max: {
                              value: 1000000000,
                              message: "Discount price cannot exceed Rs. 1,000,000,000*"
                            },
                            validate: (value) => {
                              const { price } = getValues();
                              if (+price < +value) {
                                return "*Discount price should be lower than regular price";
                              }
                              return true;
                            },
                          })}
                        />
                      </div>
                      {errors.discountPrice && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.discountPrice.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <button
                  type="submit"
                  disabled={formSubmitLoading || formData.imgUrl.length < 1 || formData.architectureUrl.length < 1 || loading}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formSubmitLoading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating Listing...
                    </div>
                  ) : (
                    "Create Listing"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <ToastContainer />
    </main>
  );
}

export default CreatePost;
