import { useState, useEffect } from "react";
import PropTypes from "prop-types";

export const BalanceView = ({ month, year }) => {
  // Convert the month name to its corresponding number
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

  // Component State
  const [transactionState, setTransactionState] = useState([]);
  const [balance, setBalance] = useState(0);

  // Component Lifecycle Hooks
  useEffect(() => {
    const monthNumber = getMonthNumber(month);

    // Handle Fetch
    const handleFetch = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch(
          `http://localhost:8000/api/transactions/all/${year}/${monthNumber}`,{
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        // Sort transactions by date in descending order
        const withFullDates = data.data.map((transaction) => ({
          ...transaction,
          date: new Date(
            year,
            new Date(Date.parse(`${month} 1, ${year}`)).getMonth(),
            transaction.day
          ),
        }));

        // Sort transactions by date in descending order
        const sortedTransactions = withFullDates.sort(
          (a, b) => b.date - a.date
        );

        // Set the sorted transactions to the state
        setTransactionState(sortedTransactions);
      } catch (error) {
        console.error("Error fetching transaction data:", error);
      }
    };

    handleFetch();
  }, [month, year, transactionState]);

  useEffect(() => {
    // Calculate Balance
    const calculateBalance = () => {
      const totalBalance = transactionState.reduce((total, transaction) => {
        const amount = parseFloat(transaction.amount);
        return transaction.type === "debit" ? total + amount : total - amount;
      }, 0);
      setBalance(totalBalance);
    };

    calculateBalance();
  }, [transactionState]);

  // Component Functions //
  const monthString = month.charAt(0).toUpperCase() + month.slice(1);

  // Format the balance with commas and decimal points
  const formatNumber = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Handle delete
  const handleDelete = async (transactionId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/transactions/${transactionId}`,
        {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete transaction.");
      }

      // Remove the deleted transaction from the state
      setTransactionState(
        transactionState.filter(
          (transaction) => transaction._id !== transactionId
        )
      );
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  // Component JSX
  return (
    <>
      <section id="balance-view">
        <h1
          className="monthly-balance"
          style={{
            background: balance >= 0 ? "#00d25e" : "crimson",
            opacity: 0.95,
          }}
        >
          {month.charAt(0).toUpperCase() + month.slice(1)} Balance:{" "}
          {balance > 0
            ? `+${formatNumber(balance)}`
            : `${formatNumber(balance)}`}
        </h1>

        <div className="balance-container">
          {transactionState &&
            transactionState.map((elem) => (
              <div
                key={elem._id}
                className={[
                  "balance-entry",
                  elem.type === "debit" ? "debit" : "credit",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <p>
                  {monthString} <span>{elem.day},</span> {year}
                </p>
                <p className="desc">{elem.desc}</p>
                <div className="transaction-amount">
                  <span>{elem.type === "credit" ? "-" : "+"}</span>
                  <p>{formatNumber(elem.amount)}</p>
                </div>
                <i 
                  className="fa-solid fa-trash"
                  onClick={() => handleDelete(elem._id)}
                ></i>
              </div>
            ))}
          {transactionState.length === 0 && (
            <>
              <h3 className="no-transactions">
                No Transactions for {monthString} {year}
              </h3>
            </>
          )}
        </div>
      </section>
    </>
  );
};

// Prop Validation
BalanceView.propTypes = {
  month: PropTypes.string,
  year: PropTypes.number,
};
