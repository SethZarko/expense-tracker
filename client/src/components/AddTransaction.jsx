import { useState } from "react";
import PropTypes from "prop-types";

export const AddTransaction = ({ month, year }) => {
  const getMonthNumber = (monthName) => {
    const months = {
      january: 1,
      february: 2,
      march: 3,
      april: 4,
      may: 5,
      june: 6,
      july: 7,
      august: 8,
      september: 9,
      october: 10,
      november: 11,
      december: 12,
    };
    return months[monthName] || 0;
  };
  const monthNumber = getMonthNumber(month);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    year: year,
    month: monthNumber,
    day: "",
    type: "credit", // Default type is 'credit'
    amount: "",
    desc: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/transactions/create", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Transaction creation failed.");
      }

      // Close the modal and reset the form after successful submission
      setIsModalOpen(false);
      setFormData({
        year: "",
        month: "",
        day: "",
        type: "credit",
        amount: "",
        desc: "",
      });
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setFormData({
      year: "",
      month: "",
      day: "",
      type: "credit",
      amount: "",
      desc: "",
    });
  };

  return (
    <section id="add-transaction">
      <button className="add-transaction-btn" onClick={() => setIsModalOpen(true)}>
        Add Transaction
      </button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="add-tran-title">Add New Transaction</h2>
            <form onSubmit={handleSubmit} className="transaction-form">
              <div className="form-group">
                <label htmlFor="day">Day</label>
                <input
                  type="number"
                  name="day"
                  id="day"
                  value={formData.day}
                  onChange={handleChange}
                  required
                  min="1"
                  max="31"
                />
              </div>

              <div className="form-group">
                <label htmlFor="type">Transaction Type</label>
                <select
                  name="type"
                  id="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="amount">Amount</label>
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="desc">Description</label>
                <textarea
                  name="desc"
                  id="desc"
                  value={formData.desc}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">Add Transaction</button>
                <button type="button" className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

// Prop Validation
AddTransaction.propTypes = {
  month: PropTypes.string,
  year: PropTypes.number,
};