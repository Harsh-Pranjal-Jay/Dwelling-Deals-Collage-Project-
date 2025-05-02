import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "../supabaseClient";
import Loading from "../components/Loading";
import MapComponent from "../components/MapComponent";

const UpdatePost = () => {
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
    architectureUrl: [],
  });
  const [dataLoading, setDataLoading] = useState(false);
  const [propertyType, setPropertyType] = useState("rent");
  const [location, setLocation] = useState({ lat: null, lng: null });

  const navigate = useNavigate();
  const params = useParams();

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

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

  //===Load Post informations here===//
  useEffect(() => {
    const getPostInfo = async () => {
      setDataLoading(true);
      const res = await fetch(`/api/posts/${params.id}`);
      const data = await res.json();

      if (data.success === false) {
        toast.error(data.message, {
          autoClose: 2000,
        });
        setDataLoading(false);
      } else {
        setFeildValue(data);
        setFormData({ ...formData, imgUrl: data.imgUrl, architectureUrl: data.architectureUrl });
        data.offer && setIsoffer(true);
        setDataLoading(false);
      }
    };
    getPostInfo();
  }, []);

  const setFeildValue = (data) => {
    setValue("title", data.title);
    setValue("description", data.description);
    setValue("address", data.address);
    setValue("type", data.type);
    setValue("area", data.area && data.area);
    setValue("bath", data.bath);
    setValue("bed", data.bed);
    setValue("furnished", data.furnished);
    setValue("parking", data.parking);
    setValue("offer", data.offer);
    setValue("price", data.price);
    setValue("discountPrice", data.discountPrice);
    setValue("living", data.living);
    setValue("kitchen", data.kitchen);
    setValue("BHK", data.BHK);
    setValue("builtyear", data.builtyear);
    setValue("Road", data.Road);
    setValue("condition", data.condition);
    setValue("Yourarea", data.Yourarea);
    setValue("housetype", data.housetype);
    setValue("direction", data.direction);
  };

  const handleImageUpload = async () => {
    if (imageFile.length > 0 && imageFile.length + formData.imgUrl.length < 7) {
      setLoading(true);
      
      const promises = [];
      for (let i = 0; i < imageFile.length; i++) {
        promises.push(uploadToSupabase(imageFile[i]));
      }
      for (let i = 0; i < promises.length; i++) {
        setFormData({ ...formData, imgUrl: formData.imgUrl.concat(promises[i]) });
      }
      setLoading(false);
    } 
    setLoading(false);
  };

  const uploadToSupabase = async (file) => {
    const fileExtension = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExtension}`;
    const filePath = `${fileName}`;
    let { data, error } = await supabase.storage.from("images").upload(filePath, file);
    try {
      if (error) {
        throw error;
      } else {
        const { data: url } = await supabase.storage
          .from("images")
          .getPublicUrl(filePath);
        if (url) {
          return url.publicUrl;
        } else {
          error("Failed to get public URL");
        }
      }
    } catch (error) {
      setUploadError({
        ...uploadError,
        isError: true,
        message: error.message,
      });
    }
  };

  const handleDelete = (index, name) => {
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

  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
  };

  const handleFormSubmit = async (data) => {
    try {
      setFormSubmitLoading(true);
      const res = await fetch(`/api/posts/update/${params.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          status: "pending",
          imgUrl: formData.imgUrl,
          architectureUrl: formData.architectureUrl,
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

  if (dataLoading) {
    return <Loading />;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Update Listing
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
                      Address
                    </label>
                    <input
                      id="address"
                      type="text"
                      placeholder="Enter property address"
                      name="address"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                      {...register("address", {
                        required: "This field is required*"
                      })}
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.address.message}
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                      Property Type
                    </label>
                    <select
                      id="type"
                      name="type"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                      {...register("type", {
                        required: "This field is required*"
                      })}
                      onChange={handlePropertyTypeChange}
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
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="form-group">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <div className="flex items-center">
                      <span className="flex items-center bg-gray-800 text-white px-3 py-2 rounded-l-lg">Rs.</span>
                      <input
                        id="price"
                        type="number"
                        placeholder="Enter price"
                        name="price"
                        className="w-full px-4 py-3 rounded-r-lg border border-gray-300 bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                        {...register("price", {
                          required: "This field is required*",
                          min: {
                            value: 0,
                            message: "Price must be greater than 0*"
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

                  <div className="form-group">
                    <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                      Area (sq ft)
                    </label>
                    <input
                      id="area"
                      type="number"
                      placeholder="Enter area in square feet"
                      name="area"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                      {...register("area", {
                        required: "This field is required*",
                        min: {
                          value: 250,
                          message: "Area must be at least 250 sq ft*"
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
                      placeholder="Enter number of bedrooms"
                      name="bed"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                      {...register("bed", {
                        required: "This field is required*",
                        min: {
                          value: 1,
                          message: "Number of bedrooms must be at least 1*"
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
                      placeholder="Enter number of bathrooms"
                      name="bath"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                      {...register("bath", {
                        required: "This field is required*",
                        min: {
                          value: 1,
                          message: "Number of bathrooms must be at least 1*"
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
                      placeholder="Enter number of living rooms"
                      name="living"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                      {...register("living", {
                        required: "This field is required*",
                        min: {
                          value: 1,
                          message: "Number of living rooms must be at least 1*"
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
                      placeholder="Enter number of kitchens"
                      name="kitchen"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                      {...register("kitchen", {
                        required: "This field is required*",
                        min: {
                          value: 1,
                          message: "Number of kitchens must be at least 1*"
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
                      placeholder="Enter total BHK"
                      name="BHK"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                      {...register("BHK", {
                        required: "This field is required*",
                        min: {
                          value: 1,
                          message: "Total BHK must be at least 1*"
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
                      placeholder="Enter built year"
                      name="builtyear"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                      {...register("builtyear", {
                        required: "This field is required*",
                        validate: {
                          notFutureYear: (value) =>
                            value <= new Date().getFullYear() + 57 ||
                            "Built year cannot be in the future*",
                        },
                      })}
                    />
                    {errors.builtyear && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.builtyear.message}
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="Road" className="block text-sm font-medium text-gray-700 mb-1">
                      Road Size (feet)
                    </label>
                    <input
                      id="Road"
                      type="number"
                      placeholder="Enter road size in feet"
                      name="Road"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                      {...register("Road", {
                        required: "This field is required*",
                        min: {
                          value: 0,
                          message: "Road size must be greater than 0*"
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
                    <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                      Overall Condition (1-10)
                    </label>
                    <input
                      id="condition"
                      type="number"
                      placeholder="Enter condition rating (1-10)"
                      name="condition"
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
                    <label htmlFor="Yourarea" className="block text-sm font-medium text-gray-700 mb-1">
                      Select Your Area
                    </label>
                    <select
                      id="Yourarea"
                      name="Yourarea"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                      {...register("Yourarea", {
                        required: "This field is required*"
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
                    <label htmlFor="housetype" className="block text-sm font-medium text-gray-700 mb-1">
                      House Type
                    </label>
                    <select
                      id="housetype"
                      name="housetype"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                      {...register("housetype", {
                        required: "This field is required*"
                      })}
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
                      name="direction"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                      {...register("direction", {
                        required: "This field is required*"
                      })}
                    >
                      <option value="" disabled>Select direction</option>
                      <option value="East">East</option>
                      <option value="West">West</option>
                      <option value="North">North</option>
                      <option value="South">South</option>
                      <option value="South West">South West</option>
                      <option value="South East">South East</option>
                      <option value="North East">North East</option>
                    </select>
                    {errors.direction && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.direction.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Amenities Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div className="form-group">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="hospital"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        {...register("hospital")}
                      />
                      <span className="text-sm font-medium text-gray-700">Hospital</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="transpotation"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        {...register("transpotation")}
                      />
                      <span className="text-sm font-medium text-gray-700">Transportation</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="school"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        {...register("school")}
                      />
                      <span className="text-sm font-medium text-gray-700">School</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="elevator"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        {...register("elevator")}
                      />
                      <span className="text-sm font-medium text-gray-700">Elevator</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="gym"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        {...register("gym")}
                      />
                      <span className="text-sm font-medium text-gray-700">Gym</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="park"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        {...register("park")}
                      />
                      <span className="text-sm font-medium text-gray-700">Park</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="restaurants"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        {...register("restaurants")}
                      />
                      <span className="text-sm font-medium text-gray-700">Restaurants</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Additional Features */}
              <div className="grid gap-6 md:grid-cols-3">
                <div className="form-group">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="furnished"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      {...register("furnished")}
                    />
                    <span className="text-sm font-medium text-gray-700">Furnished</span>
                  </label>
                </div>

                <div className="form-group">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="offer"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      {...register("offer")}
                      onChange={(e) => setIsoffer(e.target.checked)}
                    />
                    <span className="text-sm font-medium text-gray-700">Offer</span>
                  </label>
                </div>
              </div>

              {isOffer && (
                <div className="form-group">
                  <label htmlFor="discountPrice" className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Price
                  </label>
                  <input
                    id="discountPrice"
                    type="number"
                    placeholder="Enter discount price"
                    name="discountPrice"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-800 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                    {...register("discountPrice", {
                      required: "This field is required when offer is selected*",
                      min: {
                        value: 0,
                        message: "Discount price must be greater than 0*"
                      }
                    })}
                  />
                  {errors.discountPrice && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.discountPrice.message}
                    </p>
                  )}
                </div>
              )}

              {/* Image Upload Section */}
              <div className="space-y-6">
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Images
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <button
                      type="button"
                      onClick={handleImageUpload}
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                      {loading ? "Uploading..." : "Upload"}
                    </button>
                  </div>
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.imgUrl.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Property ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleDelete(index, "houseImage")}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Architecture Images
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => setArchitectureFile(e.target.files)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <button
                      type="button"
                      onClick={handleImageUpload}
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                      {loading ? "Uploading..." : "Upload"}
                    </button>
                  </div>
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.architectureUrl.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Architecture ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleDelete(index, "architecture")}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Map Component */}
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <MapComponent onLocationSelect={handleLocationSelect} />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={formSubmitLoading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {formSubmitLoading ? "Updating..." : "Update Listing"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <ToastContainer />
    </main>
  );
};

export default UpdatePost;
