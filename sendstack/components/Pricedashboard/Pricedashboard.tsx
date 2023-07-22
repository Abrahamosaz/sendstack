"use client"

import React, { useState, useEffect } from 'react'
import { localsObjects } from '@/utils/fetchdata';
import getPricelocation, { priceInfo, functionType } from '@/utils/getPricelocation';
import { propDropinfo } from '@/components/Booking/Booking';

interface propsType {
  pickuploc: string,
  dropoffloc: propDropinfo[],
  renderCounter: number
  rendercounterFunc: any
}

interface bookedRide {
  pickupname: string,
  dropoffdetails: propDropinfo[]
}

const Pricedashboard = ({ pickuploc, dropoffloc, renderCounter, rendercounterFunc }: propsType) => {
  const initialbookedride: bookedRide[] = [];
  const [bookedride, setBookedride] = useState(initialbookedride);

  console.log('pickup and dropoff array', bookedride);

  useEffect (() => {
    setBookedride([...bookedride, {
      pickupname: pickuploc,
      dropoffdetails: dropoffloc
    }]);
  }, [pickuploc, dropoffloc]);

  useEffect (() => {
    rendercounterFunc((prev: number) => prev + 1);
  }, [pickuploc, dropoffloc])

  console.log('from price dashbord', bookedride);
  return (
    <div className='price_dashboard'>
      <div className='price_container'>
        {bookedride.map((ride, index) => {
          return (<div key={index}>
            {ride.dropoffdetails.map((info, index) => {
              return (<p key={index}>From {ride.pickupname} to {info.dropofflocname} is {info.price}</p>)
            })}
          </div>)
        })}
      </div>

    </div>
  )
}

export default Pricedashboard;