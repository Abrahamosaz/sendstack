import React, { useContext } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { IoMdNotificationsOutline } from "react-icons/io";
import "./Navbar.css";
import Image from "next/image";
import profile from "@/public/profile.png";

const Navbar = () => {
  return (
    <>
      <div className="nav__container">
        <div className="nav__content">
          <div className="nav__input">
            <input type="text" placeholder="Search something..." />
            <AiOutlineSearch />
          </div>
          <div className="nav__profile">
            <IoMdNotificationsOutline size={30} cursor={"pointer"} />
            <div className="nav__profile__div">
              <Image src={profile} alt="" width={42} height={42} />
              <p>Abraham </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
