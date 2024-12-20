import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

import CalendarImg from "../assets/cal.svg";
import Chev from "../assets/chev.svg";

export const Calendar = () => {
  const calImgArr = [
    { img: CalendarImg, month: "January" },
    { img: CalendarImg, month: "February" },
    { img: CalendarImg, month: "March" },
    { img: CalendarImg, month: "April" },
    { img: CalendarImg, month: "May" },
    { img: CalendarImg, month: "June" },
    { img: CalendarImg, month: "July" },
    { img: CalendarImg, month: "August" },
    { img: CalendarImg, month: "September" },
    { img: CalendarImg, month: "October" },
    { img: CalendarImg, month: "November" },
    { img: CalendarImg, month: "December" },
  ];

  const date = new Date().getFullYear();

  const storedYear = localStorage.getItem("selectedYear");
  const [year, setYear] = useState(storedYear ? parseInt(storedYear) : date);
  const [yearlyBalance, setYearlyBalance] = useState(0);

  useEffect(() => {
    localStorage.setItem("selectedYear", year);
  }, [year]);

  useEffect(() => {
    const handleFetch = async () => {
      const response = await fetch(
        `https://expense-tracker-api-wi0m.onrender.com/api/transactions/all/${year}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',  
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      // Calculate Balance
      const calculateBalance = () => {
        const totalBalance = data.data.reduce((total, transaction) => {
          const amount = parseFloat(transaction.amount);
          return transaction.type === "debit" ? total + amount : total - amount;
        }, 0);
        setYearlyBalance(totalBalance);
      };

      calculateBalance();
    };

    handleFetch();
  }, [year]);

  const handleIncrement = () => {
    setYear((prevYear) => prevYear + 1);
  };

  const handleDecrement = () => {
    setYear((prevYear) => prevYear - 1);
  };

  const formatNumber = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload(); 
  };

  return (
    <>
      <section id="calendar">
        <div className="year-container">
          <span>
            <img
              className={["chev", year === 2000 ? "disable" : ""]
                .filter(Boolean)
                .join(" ")}
              src={Chev}
              onClick={handleDecrement}
            />
          </span>
          <h1 className="year-select">{year}</h1>
          <span>
            <img className="chev right" src={Chev} onClick={handleIncrement} />
          </span>
        </div>

        <motion.div
          className="calendar-container"
          initial={{ y: -100, opacity: 0 }} // Start above the screen and invisible
          animate={{ y: 0, opacity: 1 }} // Drop into place and become visible
          exit={{ y: -100, opacity: 0 }} // Reverse animation when exiting (optional)
          transition={{
            duration: 0.8, // Adjust the duration for smoothness
            ease: "easeOut", // Use an easing function for smooth motion
          }}
        >
          {calImgArr.map((elem, index) => (
            <div key={index} className="calendar-sub">
              <p className="cal-month">{elem.month}</p>
              <NavLink
                to={`/month/${elem.month.toLowerCase()}`}
                state={{ year }}
              >
                <img className="cal-img" src={elem.img} />
              </NavLink>
            </div>
          ))}
        </motion.div>
        <div
          className="annual-balance-container"
          style={{
            background: yearlyBalance >= 0 ? "#00d25e" : "crimson",
            opacity: 0.95,
          }}
        >
          <h1>
            Balance for {year}:{" "}
            {yearlyBalance > 0
              ? `+${formatNumber(yearlyBalance)}`
              : `${formatNumber(yearlyBalance)}`}
          </h1>
        </div>
        <button onClick={handleLogout}>Logout</button>
      </section>
    </>
  );
};
