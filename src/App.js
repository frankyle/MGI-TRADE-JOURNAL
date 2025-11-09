import React from 'react';
import { Routes, Route } from 'react-router-dom'; // ✅ No BrowserRouter here
import Header from './components-mgi/Header';
import TradingJournalForm from './components-mgi/TradeJournal/TradingJournalForm';
import RiskManagement from './components-mgi/RiskManagement/RiskManagement';
import FundedAccount from './components-mgi/FundedAccount/FundedAccount';
// import ArchivedTradesView from './components-mgi/ArchiveForder/ArchivedTradesView';
import Homepage from './components-mgi/Home/Homepage';
// import Membership from './components-mgi/Membership/Membership';
import ContactUs from './components-mgi/Home/ContactUs';
// import Archive from './components-mgi/ArchiveForder/Archive';
import SignIn from './components-mgi/Authentication/SignIn';
import SignUp from './components-mgi/Authentication/SignUp';
import TradeForm from './components-mgi/Admin/TradeForm';
import Journal from './components-mgi/ArchiveForder/Journal';

function App() {
  return (
    <div className="bg-gray-100 min-h-screen pt-20">
      <Header />
      <div className="max-w-5xl mx-auto px-4">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/trades" element={<TradingJournalForm />} />
          <Route path="/trades_idea" element={<TradeForm />} />
          <Route path="/riskmanagement" element={<RiskManagement />} />
          <Route path="/riskmanagementfunded" element={<FundedAccount />} />
          {/* <Route path="/membership" element={<Membership />} /> */}
          {/* <Route path="/journal" element={<ArchivedTradesView />} /> */}
          <Route path="/journal" element={<Journal />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
