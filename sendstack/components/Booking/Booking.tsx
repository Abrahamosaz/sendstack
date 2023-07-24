"use client";

import React, { useState, useEffect, useRef } from "react";
import "./Booking.css";
import getLocations, { dataObjects, localsObjects } from "@/utils/fetchdata";
import getPricelocation, { priceInfo } from "@/utils/getPricelocation";
import Image from "next/image";
import { useFormik } from "formik";
import logo from "@/public/logo.svg";
import PickupModal from "../Modal/PickupModal";
import { AiOutlinePlus } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { BiEdit } from "react-icons/bi";
import Cookies from "js-cookie";
import { v4 as randomUUID } from "uuid";
import DropoffModal from "../Modal/DropoffModal";

export type propDropinfo = {
  dropofflocname: string;
  price: number;
};

interface PickUpTypes {
  pickupName: string;
  pickupNumber: string;
  altPickupNumber: string;
  pickupDate: string;
  note: string;
  pickupLocationCode: string;
}

interface DropoffTypes {
  dropoffLocationCode: string;
  recipientName: string;
  recipientNumber: string;
  altRecipientNumber: string;
}

interface EditDropoffTypes {
  id: string;
  dropoffLocationCode: string;
  recipientName: string;
  recipientNumber: string;
  altRecipientNumber: string;
}

