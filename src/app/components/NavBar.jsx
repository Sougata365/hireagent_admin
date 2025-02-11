import Link from "next/link";

const NavBar = () => {
  return (
    <nav className="bg-gray-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">MyApp</h1>
        <div className="space-x-4">
          <Link href="/" className="hover:text-gray-400">
            Dashboard
          </Link>
          <Link href="/add-assistant" className="hover:text-gray-400">
            Add Assistant
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
