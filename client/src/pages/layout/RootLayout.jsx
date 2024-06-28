import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";

const RootLayout = () => {
  return (
    <>
      <Navbar />
      <div className="pt-20"><Outlet /></div>
    </>
  );
};

export default RootLayout;
