import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import BankingTransactionCard from './components/app/AllBankingRecords';

export default function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BankingTransactionCard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

