import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const Register = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState(null);

  let navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleForm = async (e) => {
    e.preventDefault();

    setErrors(null);

    try {
      const response = await fetch('http://localhost:8000/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (!response.ok) {
          if (errorData) {
            setErrors(errorData);
          }
        }
        throw new Error('Request failed');
      }

      setFormData({ email: '', password: '' });
      navigate('/login')
    } catch (err) {
      console.error('Error during registration:', err);
    }
  };

  return (
    <section id="auth-page">
      <form className="auth-form" onSubmit={handleForm}>
        <h1 className="auth-title">Register</h1>

        {errors && (
          <div className="alert">
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors.message}</p>
            ))}
          </div>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <button type="submit" className="btn btn-block">Register</button>
        <p className="login-to-register-link">
          Already Have an Account? <NavLink to="/login">Login</NavLink>
        </p>
      </form>
    </section>
  );
};