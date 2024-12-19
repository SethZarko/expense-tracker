import { useRef, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

export const Login = ({ token, setToken }) => {
  const [errors, setErrors] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [navigate, token]);

  const emailRef = useRef();
  const passwordRef = useRef();

  const handleForm = async (e) => {
    e.preventDefault();

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    setErrors(null);

    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (!response.ok) {
          if (errorData) {
            setErrors(errorData);
          }
        }
        throw new Error("Request failed");
      }

      const data = await response.json();
      setToken(data.token);
    } catch (err) {
      console.error("Error during login:", err);
    }
  };

  return (
    <>
      <section id='auth-page'>
        <form className="auth-form" onSubmit={handleForm}>
          <h1 className="auth-title">Login</h1>

          {errors && (
            <div className="alert">
              {Object.keys(errors).map((key) => (
                <>
                  <p key={key}>{errors[key]}</p>
                </>
              ))}
            </div>
          )}

          <input ref={emailRef} type="email" placeholder="Email" />
          <input ref={passwordRef} type="password" placeholder="Password" />
          <button className="btn btn-block">Login</button>
          <p className="login-to-register-link">
            Not Registered? <NavLink to="/register">Create an Account</NavLink>
          </p>
        </form>
      </section>
    </>
  );
};

// Prop Validation
Login.propTypes = {
  token: PropTypes.string,
  setToken: PropTypes.func,
};
