import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProjectProvider } from './context/ProjectContext';
import MainLayout from './components/MainLayout';
import HomePage from './pages/HomePage';
import ProjectLocationPage from './pages/ProjectLocationPage';
import ConstructionPackagePage from './pages/ConstructionPackagePage';
import PackageSelectionPage from './pages/PackageSelectionPage';
import OptimizationLoaderPage from './pages/OptimizationLoaderPage';
import OptimizationResultsPage from './pages/OptimizationResultsPage';
import ConstructionCostEstimate from './pages/ConstructionCostEstimate';
import InteriorLocationPage from './pages/InteriorLocationPage';
import InteriorPackagePage from './pages/InteriorPackagePage';
import InteriorRoomSelectionPage from './pages/InteriorRoomSelectionPage';
import InteriorRoomConfigPage from './pages/InteriorRoomConfigPage';
import InteriorTotalCostPage from './pages/InteriorTotalCostPage';
import EmiCalculatorPage from './pages/EmiCalculatorPage';
import TotalProjectCostPage from './pages/TotalProjectCostPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SettingsPage from './pages/SettingsPage';
import ProfileAccountPage from './pages/ProfileAccountPage';
import PrivacySecurityPage from './pages/PrivacySecurityPage';
import HelpSupportPage from './pages/HelpSupportPage';
import AboutAppPage from './pages/AboutAppPage';
import MyProjectsPage from './pages/MyProjectsPage';
import ContactUsPage from './pages/ContactUsPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import OtpVerificationPage from './pages/OtpVerificationPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

import ScrollToTop from './components/ScrollToTop';

function App() {
    return (
        <ProjectProvider>
            <BrowserRouter>
                <ScrollToTop />
                <Routes>
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/construction/location" element={<ProjectLocationPage />} />
                        <Route path="/construction/package" element={<ConstructionPackagePage />} />
                        <Route path="/construction/selection/:packageType" element={<PackageSelectionPage />} />
                        <Route path="/construction/optimization/:packageType" element={<OptimizationLoaderPage />} />
                        <Route path="/construction/optimization-results/:packageType" element={<OptimizationResultsPage />} />
                        <Route path="/construction/cost-estimate/:packageType" element={<ConstructionCostEstimate />} />

                        <Route path="/interior/location" element={<InteriorLocationPage />} />
                        <Route path="/interior/package" element={<InteriorPackagePage />} />
                        <Route path="/interior/selection/:packageType" element={<InteriorRoomSelectionPage />} />
                        <Route path="/interior/room-config/:roomName" element={<InteriorRoomConfigPage />} />
                        <Route path="/interior/total-cost/:packageType" element={<InteriorTotalCostPage />} />

                        <Route path="/emi" element={<EmiCalculatorPage />} />
                        <Route path="/total-cost" element={<TotalProjectCostPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/profile_account" element={<ProfileAccountPage />} />
                        <Route path="/privacy_security" element={<PrivacySecurityPage />} />
                        <Route path="/help_support" element={<HelpSupportPage />} />
                        <Route path="/about_app" element={<AboutAppPage />} />
                        <Route path="/projects" element={<MyProjectsPage />} />
                        <Route path="/contact" element={<ContactUsPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/verify-otp" element={<OtpVerificationPage />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ProjectProvider>
    );
}

export default App;