const BookingPage = () => {
  const initialvalue: any = [];
  const [openModal, setOpenModal] = useState(false);
  const [openModal1, setOpenModal1] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [dropoffItems, setDropoffItems] = useState<any>([]);
  const [totalPrice, setTotalPrice] = useState<number>();
  const [prices, setPrices] = useState<{ [key: string]: number }>({});
  const [navState, setNavState] = useState("pickup");
  const pickupDetailsString = localStorage.getItem("pickupDetails");
  const pickupDetails = pickupDetailsString
    ? JSON.parse(pickupDetailsString)
    : null;

  const [pickupObj, setPickupObj] = useState(pickupDetails);
  const [locationData, setLocationData] = useState({
    state: "",
    locals: initialvalue,
  });

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
      console.log("log from pick up fo", values);

      setNavState("dropoff");
      setOpenModal(false);
      localStorage.setItem(
        "pickupDetails",
        JSON.stringify({
          ...values,
        })
      );
      const pickupDetailsString = localStorage.getItem("pickupDetails");
      const pickupDetails1 = pickupDetailsString
        ? JSON.parse(pickupDetailsString)
        : null;

      setPickupObj(pickupDetails1);
    },
  });

  const dropoffFormikValues = useFormik<DropoffTypes>({
    initialValues: {
      dropoffLocationCode: "",
      recipientName: "",
      recipientNumber: "",
      altRecipientNumber: "",
    },

    onSubmit: async (values) => {
      console.log("form values", values);

      const id = randomUUID();
      setOpenModal1(false);
      addDropoffItem({
        id,
        ...values,
      });
      dropoffFormikValues.setValues({
        dropoffLocationCode: "",
        recipientName: "",
        recipientNumber: "",
        altRecipientNumber: "",
      });

      const existingDropoffItems = Cookies.get("dropoffItems");
      const parsedDropoffItems = existingDropoffItems
        ? JSON.parse(existingDropoffItems)
        : [];
      setDropoffItems(parsedDropoffItems);
    },
  });

  const editDropoffFormikValues = useFormik<EditDropoffTypes>({
    initialValues: {
      // customerId: "",
      // address: "",
      id: "",
      dropoffLocationCode: "",
      recipientName: "",
      recipientNumber: "",
      altRecipientNumber: "",
    },

    onSubmit: async (values) => {
      console.log("form values", values);
      const { id, ...rest } = values;
      setOpenModal2(false);
      editDropoffItem(id, rest);
      const existingDropoffItems = Cookies.get("dropoffItems");
      const parsedDropoffItems = existingDropoffItems
        ? JSON.parse(existingDropoffItems)
        : [];
      setDropoffItems(parsedDropoffItems);
    },
  });

  useEffect(() => {
    if (pickupObj) {
      pickupFormikValues.setValues({
        pickupLocationCode: pickupObj.pickupLocationCode ?? "",
        pickupName: pickupObj.pickupName ?? "",
        pickupNumber: pickupObj.pickupNumber ?? "",
        altPickupNumber: pickupObj.altPickupNumber ?? "",
        pickupDate: pickupObj.pickupDate ?? "",
        note: pickupObj.note ?? "",
      });
    }

    setPickupObj(pickupDetails);
  }, [pickupObj]);

  useEffect(() => {
    const existingDropoffItems = Cookies.get("dropoffItems");
    const parsedDropoffItems = existingDropoffItems
      ? JSON.parse(existingDropoffItems)
      : [];
    setDropoffItems(parsedDropoffItems);
    totalPriceFunc();
  }, []);

  const addDropoffItem = (newItem: any) => {
    setDropoffItems((prevItems: any) => [...prevItems, newItem]);

    const existingDropoffItems = Cookies.get("dropoffItems");
    let dropoffItems = existingDropoffItems
      ? JSON.parse(existingDropoffItems)
      : [];
    if (!existingDropoffItems) {
      // Create a new array if `dropoffItems` does not exist in the cookie
      dropoffItems = [];
    }
    // Append the new item(s) to the `dropoffItems` array
    dropoffItems.push(newItem);
    // Save the updated `dropoffItems` array back to the cookie
    Cookies.set("dropoffItems", JSON.stringify(dropoffItems));
    totalPriceFunc();
  };

  const editDropoffItem = (itemId: any, updatedItem: any) => {
    setDropoffItems((prevItems: any) =>
      prevItems.map((item: any) => (item.id === itemId ? updatedItem : item))
    );

    const existingDropoffItems = Cookies.get("dropoffItems");
    let dropoffItems = existingDropoffItems
      ? JSON.parse(existingDropoffItems)
      : [];

    const itemIndex = dropoffItems.findIndex((item: any) => item.id === itemId);
    if (itemIndex !== -1) {
      dropoffItems[itemIndex] = updatedItem;
    }

    Cookies.set("dropoffItems", JSON.stringify(dropoffItems));
    totalPriceFunc();
  };

  const deleteDropoffItem = (itemId: number) => {
    setDropoffItems((prevItems: any) =>
      prevItems.filter((item: any) => item.id !== itemId)
    );
    const existingDropoffItems = Cookies.get("dropoffItems");
    let dropoffItems = existingDropoffItems
      ? JSON.parse(existingDropoffItems)
      : [];
    const itemToDeleteId = itemId; // ID of the item you want to delete
    const itemIndex = dropoffItems.findIndex(
      (item: any) => item.id === itemToDeleteId
    );
    if (itemIndex !== -1) {
      dropoffItems.splice(itemIndex, 1);
    }
    Cookies.set("dropoffItems", JSON.stringify(dropoffItems));
    totalPriceFunc();
  };

  const clearAll = () => {
    setDropoffItems([]);
    Cookies.set("dropoffItems", JSON.stringify([]));
    totalPriceFunc();
  };

  const totalPriceFunc = async () => {
    // Initialize an array to collect the results
    const priceResults: number[] = [];

    // Define the pickup code and pickup date (you can obtain these values from wherever you need)

    // Loop through the dropoffArray and call the function for each dropoff
    for (const dropoff of dropoffItems) {
      const { dropoffLocationCode } = dropoff;

      const parsedDropoffCode = JSON.parse(dropoffLocationCode);
      const parsedPickupCode = JSON.parse(pickupObj.pickupLocationCode);
      // console.log(parsedCode.code, "kfkf");
      // console.log(typeof parsedCode.code, "kfkf");
      // console.log(typeof parsedCode.code, "kfkf");

      try {
        // Call the function and store the result in the priceResults array
        const result = await getPricelocation(
          "https://sandbox.sendstack.africa/api/v1/deliveries/price",
          parsedPickupCode.code,
          parsedDropoffCode.code,
          pickupObj.pickupDate
        );

        priceResults.push(result.data.price);
      } catch (error) {
        console.error(error); // Handle any errors if necessary
      }
    }

    const sum = priceResults.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );

    setTotalPrice(sum);

    // Now you have the price results for each dropoff in the priceResults array
    // You can proceed with further operations using the priceResults data
  };

  // Call the async function to start the process
  // useEffect(() => {}, []);

  const individualPriceFunc = async () => {
    const pricePromises = dropoffItems.map(async (item: any) => {
      const parsedDropoffCode = JSON.parse(item.dropoffLocationCode);
      const parsedPickupCode = JSON.parse(pickupObj.pickupLocationCode);

      try {
        const result = await getPricelocation(
          "https://sandbox.sendstack.africa/api/v1/deliveries/price",
          parsedPickupCode.code,
          parsedDropoffCode.code,
          pickupObj.pickupDate
        );
        return { id: item.id, price: result.data.price };
      } catch (error) {
        console.error(error);
        return { id: item.id, price: undefined };
      }
    });

    const resolvedPrices = await Promise.all(pricePromises);

    // Update the state with the prices once all promises are resolved
    const newPrices: { [key: string]: number } = {};
    resolvedPrices.forEach(({ id, price }) => {
      newPrices[id] = price;
    });
    setPrices(newPrices);
  };

  useEffect(() => {
    totalPriceFunc();
    individualPriceFunc();
  }, [totalPrice, dropoffItems]);

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
        <div className={"booking__content"}>
          {navState == "pickup" && (
            <>
              {pickupObj ? (
                <div className="pickup__card">
                  <div className="pickup__card__content">
                    <div className="pickup__card__left">
                      <p>1 Pickup Location</p>
                      <p>{pickupDetails.pickupDate}</p>
                      <p>
                        {pickupDetails.pickupLocationCode &&
                          JSON.parse(pickupDetails.pickupLocationCode).name}
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
                          localStorage.removeItem("pickupDetails");
                          const pickupDetailsString =
                            localStorage.getItem("pickupDetails");
                          const pickupDetails2 = pickupDetailsString
                            ? JSON.parse(pickupDetailsString)
                            : null;

                          setPickupObj(pickupDetails2);
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

          {navState == "dropoff" && (
            <>
              {dropoffItems.length != 0 ? (
                <>
                  <div className="cart__modal__content__head1">
                    <p>{`${dropoffItems?.length} item${
                      dropoffItems?.length > 1 ? "s" : ""
                    }`}</p>
                    <p
                      onClick={() => {
                        clearAll();
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
                        {dropoffItems.map((item: any, index: number) => {
                          const price = prices[item.id];

                          return (
                            <div className="pickup__card">
                              <div className="pickup__card__content1">
                                <div className="pickup__card__left">
                                  <p>Dropoff Location</p>
                                  <p>
                                    {" "}
                                    {item.dropoffLocationCode &&
                                      JSON.parse(item.dropoffLocationCode).name}
                                  </p>
                                  <p>{`₦${price}`}</p>
                                </div>
                                <div className="pickup__card__right">
                                  <BiEdit
                                    onClick={() => {
                                      editDropoffFormikValues.setValues({
                                        id: item.id,
                                        dropoffLocationCode:
                                          item.dropoffLocationCode,
                                        recipientName: item.recipientName,
                                        recipientNumber: item.recipientNumber,
                                        altRecipientNumber:
                                          item.altRecipientNumber,
                                      });
                                      setOpenModal2(true);
                                    }}
                                    cursor={"pointer"}
                                    size={20}
                                  />

                                  <MdDelete
                                    onClick={() => {
                                      deleteDropoffItem(item.id);
                                      totalPriceFunc();
                                    }}
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
                              <h3>{`₦${totalPrice}`}</h3>
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

      <DropoffModal
        locationData={locationData}
        deliveryFormikValues={editDropoffFormikValues}
        open={openModal2}
        onClose={() => setOpenModal2(false)}
      />
    </>
  );
};

export default BookingPage;
