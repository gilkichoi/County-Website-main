import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { UserCheck, Shield, ChevronDown, Check, Building2, Lock, Sparkles, Key, AlertCircle } from 'lucide-react';
import { SystemUser } from '../types';
import { isSuperAdmin, isCommunicationOfficer } from '../utils/permissions';

export function UserSessionBar() {
  const { currentUser, setCurrentUser, allSystemUsers, departments } = useData();
  const [isOpen, setIsOpen] = useState(false);

  const getDeptName = (id: string) => {
    if (id === '*') return 'All Departments';
    const dept = departments.find(d => d.id === id);
    return dept ? dept.name : id;
  };

  const activeUserDepts = currentUser.departmentIds.includes('*') 
    ? 'All Departments (Full Access)' 
    : currentUser.departmentIds.map(getDeptName).join(', ');

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Super Admin':
        return 'bg-green-700 text-white border-green-800';
      case 'Communication Officer':
        return 'bg-blue-600 text-white border-blue-700';
      case 'Department Admin':
        return 'bg-purple-600 text-white border-purple-700';
      case 'Auditor':
        return 'bg-amber-600 text-white border-amber-700';
      default:
        return 'bg-gray-600 text-white border-gray-700';
    }
  };

  return (
    <div className="mb-8 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-700 relative overflow-hidden">
      {/* Background Accent glow */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start sm:items-center space-x-3.5">
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-xl bg-slate-700/80 border border-slate-600 flex items-center justify-center text-emerald-400 font-bold text-lg shadow-inner">
              {currentUser.name.charAt(0)}
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full" title="Session Active" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-bold text-base text-white">{currentUser.name}</h2>
              <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider border shadow-2xs ${getRoleBadgeColor(currentUser.role)}`}>
                {currentUser.role}
              </span>
              {currentUser.status === 'Suspended' && (
                <span className="px-2 py-0.5 bg-red-600 text-white rounded-md text-[10px] font-bold">
                  ACCOUNT SUSPENDED
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center text-xs text-slate-300 mt-1 gap-x-3 gap-y-1">
              <span className="text-slate-400">{currentUser.email}</span>
              <span className="text-slate-500">•</span>
              <span className="flex items-center text-emerald-300 font-medium">
                <Building2 className="w-3.5 h-3.5 mr-1 text-emerald-400 shrink-0" />
                Scope: <strong className="ml-1 text-white">{activeUserDepts}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* User Switcher Dropdown */}
        <div className="relative shrink-0">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full sm:w-auto inline-flex items-center justify-between px-4 py-2.5 bg-slate-800/90 hover:bg-slate-700/90 text-white rounded-xl text-xs font-bold border border-slate-600 transition-all shadow-sm group"
          >
            <div className="flex items-center">
              <Key className="w-4 h-4 mr-2 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Switch Active Session</span>
            </div>
            <ChevronDown className={`w-4 h-4 ml-2 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 rounded-t-2xl">
                <span className="text-xs font-bold text-slate-700 flex items-center">
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-500" />
                  Select System User
                </span>
                <span className="text-[10px] font-semibold text-slate-400">
                  {allSystemUsers.filter(u => !u.deleted).length} Accounts
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 p-1">
                {allSystemUsers.filter(u => !u.deleted).map(usr => {
                  const isSelected = usr.id === currentUser.id;
                  const usrDepts = usr.departmentIds.includes('*')
                    ? 'All Departments'
                    : usr.departmentIds.map(getDeptName).join(', ');

                  return (
                    <button
                      key={usr.id}
                      onClick={() => {
                        setCurrentUser(usr);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start justify-between space-x-2 ${
                        isSelected 
                          ? 'bg-emerald-50/80 border border-emerald-200' 
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start space-x-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 font-bold text-slate-700 flex items-center justify-center shrink-0 border border-slate-200 text-xs">
                          {usr.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-1.5">
                            <span className="font-bold text-xs text-slate-900 truncate">{usr.name}</span>
                            {isSelected && (
                              <span className="px-1.5 py-0.2 bg-emerald-600 text-white text-[9px] font-extrabold rounded">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 truncate">{usr.email}</p>
                          <p className="text-[10px] text-emerald-800 font-medium truncate mt-0.5">
                            🏢 {usrDepts}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end shrink-0">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${getRoleBadgeColor(usr.role)}`}>
                          {usr.role}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-emerald-600 mt-2" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scope Banner explanation */}
      {isCommunicationOfficer(currentUser) && (
        <div className="mt-3.5 bg-blue-500/20 border border-blue-400/30 rounded-xl px-3.5 py-2 flex items-center space-x-2 text-xs text-blue-100">
          <AlertCircle className="w-4 h-4 text-blue-300 shrink-0" />
          <span>
            <strong>Communication Officer Mode:</strong> You have restricted permissions to add and edit content <strong>ONLY</strong> for your assigned department(s): <strong className="text-white underline">{activeUserDepts}</strong>. Content for other departments is read-only.
          </span>
        </div>
      )}

      {isSuperAdmin(currentUser) && (
        <div className="mt-3.5 bg-emerald-500/20 border border-emerald-400/30 rounded-xl px-3.5 py-2 flex items-center space-x-2 text-xs text-emerald-100">
          <Shield className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>
            <strong>Super Administrator Mode:</strong> Full unrestricted authority to manage all departments, publish news/events/documents, soft-delete or restore records, configure emergency alerts, and manage user permissions.
          </span>
        </div>
      )}
    </div>
  );
}
