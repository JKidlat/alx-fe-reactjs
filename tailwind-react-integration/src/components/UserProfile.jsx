function UserProfile() {
  return (
    <div
      className="
        bg-gray-100 
        p-4 sm:p-6 md:p-8
        max-w-xs sm:max-w-sm
        mx-auto my-10 sm:my-16 md:my-20
        rounded-lg shadow-lg
        transition-shadow duration-300 ease-in-out
        hover:shadow-xl       /* Lift effect on hover */
      "
    >
      {/* Profile Image */}
      <img
        src="https://via.placeholder.com/150"
        alt="User"
        className="
          rounded-full
          w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36
          mx-auto
          transition-transform duration-300 ease-in-out
          hover:scale-110       /* Slight zoom on hover */
        "
      />

      {/* Name */}
      <h1
        className="
          text-lg sm:text-xl
          text-blue-800
          my-3 sm:my-4
          text-center
          transition-colors duration-300 ease-in-out
          hover:text-blue-500   /* Color change on hover */
        "
      >
        John Doe
      </h1>

      {/* Bio */}
      <p
        className="
          text-gray-600
          text-sm sm:text-base
          text-center
        "
      >
        Developer at Example Co. Loves to write code and explore new technologies.
      </p>
    </div>
  );
}

export default UserProfile;
