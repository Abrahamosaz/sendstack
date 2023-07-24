import React, { ChangeEvent, useContext, useState, useEffect } from "react";
import nft from "./nft.jpg";
import "./Modal.css";
import { IoMdClose } from "react-icons/io";
import { AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import { localsObjects } from "@/utils/fetchdata";
import { ModalProps } from "@/components/Modal/PickupModal";

const DropoffModal: React.FC<ModalProps> = ({
  open,
  onClose,
  deliveryFormikValues,
  locationData,
}) => {
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
              <p>Dropoff Details</p>

              <IoMdClose
                size={30}
                cursor="pointer"
                color="#000"
                onClick={onClose}
              />
            </div>
            <hr style={{ marginBottom: "1rem" }} />
            <div style={{ paddingTop: "0" }} className="cart__modal__body">
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
                        name="recipientName"
                        required
                        placeholder="Name of recipient/drop-off contact"
                        value={deliveryFormikValues.values.recipientName}
                        onChange={deliveryFormikValues.handleChange}
                      />
                    </div>
                  </div>
                  <div className="up__main__form__one">
                    <div className="up__main__input">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        type="text"
                        name="recipientNumber"
                        placeholder="08061909748"
                        required
                        value={deliveryFormikValues.values.recipientNumber}
                        onChange={deliveryFormikValues.handleChange}
                      />
                    </div>
                  </div>
                  <div className="up__main__form__one">
                    <div className="up__main__input">
                      <label htmlFor="last"> Alternative Phone Number</label>
                      <input
                        type="text"
                        name="altRecipientNumber"
                        placeholder="08061909748"
                        required
                        value={deliveryFormikValues.values.altRecipientNumber}
                        onChange={deliveryFormikValues.handleChange}
                      />
                    </div>
                  </div>

                  <div className="up__main__form__one">
                    <div className="up__main__input">
                      <label htmlFor="last">Dropoff Location</label>

                      <select
                        name="dropoffLocationCode"
                        value={deliveryFormikValues.values.dropoffLocationCode}
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

export default DropoffModal;
