"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { 
  User, 
  Mail, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Shield, 
  Key, 
  Bell, 
  LogOut, 
  Sun, 
  Moon, 
  Camera, 
  Edit3, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Loader2
} from "lucide-react";
import { useClientSession } from "@/app/lib/session";

// --- Types ---
interface UserProfile {
  name: string;
  role?: string;
  company?: string;
  location?: string;
  email: string;
  joinedDate?: string;
  avatarUrl?: string;
  bio?: string;
}

export default function UserProfilePage() {
  // --- Session Hook ---
  const { user, isPending } = useClientSession();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const darkMode = mounted && theme === "dark";

  // --- State Hooks ---
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications">("profile");
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Local editable form state
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Sync state when session data dynamically resolves
  useEffect(() => {
    if (user) {
      setProfile(user);
    }
  }, [user]);

  // Toggle visual theme helper
//   const toggleTheme = () => setDarkMode(!darkMode);

  // Fallback isPending Shell Interface
  if (isPending || !profile) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-sm font-medium opacity-60 tracking-wide">Syncing Session Credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative transition-colors duration-500 ease-in-out font-sans overflow-hidden ${darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      
      {/* Dynamic Ambient Glow Gradients (Optimized opacity matching for Light and Dark surfaces) */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/20 rounded-full blur-3xl pointer-events-none animate-pulse duration-[6000ms]" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/20 rounded-full blur-3xl pointer-events-none animate-pulse duration-[8000ms]" />

      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
        
        {/* --- Top Navigation Header --- */}
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-slate-200/60 dark:border-slate-800/50">
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Console Core
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-500">Account Management Panel</p>
          </div>

          {/* Theme Toggler Button */}
          {/* <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-slate-200 shadow-sm bg-white dark:bg-slate-900/40 backdrop-blur-md hover:scale-105 transition-all text-slate-600 dark:text-slate-300"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-600" />}
          </button> */}
        </header>

        {/* --- Hero Banner & User Identity Block --- */}
        <div className="mb-8 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/30 backdrop-blur-xl shadow-md dark:shadow-xl transition-all duration-300 animate-fadeIn">
          {/* Cover Photo Backdrop */}
          <div className="h-32 sm:h-44 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 dark:from-blue-600/20 dark:via-indigo-600/20 dark:to-purple-600/20 relative" />
          
          {/* Main User Metadata Block */}
          <div className="p-6 pt-0 sm:flex items-end justify-between -mt-16 sm:-mt-20 gap-6 border-b border-slate-200/60 dark:border-slate-800/30">
            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 sm:gap-6">
              {/* Profile Photo Wrapper */}
              <div className="relative group rounded-2xl ring-4 ring-white dark:ring-slate-950 overflow-hidden shadow-md bg-slate-200 dark:bg-slate-800 h-28 w-28 sm:h-36 sm:w-36 transition-transform duration-300 hover:scale-[1.02]">
                <img 
                  src={profile.avatarUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} 
                  alt={profile.name} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <Camera className="h-6 w-6 text-white" />
                </div>
              </div>

              {/* Text Meta Fields */}
              <div className="sm:pb-2">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h2 className="text-2xl font-bold tracking-tight">
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="text-xl font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-0.5 max-w-[200px] text-slate-900 dark:text-slate-100 focus:outline-blue-500"
                      />
                    ) : (
                      profile.name
                    )}
                  </h2>
                  <CheckCircle2 className="text-blue-600 dark:text-blue-500 fill-blue-500/20 h-5 w-5 shrink-0" />
                </div>
                
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-0.5">
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.role || ""}
                      placeholder="Role Title"
                      onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                      className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-0.5 mt-1 text-slate-900 dark:text-slate-100 focus:outline-blue-500"
                    />
                  ) : (
                    profile.role ?? "Member"
                  )}
                </p>
                
                {/* Micro Meta Rows */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 mt-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-slate-400" /> 
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.company || ""}
                        placeholder="Organization"
                        onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                        className="text-[11px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-1 py-0.5 text-slate-900 dark:text-slate-100 focus:outline-blue-500"
                      />
                    ) : (
                      profile.company ?? "Independent"
                    )}
                  </span>
                  
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" /> 
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.location || ""}
                        placeholder="Location"
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        className="text-[11px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-1 py-0.5 text-slate-900 dark:text-slate-100 focus:outline-blue-500"
                      />
                    ) : (
                      profile.location ?? "Remote"
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile CTA Edit Trigger */}
            <div className="mt-4 sm:mt-0 flex justify-center pb-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 shadow-sm ${
                  isEditing 
                    ? "bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-500" 
                    : "bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/90"
                }`}
              >
                <Edit3 className="h-4 w-4" />
                {isEditing ? "Save Configuration" : "Edit Profile"}
              </button>
            </div>
          </div>

          {/* Bio Overview Container */}
          <div className="p-6 bg-slate-50/50 dark:bg-slate-950/20 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            <span className="font-semibold text-xs uppercase tracking-wider text-slate-400 block mb-1.5">Executive Summary</span>
            {isEditing ? (
              <textarea
                value={profile.bio || ""}
                placeholder="Write a brief profile description..."
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded p-2 focus:outline-blue-500 h-20 resize-none text-slate-900 dark:text-slate-100"
              />
            ) : (
              profile.bio ?? "No account description summary configured yet."
            )}
          </div>
        </div>

        {/* --- Main Dashboard Panel Splits --- */}
        <div className="grid md:grid-cols-4 gap-6 items-start">
          
          {/* Side Control Tabs Nav */}
          <nav className="md:col-span-1 space-y-2 border border-slate-200/60 dark:border-slate-800/40 bg-white/80 dark:bg-slate-900/20 backdrop-blur-md rounded-2xl p-3 shadow-sm">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === "profile" 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/10 scale-[1.02]" 
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/30"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <User className="h-4 w-4" />
                Profile Metrics
              </div>
              <ChevronRight className={`h-4 w-4 opacity-60 transition-transform ${activeTab === "profile" ? "rotate-90" : ""}`} />
            </button>

            <button
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === "security" 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/10 scale-[1.02]" 
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/30"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Shield className="h-4 w-4" />
                Security Keys
              </div>
              <ChevronRight className={`h-4 w-4 opacity-60 transition-transform ${activeTab === "security" ? "rotate-90" : ""}`} />
            </button>

            <button
              onClick={() => setActiveTab("notifications")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === "notifications" 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/10 scale-[1.02]" 
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/30"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bell className="h-4 w-4" />
                Notification Directives
              </div>
              <ChevronRight className={`h-4 w-4 opacity-60 transition-transform ${activeTab === "notifications" ? "rotate-90" : ""}`} />
            </button>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800/40 mt-2">
              <button className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors">
                <LogOut className="h-4 w-4" />
                Terminate Session
              </button>
            </div>
          </nav>

          {/* Dynamic Tab Panel Viewport */}
          <main className="md:col-span-3 border border-slate-200/80 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/30 backdrop-blur-xl rounded-2xl p-6 shadow-md dark:shadow-xl transition-all duration-300">
            
            {/* VIEW A: PROFILE METRICS OVERVIEW */}
            {activeTab === "profile" && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">Profile Data Vectors</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Primary communication coordinates and organizational mappings.</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-950/40 space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Mail className="h-3 w-3" /> Registered E-Mail
                    </span>
                    {isEditing ? (
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-slate-900 dark:text-slate-100 focus:outline-blue-500"
                      />
                    ) : (
                      <p className="text-sm font-medium truncate text-slate-900 dark:text-slate-100">{profile.email}</p>
                    )}
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-950/40 space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" /> Node Registered
                    </span>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{profile.joinedDate ?? "N/A"}</p>
                  </div>
                </div>

                {/* Extended Stats Metrics Block */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800/20">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Enterprise Status</h4>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950/30 border border-slate-200/40 dark:border-slate-800/20">
                      <p className="text-xl font-black text-blue-600 dark:text-blue-500">28</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Deployments</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950/30 border border-slate-200/40 dark:border-slate-800/20">
                      <p className="text-xl font-black text-purple-600 dark:text-purple-500">99.9%</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Uptime SLA</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950/30 border border-slate-200/40 dark:border-slate-800/20">
                      <p className="text-xl font-black text-emerald-600 dark:text-emerald-500">4.9</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Review Score</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW B: SECURITY MANAGEMENT */}
            {activeTab === "security" && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">Security Cryptography</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage identity access layers and multi-factor authenticators.</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-950/40">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 text-blue-600 dark:text-blue-500 rounded-lg"><Key className="h-5 w-5" /></div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Two-Factor Authorization (2FA)</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Protects access via high entropy verification loops.</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">Active</span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-950/40">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/10 text-purple-600 dark:text-purple-500 rounded-lg"><Shield className="h-5 w-5" /></div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Hardware Security Keys</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Register external dynamic USB-C WebAuthn tokens.</p>
                      </div>
                    </div>
                    <button className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-0.5 hover:underline">Setup <ExternalLink className="h-3 w-3" /></button>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW C: NOTIFICATION MANAGEMENT */}
            {activeTab === "notifications" && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">Notification Channels</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Decide exactly how infrastructure reporting triggers reach your dashboard.</p>
                </div>

                <div className="space-y-3">
                  {["System Lifecycle Log Alerts", "API Budget Overruns & Usage Hooks", "Weekly Operational Diagnostic Summaries"].map((title, index) => (
                    <label key={index} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-950/40 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-950/60 transition-colors">
                      <div className="space-y-0.5">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Receive streaming events instantly via webhook layers.</p>
                      </div>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={index !== 1} className="sr-only peer" />
                        <div className="w-9 h-5 bg-slate-300 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}