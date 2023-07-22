"use client"

import React, { useState, useEffect, useRef } from 'react';
import BookingStyle  from '/styles/booking_page.module.css';
import Navbar from '@/components/navbar';
import PriceDashboard from '@/components/priceDashboard';
import getLocations, { dataObjects, localsObjects } from '@/utils/fetchdata';
import Image from 'next/image';
import carLogo from '@/public/car.png';

const BookingPage = () => {
  const initialvalue: any = [];
  const initialPickupSelectvalue: localsObjects = {name: '', locationCode: '', isAvailable: false};
  const initilaDropoffSelectValue : localsObjects = {name: '', locationCode: '', isAvailable: false};
  const [locationData, setLocationData] = useState({ state: '', locals: initialvalue});
  const [pickupselectValue, setPickupSelectValue] = useState(initialPickupSelectvalue);
  const [dropoffselectValue, setDropoffSelectValue] = useState([initilaDropoffSelectValue]);



  const getData: (url: string) => Promise<void> = async (url) => {
    const res: dataObjects[] = await getLocations(url);
    setLocationData({state: res[0]?.state, locals: res[0]?.locals })
  };

  useEffect (() => {
    const url = 'https://sandbox.sendstack.africa/api/v1/locations';
    getData(url);
  }, []);


  const addSelection: () => void = () => {
    setDropoffSelectValue((prevValue) => [
        ...prevValue,
        {
          name: '',
          locationCode: '',
          isAvailable: false
        }
      ]);
  };


  const handlePickUpChange: (locationName: string) => void = (locationName: string) => {
    const locationObj: localsObjects = locationData.locals.find((obj: localsObjects) => obj.name === locationName);
    setPickupSelectValue({
        name: locationName,
        locationCode: locationObj.locationCode,
        isAvailable: locationObj.isAvailable
    });
  };

  const handleDropOffChange = (locationName: string, index: number) => {
    const locationObj: localsObjects = locationData.locals.find((obj: localsObjects) => obj.name === locationName);
    setDropoffSelectValue((prevValue: localsObjects[]): localsObjects[] => {
    const newDropoffSelectValue = [...prevValue]; // Create a new array to avoid direct modification
    // Update the specific index with the new selected value
    newDropoffSelectValue[index] = {
        name: locationName,
        locationCode: locationObj.locationCode,
        isAvailable: locationObj.isAvailable
    };
    return newDropoffSelectValue;
    });
  };

  console.log('pickup location', pickupselectValue);
  console.log('dropoff location', dropoffselectValue);

  return (
    <>
        <Navbar />
        <div className={BookingStyle.container}>
            <div className={BookingStyle.style_section}>
                <section className={BookingStyle.logo_section}>
                    <div>
                        <p>Place ride order</p>
                        <h1>Book a Delivery Ride</h1>
                    </div>
                    <Image 
                    src={carLogo}
                    width={300}
                    height={200}
                    alt="Booking car logo"/>
                </section>
                <section className={BookingStyle.booking_section}>
                    <div className={BookingStyle.pickup_location}>
                        <h3>choose a pick up location from {locationData.state}</h3>
                        <h3>From</h3>
                        <select className={BookingStyle.select_location}
                        name='pickuplocation'
                        value={pickupselectValue.name}
                        onChange={(e) => {handlePickUpChange(e.target.value)}}>
                            {locationData && locationData.locals.map((local: localsObjects, index: number) => {
                                return (
                                    <option key={index} value={local.name}>
                                        {local.name}
                                    </option>
                                )
                            })}

                        </select>
                    </div>
                    <div className={BookingStyle.dropoff_location}>
                        <h3>To</h3>
                        <button onClick={addSelection}> add dropoff location</button>
                        <br/>
                        {dropoffselectValue && dropoffselectValue.map((select: localsObjects, index: number) => {
                            return (
                                <select className={BookingStyle.delivery_location}
                                key={index}
                                onChange={(e) => handleDropOffChange(e.target.value, index)}>
                                    {locationData && locationData.locals.map((local: localsObjects, index: number) => {
                                        return (
                                        <option key={index} value={local.name}>
                                            {local.name}
                                        </option>
                                    )
                                    })}
                                </select>
                            );
                        })}
                    </div>
                </section>
            </div>
            {/* <PriceDashboard /> */}
        </div>
    </>
  )
}

export default BookingPage