import Navbar from "@/components/Navbar/Navbar";
import BookingPage from "@/components/Booking/Booking";
import "./page.css";

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
