const teamMembers = [
  {
    name: "Harsh Patel",
    role: "Machine Learning and Cybersecurity Enthusiast",
    description:
      "Passionate about ML and security, Harsh is the brain behind our house price prediction feature.",
    image: "https://ldpbtlkehwfdwercibyo.supabase.co/storage/v1/object/public/images//WhatsApp%20Image%202025-04-13%20at%2016.32.02.jpeg",
  },
  {
    name: "Pranjal Parmar",
    role: "UI/UX Designer",
    description:
      "Pranjal crafts intuitive and visually appealing designs to enhance the user experience on Dwelling Deals.",
    image: "https://ldpbtlkehwfdwercibyo.supabase.co/storage/v1/object/public/images//WhatsApp%20Image%202025-04-05%20at%2015.04.33.jpeg", 
  },
  {
    name: "Jay Patel",
    role: "Full Stack Developer",
    description:
      "Jay ensures the seamless integration of front-end and back-end technologies for Dwelling Deals.",
    image: "https://ldpbtlkehwfdwercibyo.supabase.co/storage/v1/object/public/images//WhatsApp%20Image%202025-04-05%20at%2015.05.23.jpeg",
  },
];

const Team = () => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-6 lg:px-8">
        <h2 className="text-5xl font-bold text-center text-gray-800 mb-12">
          Meet Our Team
        </h2>
        <div className="grid gap-12 lg:grid-cols-3 sm:grid-cols-1">
          {/* Team Members Cards */}
          {teamMembers.map((member, index) => (
            <a
              key={index}// Link to the Facebook profile
              target="_blank" // Opens the link in a new tab
              rel="noopener noreferrer" // Security measure for opening in a new tab
              className="block"
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl">
                <img
                  className="w-full h-80 object-cover"
                  src={member.image}
                  alt={member.name}
                />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-gray-800">
                    {member.name}
                  </h3>
                  <p className="text-gray-600 mt-2">{member.role}</p>
                  <p className="mt-4 text-gray-700">{member.description}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;
