import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

import Home from "./pages/Home";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AuthCallback from './pages/AuthCallback'

import AppLayout from "./Layout/AppLayout";
import AuthLayout from "./Layout/AuthLayout";

import AdminLayout from './pages/AdminLayout';
import AdminUsers from './pages/AdminUsers';
import AdminDeposits from './pages/AdminDeposits';
import AdminNotifications from './pages/AdminNotifications';
import AdminStats from './pages/AdminStats';

// Import components
import InvestSheet from "./components/Sheets/InvestSheet";
import { useInvestments } from "./hooks/useInvestments";

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInvestSheet, setShowInvestSheet] = useState(false);
  
  const { createInvestment, buyingPower } = useInvestments();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        {/* PUBLIC */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* AUTH */}
        <Route element={<AuthLayout />}>
          <Route
            path="/signin"
            element={session ? <Navigate to="/dashboard" /> : <SignIn />}
          />
          <Route
            path="/signup"
            element={session ? <Navigate to="/dashboard" /> : <SignUp />}
          />
        </Route>

        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={session ? <Dashboard session={session} /> : <Navigate to="/signin" />}
        />
        <Route
          path="/profile"
          element={session ? <Profile session={session} /> : <Navigate to="/signin" />}
        />

        {/* ADMIN */}
        <Route path="/admin" element={session ? <AdminLayout session={session} /> : <Navigate to="/signin" />}>
          <Route path="users" element={<AdminUsers />} />
          <Route path="deposits" element={<AdminDeposits />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="stats" element={<AdminStats />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* Global Invest Modal */}
      <InvestSheet
        isOpen={showInvestSheet}
        onClose={() => setShowInvestSheet(false)}
        buyingPower={buyingPower}
        onInvest={createInvestment}
      />
    </>
  );
}

export default App;