import { NavLink, useParams, useLocation, useNavigate } from "react-router-dom";

import { BalanceView } from '../components/BalanceView'
import { AddTransaction } from './AddTransaction'

export const Month = () => {
  const { month } = useParams();
  const location = useLocation();
  const { year } = location.state || {};
  const navigate = useNavigate();

  const handleReturnToCalendar = () => {
    navigate("/", { state: { year } }); // Pass the current year back to the Calendar component
  };

  return (
    <section id="month-view">
      <h1 className="month-title">{month.charAt(0).toUpperCase() + month.slice(1)} - {year}</h1>
      <hr />
      <AddTransaction month={month} year={year}/>
      <BalanceView month={month} year={year}/>
      <NavLink className="return-to-cal-btn" to='/' onClick={handleReturnToCalendar}>Return to Calendar</NavLink>
    </section>
  );
};
