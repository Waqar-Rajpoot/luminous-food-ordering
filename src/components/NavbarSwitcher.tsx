// // components/NavbarSwitcher.tsx
// import { auth } from "@/auth"; // Your Next-Auth auth function
// import AdminNavbar from "./AdminSidebar";
// import PublicNavbar from "./Header";

// export default async function NavbarSwitcher() {
//   const session = await auth();
//   const role = session?.user?.role;

//   if (role === "admin") {
//     return <AdminNavbar />;
//   }

//   if (role === "manager") {
//     // return <ManagerNavbar />;
//   }
//   return <PublicNavbar />;
// }




// components/NavbarSwitcher.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options"; // Ensure this path is correct
import AdminNavbar from "./AdminSidebar";
import Header from "./Header";
// import ManagerNavbar from "./ManagerNavbar"; // Future import

export default async function NavbarSwitcher() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  if (role === "admin") {
    return <AdminNavbar />;
  }

  if (role === "manager") {
    // return <ManagerNavbar />; 
    return <AdminNavbar />; 
  }

  return <Header />;
}