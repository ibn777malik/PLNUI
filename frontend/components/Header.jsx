// frontend/components/Header.jsx
import Link from 'next/link';

const Header = () => (
  <header className="bg-black text-white p-4 flex justify-between items-center">
    <h1 className="text-xl font-bold">Planet Land Real Estate</h1>
    <Link href="/login" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white text-sm">
      Login
    </Link>
  </header>
);

export default Header;