import { useState } from 'react';
import './App.css'
import BarChart from './components/BarChart/BarChart'
import TransactionsTable from './components/Table/TransactionsTable'
import Stats from './components/Stats/Stats';

function App() {
  const [selectedMonth, setSelectedMonth] = useState('March');

  return (
    <div className='container'>
     <TransactionsTable setSelectedMonth={setSelectedMonth} selectedMonth={selectedMonth}/>
     <h1>Statistics: {selectedMonth} </h1>
     <div className="transaction_stats" > 
      <BarChart  selectedMonth={selectedMonth}/>
      <Stats selectedMonth={selectedMonth}/>
     </div>
    </div>
  )
}

export default App
