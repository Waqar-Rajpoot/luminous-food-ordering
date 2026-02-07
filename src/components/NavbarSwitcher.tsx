import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options"; 
import AdminNavbar from "./AdminSidebar";
import Header from "./Header";


export default async function NavbarSwitcher() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  if (role === "admin") {
    return <AdminNavbar />;
  }

  return <Header />;
}