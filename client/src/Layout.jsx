import { Outlet } from 'react-router-dom';
import Header from './components/Header';

const Layout = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;