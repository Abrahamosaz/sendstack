import React, { ChangeEvent, useContext, useState, useEffect } from "react";
import nft from "./nft.jpg";
import "./Modal.css";
import { IoMdClose } from "react-icons/io";
import { AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import { localsObjects } from "@/utils/fetchdata";

export interface ModalProps {
  locationData: any;
  deliveryFormikValues: any;
  open: boolean;
  onClose: () => void;
}

const PickupModal: React.FC<ModalProps> = ({
  open,
  onClose,
  deliveryFormikValues,
  locationData,
}) => {
  function getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1; // Months are zero-based, so add 1
    let day = today.getDate();

    // Add leading zeros to month and day if needed
    const formattedMonth = month < 10 ? `0${month}` : `${month}`;
    const formattedDay = day < 10 ? `0${day}` : `${day}`;

    return `${year}-${formattedMonth}-${formattedDay}`;
  }

  if (!open) return null;
  return (
    <div onClick={onClose} className="cart__overlay">
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="modalContainer"
      >
        <div className="cart__modal__con">
          <div className="cart__modal__wrapper">
            <div className="cart__modal__head">
              <p>Pickup Details</p>

              <IoMdClose
                size={30}
                cursor="pointer"
                color="#000"
                onClick={onClose}
              />
            </div>
            <hr />
            <div className="cart__modal__body">
              <div className="up__main__head">
                {/* <h1>Book a Delivery Ride</h1>
            <p>Anywhere in {locationData.state}</p> */}
              </div>
              <div className="up__main">
                <form
                  className="up__main__form"
                  onSubmit={deliveryFormikValues.handleSubmit}
                >
                  {/* inputs */}
                  <div className="up__main__form__one">
                    <div className="up__main__input">
                      <label htmlFor="name">Name</label>
                      <input
                        type="text"
                        name="pickupName"
                        required
                        placeholder="Name of sender/pick-up contact"
                        value={deliveryFormikValues.values.pickupName}
                        onChange={deliveryFormikValues.handleChange}
                      />
                    </div>
                  </div>
                  <div className="up__main__form__one">
                    <div className="up__main__input">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        type="text"
                        name="pickupNumber"
                        placeholder="08061909748"
                        required
                        value={deliveryFormikValues.values.pickupNumber}
                        onChange={deliveryFormikValues.handleChange}
                      />
                    </div>
                  </div>
                  <div className="up__main__form__one">
                    <div className="up__main__input">
                      <label htmlFor="last"> Alternative Phone Number</label>
                      <input
                        type="text"
                        name="altPickupNumber"
                        placeholder="08061909748"
                        required
                        value={deliveryFormikValues.values.altPickupNumber}
                        onChange={deliveryFormikValues.handleChange}
                      />
                    </div>
                  </div>

                  <div className="up__main__form__one">
                    <div className="up__main__input">
                      <label htmlFor="last">Pickup Date</label>
                      <input
                        type="date"
                        name="pickupDate"
                        required
                        value={deliveryFormikValues.values.pickupDate}
                        onChange={deliveryFormikValues.handleChange}
                        min={getCurrentDate()}
                      />
                    </div>
                  </div>

                  <div className="up__main__form__one">
                    <div className="up__main__input">
                      <label htmlFor="last">Delivery Note</label>
                      <textarea
                        placeholder="e.g. Kindly pickup item from the gatemen"
                        name="note"
                        required
                        value={deliveryFormikValues.values.note}
                        onChange={deliveryFormikValues.handleChange}
                        style={{ resize: "vertical" }}
                      ></textarea>
                    </div>
                  </div>

                  <div className="up__main__form__one">
                    <div className="up__main__input">
                      <label htmlFor="last">Pickup Location</label>

                      <select
                        name="pickupLocationCode"
                        value={deliveryFormikValues.values.pickupLocationCode}
                        onChange={deliveryFormikValues.handleChange}
                      >
                        {locationData &&
                          locationData.locals.map(
                            (local: localsObjects, index: number) => {
                              return (
                                <option
                                  key={index}
                                  value={JSON.stringify({
                                    name: local.name,
                                    code: local.locationCode,
                                  })}
                                >
                                  {local.name}
                                </option>
                              );
                            }
                          )}
                      </select>
                    </div>
                  </div>

                  {/* submit button */}
                  <button type="submit" className="up__btn">
                    <span>Save</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickupModal;
