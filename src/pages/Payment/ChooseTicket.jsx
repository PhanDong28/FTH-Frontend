import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../assets/css/header.css";
import "../../assets/css/chooseticket.css";
import Header from "../../component/Header";
import Footer from "../../component/Footer";
import { UserContext } from "../../context/UserContext";

function ChooseTicket() {
  const location = useLocation();
  const navigate = useNavigate();
  const { event } = location.state || {};
  const [disable, setDisable] = useState(true);
  const [countTicket, setCountTicket] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const { user } = useContext(UserContext);

  const ticketList =
    event?.tickettypes?.map((ticket) => ({
      type: ticket.typeName,
      price: ticket.price,
      quantity: ticket.quantity,
    })) || [];

  const [quantities, setQuantities] = useState(ticketList.map(() => 0));

  useEffect(() => {
    const totalQuantity = quantities.reduce((acc, curr) => acc + curr, 0);
    setCountTicket(totalQuantity);
    setDisable(totalQuantity === 0 || totalQuantity > 2);

    const totalPrice = quantities.reduce(
      (acc, curr, index) => acc + curr * ticketList[index].price,
      0
    );
    setTotalPrice(totalPrice);
  }, [quantities, ticketList]);

  const handleQuantityChange = (index, delta) => {
    setQuantities(
      quantities.map((quantity, i) => {
        if (i === index) {
          const newQuantity = quantity + delta;
          const totalQuantity = quantities.reduce((acc, curr, idx) => {
            return idx === index ? acc + newQuantity : acc + curr;
          }, 0);
          return Math.max(
            0,
            Math.min(2 - (totalQuantity - newQuantity), newQuantity)
          );
        }
        return quantity;
      })
    );
  };

  const handleContinue = () => {
    navigate("/payment", {
      state: {
        event,
        totalPrice,
        quantities,
        ticketList,
      },
    });
  };

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <div className="choose-ticket">
        <div className="ticket-header">
          <h1 style={{ justifyContent: "center" }}>Chọn vé</h1>
        </div>
        <div className="containerTicket">
          <div className="ticket-list">
            <div className="ticket-row header">
              <span className="ticket-type">Loại vé</span>
              <span className="ticket-price">Giá vé</span>
              <span className="ticket-quantity">Số lượng</span>
            </div>
            {ticketList.map((ticket, index) => (
              <div key={ticket.type} className="ticket-row">
                <span className="ticket-type">{ticket.type}</span>
                <span
                    className={ticket.quantity === 0 ? "sold-out" : "available"}
                  >
                    {ticket.quantity === 0
                      ? "Hết vé"
                      : `${ticket.price.toLocaleString()} đ`}
                  </span>
                <span className="ticket-quantity">
                  <button
                    onClick={() => handleQuantityChange(index, -1)}
                    disabled={quantities[index] === 0}
                  >
                    -
                  </button>
                  <span>{quantities[index]}</span>
                  <button
                    onClick={() => handleQuantityChange(index, 1)}
                    disabled={ticket.quantity === 0}
                  >
                    +
                  </button>
                </span>
              </div>
            ))}
            <div className="note">
              Lưu ý: Mỗi tài khoản chỉ được đặt tối đa 2 vé.
            </div>
          </div>
          <div className="ticket-summary" style={{ backgroundColor: "black" }}>
            <h2>{event.eventName}</h2>
            <p>
              {new Date(event.startTime).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
              ,{" "}
              {new Date(event.startTime).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
            <p>{event.location}</p>
            <div className="ticket-prices">
              {ticketList.map((ticket) => (
                <div key={ticket.type} className="price-row">
                  <span>{ticket.type}</span>
                  <span
                    className={ticket.quantity === 0 ? "sold-out" : "available"}
                  >
                    {ticket.quantity === 0
                      ? "Hết vé"
                      : `${ticket.price.toLocaleString()} đ`}
                  </span>
                </div>
              ))}
            </div>
            <div>
              <div className="quantity-info h5 mt-3">
                {countTicket > 0 && (
                  <>
                    <div>
                      <i className="bi-ticket-perforated me-2"></i>
                    </div>
                    <div className="quantity">x{countTicket}</div>
                  </>
                )}
              </div>
              <button
                disabled={disable}
                className="select-button mt-1"
                onClick={handleContinue}
              >
                {disable
                  ? "Vui lòng chọn vé"
                  : `Tiếp tục - ${totalPrice.toLocaleString()} đ`}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ChooseTicket;
