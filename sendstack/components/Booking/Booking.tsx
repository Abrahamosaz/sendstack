"use client";

import React, { useState, useEffect, useRef } from "react";
import "./Booking.css";
import getLocations, { dataObjects, localsObjects } from "@/utils/fetchdata";
import getPricelocation, { priceInfo } from "@/utils/getPricelocation";
import Pricedashboard from "@/components/Pricedashboard/Pricedashboard";
import Image from "next/image";
import { GrAdd } from 'react-icons/gr';
import carLogo from "@/public/car.png";
import rider from "@/public/rider.avif";
import rider1 from "@/public/rider2.webp";


export type propDropinfo = {
  dropofflocname: string,
  price: number
}

const BookingPage = () => {
  const initialvalue: any = [];
  const [toggle, setToggle] = useState(false)
  const initialPickupSelectvalue: localsObjects = {
    name: "",
    locationCode: "",
    isAvailable: false,
  };

  const initalpriceInfo: {
    pickuplocname: string,
    dropoff: propDropinfo[],
  } = { pickuplocname: '', dropoff: []};

  const initilaDropoffSelectValue: localsObjects = {
    name: "",
    locationCode: "",
    isAvailable: false,
  };
  const [locationData, setLocationData] = useState({
    state: "",
    locals: initialvalue,
  });
  const [pickupselectValue, setPickupSelectValue] = useState(
    initialPickupSelectvalue
  );
  const [dropoffselectValue, setDropoffSelectValue] = useState([
    initilaDropoffSelectValue,
  ]);
  const [pickupdate, setPickupdate] = useState('');
  const [locpriceInfo, setLocpriceInfo] = useState(initalpriceInfo);
  const [bookingRendercounter, setBookingrendercounter] = useState(0);

  const getData: (url: string) => Promise<void> = async (url) => {
    const res: dataObjects[] = await getLocations(url);
    const newLocals: localsObjects[] = [{
      name: 'Select a location',
      locationCode: '',
      isAvailable: false
    }, ...res[0]?.locals];
    console.log(newLocals);
    setLocationData({ state: res[0]?.state, locals: newLocals });
  };

  useEffect(() => {
    const url = "https://sandbox.sendstack.africa/api/v1/locations";
    getData(url);
  }, []);

  useEffect(() => {
    // This useEffect hook will re-render the BookingPage component
    // whenever dashboardRenderCounter changes.
  }, [bookingRendercounter]);

  const addSelection: () => void = () => {
    setDropoffSelectValue((prevValue) => [
      ...prevValue,
      {
        name: "",
        locationCode: "",
        isAvailable: false,
      },
    ]);
  };

  const handlePickUpChange: (locationName: string) => void = (
    locationName: string
  ) => {
    const locationObj: localsObjects = locationData.locals.find(
      (obj: localsObjects) => obj.name === locationName
    );
    setPickupSelectValue({
      name: locationName,
      locationCode: locationObj.locationCode,
      isAvailable: locationObj.isAvailable,
    });
  };

  const handleDropOffChange = (locationName: string, index: number) => {
    const locationObj: localsObjects = locationData.locals.find(
      (obj: localsObjects) => obj.name === locationName
    );
    setDropoffSelectValue((prevValue: localsObjects[]): localsObjects[] => {
      const newDropoffSelectValue = [...prevValue]; // Create a new array to avoid direct modification
      // Update the specific index with the new selected value
      newDropoffSelectValue[index] = {
        name: locationName,
        locationCode: locationObj.locationCode,
        isAvailable: locationObj.isAvailable,
      };
      return newDropoffSelectValue;
    });
  };

  // console.log('pickupdate', pickupdate);

  const handleOrder = () => {
    dropoffselectValue.map((loc) => {
      if (loc) {
        getPricelocation(
          'https://sandbox.sendstack.africa/api/v1/deliveries/price',
          pickupselectValue.locationCode,
          loc.locationCode,
          pickupdate
          )
          .then((res) => {
            setLocpriceInfo({
              pickuplocname: pickupselectValue.name,
              dropoff: [{
                dropofflocname: loc.name,
                price: res.data.price
              }]
            });
          })
          .catch((err) => console.log(err));
      }
    })

  }

  return (
    <>
    <div className="booking__container">
      <div className="booking__content">
        <section className="logo_section">
          <div className="logo__section__text">
            <p>Place ride order</p>
            <h1>Book a Delivery Ride from {locationData.state}</h1>
          </div>
          <Image src={rider1} width={300} height={200} alt="Booking car logo" />
        </section>
        <section className="booking_section">
          <div className="pickup_location">
            <p>From</p>
            <select
              className="select_location"
              name="pickuplocation"
              value={pickupselectValue.name}
              onChange={(e) => {
                handlePickUpChange(e.target.value);
              }}
            >
              {locationData &&
                locationData.locals.map(
                  (local: localsObjects, index: number) => {
                    return (
                      <option key={index} value={local.name}>
                        {local.name}
                      </option>
                    );
                  }
                )}
            </select>
          </div>
          <div className="delivery_location">
            <p>To</p>
            {/* <button onClick={addSelection}> add dropoff location</button> */}
            <div className="delivery_style_location">
              <div className="dropoff_location">
              {dropoffselectValue &&
                dropoffselectValue.map((select: localsObjects, index: number) => {
                  return (
                    <select
                      className="delivery_location"
                      key={index}
                      onChange={(e) => handleDropOffChange(e.target.value, index)}
                    >
                      {locationData &&
                        locationData.locals.map(
                          (local: localsObjects, index: number) => {
                            return (
                              <option key={index} value={local.name}>
                                {local.name}
                              </option>
                            );
                          }
                        )}
                    </select>
                  );
                })}
               </div>
              <div className="select_icon" onClick={addSelection}>
                <GrAdd />
                <p>Add</p>
              </div>
              <div>select a Pickup date:</div>
              <input type='date' className="pickup_date"
              value={pickupdate}
              data-date-format="YYYY-MM-DD"
              onChange={(e) => setPickupdate(e.target.value)}></input>
              <div className="place_order_container">
                <button className="place_order" onClick={handleOrder}>Book Ride</button>
              </div>
            </div>
          </div>
        </section>  
      </div>
    </div>
    {locpriceInfo.dropoff? <Pricedashboard pickuploc={locpriceInfo.pickuplocname}
     dropoffloc={locpriceInfo.dropoff} renderCounter={bookingRendercounter}
     rendercounterFunc={setBookingrendercounter}/>: <div></div>}
    </>
  );
};

export default BookingPage;
