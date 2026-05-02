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

import AppLayout from "./Layout/AppLayout";
import AuthLayout from "./Layout/AuthLayout";
import DashboardLayout from "./Layout/DashboardLayout";


import AdminLayout from './pages/AdminLayout'
import AdminUsers from './pages/AdminUsers'
import AdminDeposits from './pages/AdminDeposits'
import AdminNotifications from './pages/AdminNotifications'
import AdminStats from './pages/AdminStats'

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>
      </Routes>
    );
  }

  return (
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

      {/* DASHBOARD */}
      <Route
        element={
          session ? <DashboardLayout /> : <Navigate to="/signin" />
        }
      >
        <Route path="/dashboard" element={<Dashboard session={session} />} />
        <Route path="/profile"   element={<Profile session={session} />} />
      </Route>

      <Route path="/admin" element={session ? <AdminLayout session={session} /> : <Navigate to="/signin" />}>
  <Route path="users"         element={<AdminUsers />} />
  <Route path="deposits"      element={<AdminDeposits />} />
  <Route path="notifications" element={<AdminNotifications />} />
  <Route path="stats"         element={<AdminStats />} />
</Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}

export default App;