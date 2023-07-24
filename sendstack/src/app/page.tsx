"use client";

import BookingPage from "@/components/Booking/Booking";
import Navbar from "@/components/Navbar/Navbar";
import React, { createContext, useContext, useEffect, useState } from "react";
import "./page.css";
import PickupModal from "@/components/Modal/PickupModal";
import { toast, ToastContainer } from "react-toastify";

const page = () => {
  return (
    <>
      <div className="App">
        <Navbar />
        <BookingPage />
      </div>
    </>
  );
};

export default page;
