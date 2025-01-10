import Image from "next/image";
import Dashboard from "./components/Dashboad";
import UserManagement from "./components/UserList";

export default function Home() {
  return (
    <>
      <Dashboard />
      <UserManagement />
    </>
  );
}
