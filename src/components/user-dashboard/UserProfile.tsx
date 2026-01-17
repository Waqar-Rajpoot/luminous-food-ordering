"use client";

interface UserData {
  name: string;
  email: string;
  username?: string;
  role?: string;
}

export const UserProfile = ({ user }: { user: UserData }) => {
  // Calculates the first letter of the name or defaults to 'U'
  const placeholderText = user.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="flex items-center justify-center bg-gray-900 font-[Inter]">
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl flex flex-col items-center space-y-6 md:flex-row md:space-x-8 md:space-y-0 w-full border border-gray-700">
        <div className="w-24 h-24 rounded-full border-4 border-[#efa765] shadow-lg flex items-center justify-center flex-shrink-0 bg-slate-700">
          <span className="text-white text-4xl font-bold">
            {placeholderText}
          </span>
        </div>

        <div className="text-center md:text-left space-y-2">
          <h2 className="text-3xl font-bold text-white">
            <span className="text-[#EFA]">Hello</span>, {user.name || "N/A"}
          </h2>
          <p className="text-gray-400"><span className="font-bold text-gray-300">Email:</span> {user.email || "N/A"}</p>
          <p className="text-gray-400"><span className="font-bold text-gray-300">Username: </span>{user.username || "N/A"}</p>
          <span className="mt-3 inline-block px-3 py-1 bg-[#EFA] text-gray-900 text-md font-semibold rounded-full shadow-md">
            Role: {user.role}
          </span>
        </div>
      </div>
    </div>
  );
};
export default UserProfile;
