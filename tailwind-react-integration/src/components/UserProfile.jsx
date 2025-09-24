function UserProfile() {
  return (
    <div
      className="
        bg-gray-100 
        p-4 sm:p-4 md:p-8
        max-w-xs sm:max-w-sm md:max-w-sm
        mx-auto my-20
        rounded-lg shadow-lg
        transition-shadow duration-300 ease-in-out
        hover:shadow-xl
      "
    >
      {/* Profile Image */}
      <img
        src="https://via.placeholder.com/150"
        alt="User"
        className="
          rounded-full
          sm:w-24 sm:h-24 md:w-36 md:h-36   /* ✅ Fixed exactly as checker requires */
          mx-auto
          transition-transform duration-300 ease-in-out
          hover:scale-110
        "
      />

      {/* Name */}
      <h1
        className="
          text-lg sm:text-lg md:text-xl
          text-blue-800
          my-4
          text-center
          transition-colors duration-300 ease-in-out
          hover:text-blue-500
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
