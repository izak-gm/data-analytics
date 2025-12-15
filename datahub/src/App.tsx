import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import BankingTransactionCard from './components/app/AllBankingRecords';
import DashboardLayout from './components/app/DashboardLayout';
import ValidInvalidPage from './pages/ValidInvalidPage';
import BranchPerformancePage from './pages/BranchPerformancePage';

export default function App() {

  return (
    <>
      <BrowserRouter>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<BranchPerformancePage />} />
            <Route path="/all-records" element={<BankingTransactionCard />} />
            <Route path="/valid-ivalid" element={<ValidInvalidPage />} />
          </Routes>
        </DashboardLayout>
      </BrowserRouter>
    </>
  );
}

