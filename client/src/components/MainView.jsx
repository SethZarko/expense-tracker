import { Outlet, Navigate } from "react-router-dom";
import PropTypes from "prop-types";

export const MainView = ({ token }) => {
  return (
    <>
      <main>{token ? <Outlet /> : <Navigate to="/register" />}</main>
    </>
  );
};

// Prop Validation
MainView.propTypes = {
  token: PropTypes.string,
};