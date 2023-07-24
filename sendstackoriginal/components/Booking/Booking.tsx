"use client";

import React, { useState, useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { BiEdit } from "react-icons/bi";
import Image from "next/image";
import logo from "@/public/logo.svg";
import "./Booking.css";
import { useFormik } from "formik";
import { PickUpTypes, DropoffTypes } from "@/utils/FormikTypes/FormikTypes";
import PickupModal from "../Modal/PickupModal";
import DropoffModal from "../Modal/DroppffModal";
import Cookies from "js-cookie";
import getPricelocation from "@/utils/getPriceLocation";
import { v4 as randomUUID } from "uuid";

import getLocations, {
  dataObjects,
  localsObjects,
} from "@/utils/LocationData/fetchlocationdata";

const BookingPage = () => {
  const [navState, setNavState] = useState("pickup");
  const [locationData, setLocationData] = useState<dataObjects>();
  const [openModal, setOpenModal] = useState(false);
  const [openModal1, setOpenModal1] = useState(false);
  const [pickupdetails, setPickupdetails] = useState<PickUpTypes>();
  const [dropoffdetails, setDropoffdetails] = useState<DropoffTypes[]>([]);
  const [totalprice, setTotalPrice] = useState<number>();
  const [price, setPrice] = useState<number>();

  const getData: (url: string) => Promise<void> = async (url) => {
    const res: dataObjects[] = await getLocations(url);
    const newLocals: localsObjects[] = [
      {
        name: "Select a location",
        locationCode: "",
        isAvailable: false,
      },
      ...res[0]?.locals,
    ];
    console.log(newLocals);
    setLocationData({ state: res[0]?.state, locals: newLocals });
  };

  useEffect(() => {
    const url = "https://sandbox.sendstack.africa/api/v1/locations";
    getData(url);
  }, []);

  useEffect(() => {
    const pickupstoragedata = localStorage.getItem("pickupdetails") || null;
    const pickupstoragedataString = pickupstoragedata
      ? JSON.parse(pickupstoragedata)
      : null;

    setPickupdetails(pickupstoragedataString);
  }, []);

  const pickupFormikValues = useFormik<PickUpTypes>({
    initialValues: {
      // customerId: "",
      pickupLocationCode: "",
      pickupName: "",
      pickupNumber: "",
      altPickupNumber: "",
      pickupDate: "",
      note: "",
    },

    onSubmit: async (values) => {
      setNavState("dropoff");
      setOpenModal(false);
      localStorage.setItem("pickupdetails", JSON.stringify({ ...values }));
      setPickupdetails({ ...values });
      pickupFormikValues.setValues({
        pickupLocationCode: "",
        pickupName: "",
        pickupNumber: "",
        altPickupNumber: "",
        pickupDate: "",
        note: "",
      });
    },
  });

  console.log("pickupdetails", pickupdetails);
  const dropoffFormikValues = useFormik<DropoffTypes>({
    initialValues: {
      dropoffLocationCode: "",
      recipientName: "",
      recipientNumber: "",
      altRecipientNumber: "",
    },

    onSubmit: async (values) => {
      const result: any = values;
      setOpenModal1(false);
      const existingdropoffdetails = Cookies.get("dropoffdetails");
      let dropoffitems = existingdropoffdetails
        ? JSON.parse(existingdropoffdetails)
        : [];

      dropoffitems.push({ ...result });
      console.log("dropitems", dropoffitems);
      Cookies.set("dropoffdetails", JSON.stringify(dropoffitems));
      setDropoffdetails([...dropoffdetails, { ...result }]);
      dropoffFormikValues.setValues({
        dropoffLocationCode: "",
        recipientName: "",
        recipientNumber: "",
        altRecipientNumber: "",
      });
    },
  });

  console.log("dropoffdetails", dropoffdetails);

  return (
    <>
      <div className="booking__container">
        <Image src={logo} width={250} height={100} alt="" />
        <div className="booking__nav">
          <div className="booking__nav__content">
            <div
              onClick={() => {
                setNavState("pickup");
              }}
              className={
                navState == "pickup" ? "active" : "booking__nav__item "
              }
            >
              Pick-up
            </div>
            <div
              onClick={() => {
                setNavState("dropoff");
              }}
              className={
                navState == "dropoff" ? "active" : "booking__nav__item "
              }
            >
              Drop-off
            </div>
            <div
              onClick={() => {
                setNavState("bookedItems");
              }}
              className={
                navState == "bookedItems" ? "active" : "booking__nav__item "
              }
            >
              Booked-items
            </div>
          </div>
        </div>
        <div className="booking__content">
          {navState == "pickup" && (
            <>
              {pickupdetails ? (
                <div className="pickup__card">
                  <div className="pickup__card__content">
                    <div className="pickup__card__left">
                      <p>1 Pickup Location</p>
                      <p>{pickupdetails.pickupDate}</p>
                      <p>
                        {pickupdetails.pickupLocationCode &&
                          JSON.parse(pickupdetails.pickupLocationCode).name}
                      </p>
                    </div>
                    <div className="pickup__card__right">
                      <BiEdit
                        onClick={() => {
                          setOpenModal(true);
                        }}
                        cursor={"pointer"}
                        size={20}
                      />

                      <MdDelete
                        onClick={() => {
                          localStorage.removeItem("pickupdetails");
                          const recentStorage =
                            localStorage.getItem("pickupdetails");
                          const recentPickupdetails = recentStorage
                            ? JSON.parse(recentStorage)
                            : null;
                          setPickupdetails(recentPickupdetails);
                          pickupFormikValues.setValues({
                            pickupLocationCode: "",
                            pickupName: "",
                            pickupNumber: "",
                            altPickupNumber: "",
                            pickupDate: "",
                            note: "",
                          });
                        }}
                        cursor={"pointer"}
                        size={20}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="booking__button">
                  <button
                    onClick={() => {
                      setOpenModal(true);
                    }}
                  >
                    <AiOutlinePlus />
                    Add Pickup Location
                  </button>
                </div>
              )}
            </>
          )}
          <div className="booking_content">
            {navState == "dropoff" && (
              <>
                {dropoffdetails.length != 0 ? (
                  <>
                    <div className="cart__modal__content__head1">
                      <p>{`${dropoffdetails?.length} item${
                        dropoffdetails?.length > 1 ? "s" : ""
                      }`}</p>
                      <p
                        onClick={() => {
                          //   clearAll();
                        }}
                        style={{ cursor: "pointer", fontSize: 15 }}
                        color="#0E0000"
                        className="cart__delete"
                      >
                        Clear all
                      </p>
                    </div>
                    <div className="cart__modal__content__con">
                      <div className="cart__modal__content1">
                        <div className="cart__modal__items1">
                          {dropoffdetails.map((item: any, index: number) => {
                            const price = prices[item.id];

                            return (
                              <div className="pickup__card">
                                <div className="pickup__card__content1">
                                  <div className="pickup__card__left">
                                    <p>Dropoff Location</p>
                                    <p>
                                      {" "}
                                      {item.dropoffLocationCode &&
                                        JSON.parse(item.dropoffLocationCode)
                                          .name}
                                    </p>
                                    <p>{`₦${price}`}</p>
                                  </div>
                                  <div className="pickup__card__right">
                                    <BiEdit
                                      onClick={() => {}}
                                      cursor={"pointer"}
                                      size={20}
                                    />

                                    <MdDelete
                                      onClick={() => {}}
                                      cursor={"pointer"}
                                      size={20}
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="booking__button1">
                          <button
                            onClick={() => {
                              setOpenModal1(true);
                            }}
                          >
                            <AiOutlinePlus />
                            Add Dropoff Location
                          </button>
                        </div>
                      </div>
                      <div className="cart__modal__order">
                        <div className="cart__modal__order__content">
                          <div className="cart__modal__order__top">
                            <h3>Order summary</h3>

                            <div className="cart__modal__sub">
                              <div className="cart__modal__sub__total1">
                                <h3>Total Price</h3>
                                {/* <h3>{`₦${totalPrice}`}</h3> */}
                              </div>
                            </div>
                          </div>

                          <div className="cart__modal__order__bottom">
                            <h3>Payment Mode</h3>
                            <div className="cart__modal__order__payment__inputs"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="booking__button">
                    <button
                      onClick={() => {
                        setOpenModal1(true);
                      }}
                    >
                      <AiOutlinePlus />
                      Add Dropoff Location
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
          <PickupModal
            locationData={locationData}
            deliveryFormikValues={pickupFormikValues}
            open={openModal}
            onClose={() => setOpenModal(false)}
          />

          <DropoffModal
            locationData={locationData}
            deliveryFormikValues={dropoffFormikValues}
            open={openModal1}
            onClose={() => setOpenModal1(false)}
          />
        </div>
      </div>
    </>
  );
};

export default BookingPage;
