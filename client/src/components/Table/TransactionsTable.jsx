import React, { useState, useEffect } from 'react';
import "./transactiontable.css"
import axios from 'axios';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const TransactionsTable = ({selectedMonth, setSelectedMonth}) => {
  const [transactions, setTransactions] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/transactions?month=${selectedMonth}&search=${searchText}&page=${currentPage}`);
      setTransactions(response.data.results);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedMonth, currentPage, searchText]);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <div className="transaction_table">
      <h2>Transactions Table</h2>
      <div className="search_filter">
        <div>
        <label>Select Month: </label>
        <select className="custom_select" id="monthSelect" value={selectedMonth} onChange={handleMonthChange}>
          {months.map((month, index) => (
            <option key={index} value={month}>{month}</option>
          ))}
        </select>
        </div>
        <input type="text" className="search_product" value={searchText} placeholder="Search transaction" onChange={handleSearch} />
      </div>
      <table>
        <thead>
          <tr>
            <th>Product Id</th>
            <th>Product Name</th>
            <th>Product Description</th>
            <th>Product Price</th>
            <th>Product Category</th>
            <th>Sold</th>
            <th>Product Image</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.productCode}>
              <td>{transaction.productCode}</td>

              <td>{transaction.productName}</td>
              <td>{transaction.productDescription}</td>
              <td>$ {transaction.productPrice.toFixed(2)}</td>
              <td>{transaction.productCategory.toUpperCase()}</td>
              <td>{transaction.isSold ? "Yes" : "No"}</td>
              <td><img src={transaction.productImage} height={80} width={80} alt={transaction.productName} className="product_image"/></td>

            </tr>
          ))}
        </tbody>
      </table>
      <div className='button_pagination'>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
};

export default TransactionsTable;
