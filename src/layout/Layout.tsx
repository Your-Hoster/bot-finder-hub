
import { Outlet } from 'react-router-dom';
import { Layout as LayoutComponent } from '@/components/layout/Layout';

const Layout = () => {
  return (
    <LayoutComponent>
      <Outlet />
    </LayoutComponent>
  );
};

export default Layout;
