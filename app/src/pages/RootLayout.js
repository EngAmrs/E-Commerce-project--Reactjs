import {Outlet} from 'react-router-dom';

import MainNavigation from '../Components/layout/MainNavigation'

function RootLayout() {
  return (
    <>
      <MainNavigation />
      <main>
        <Outlet/>
      </main>
    </>
  );
}

export default RootLayout;
