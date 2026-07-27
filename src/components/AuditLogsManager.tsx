import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Activity, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Shield, 
  User, 
  Calendar, 
  Clock, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  Key, 
  ShieldAlert,
  Building2,
  HardDrive
} from 'lucide-react';
import { AuditLog } from '../types';
import { safeConfirm } from '../utils/safeConfirm';
import { isSuperAdmin } from '../utils/permissions';

export function AuditLogsManager() {
  const { auditLogs, clearAuditLogs, currentUser, departments, allSystemUsers } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const getDeptName = (id?: string) => {
    if (!id) return null;
    if (id === '*') return 'All Departments';
    const dept = departments.find(d => d.id === id);
    return dept ? dept.name : id;
  };

  const getActionBadge = (action: AuditLog['action']) => {
    switch (action) {
      case 'CREATE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" /> Create
          </span>
        );
      case 'UPDATE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-100 text-blue-800 border border-blue-200">
            <RefreshCw className="w-3 h-3 mr-1 text-blue-600" /> Update
          </span>
        );
      case 'SOFT_DELETE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 border border-amber-200">
            <Trash2 className="w-3 h-3 mr-1 text-amber-600" /> Soft Delete
          </span>
        );
      case 'RESTORE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-teal-100 text-teal-800 border border-teal-200">
            <RefreshCw className="w-3 h-3 mr-1 text-teal-600" /> Restore
          </span>
        );
      case 'HARD_DELETE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-100 text-red-800 border border-red-200">
            <AlertTriangle className="w-3 h-3 mr-1 text-red-600" /> Hard Delete
          </span>
        );
      case 'SESSION_SWITCH':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-100 text-purple-800 border border-purple-200">
            <Key className="w-3 h-3 mr-1 text-purple-600" /> Session Switch
          </span>
        );
      case 'PERMISSIONS_UPDATE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-100 text-indigo-800 border border-indigo-200">
            <Shield className="w-3 h-3 mr-1 text-indigo-600" /> Role Permissions
          </span>
        );
      case 'GLOBAL_SETTINGS_UPDATE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-orange-100 text-orange-800 border border-orange-200">
            <ShieldAlert className="w-3 h-3 mr-1 text-orange-600" /> Global Settings
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-gray-100 text-gray-800 border border-gray-200">
            {action}
          </span>
        );
    }
  };

  // Filtered logs
  const filteredLogs = auditLogs.filter(log => {
    const query = searchQuery.toLowerCase();
    const matchesQuery = 
      log.userName.toLowerCase().includes(query) ||
      log.userEmail.toLowerCase().includes(query) ||
      log.details.toLowerCase().includes(query) ||
      log.module.toLowerCase().includes(query) ||
      log.action.toLowerCase().includes(query);

    const matchesModule = selectedModule === 'all' || log.module === selectedModule;
    const matchesAction = selectedAction === 'all' || log.action === selectedAction;
    const matchesUser = selectedUser === 'all' || log.userId === selectedUser;

    return matchesQuery && matchesModule && matchesAction && matchesUser;
  });

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredLogs.length === 0) return;

    const headers = ['ID', 'Timestamp', 'Staff Name', 'Email', 'Role', 'Action', 'Module', 'Department', 'Details', 'IP Address'];
    const rows = filteredLogs.map(log => [
      log.id,
      `"${log.timestamp}"`,
      `"${log.userName}"`,
      `"${log.userEmail}"`,
      `"${log.userRole}"`,
      `"${log.action}"`,
      `"${log.module}"`,
      `"${getDeptName(log.departmentId) || 'Global'}"`,
      `"${log.details.replace(/"/g, '""')}"`,
      `"${log.ipAddress || '127.0.0.1'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `taita_taveta_audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Stats calculations
  const highRiskCount = auditLogs.filter(l => l.action === 'SOFT_DELETE' || l.action === 'HARD_DELETE' || l.action === 'PERMISSIONS_UPDATE').length;
  const todayStr = new Date().toISOString().split('T')[0];
  const todayCount = auditLogs.filter(l => l.timestamp.startsWith(todayStr)).length;
  const uniqueUsersCount = new Set(auditLogs.map(l => l.userId)).size;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Activity className="w-6 h-6 mr-2.5 text-orange-600" />
            System Audit Logs & Staff Accountability
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Real-time immutable tracking of all content changes, session switches, soft deletions, and role modifications.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleExportCSV}
            disabled={filteredLogs.length === 0}
            className="inline-flex items-center px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Download className="w-4 h-4 mr-1.5" />
            Export Audit Trail (CSV)
          </button>

          {isSuperAdmin(currentUser) && (
            <button
              onClick={() => {
                if (safeConfirm('Are you sure you want to clear all system audit logs? This action is restricted to Super Admins.')) {
                  clearAuditLogs();
                }
              }}
              className="inline-flex items-center px-3 py-2 bg-gray-100 hover:bg-red-50 hover:text-red-700 text-gray-600 rounded-xl text-xs font-bold transition-all border border-gray-200"
              title="Clear log history"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-orange-50 to-amber-50/50 p-4 rounded-2xl border border-orange-100">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-700 block">Total Recorded Actions</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-gray-900">{auditLogs.length}</span>
            <span className="text-xs text-orange-700 font-semibold">Events</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-rose-50/50 p-4 rounded-2xl border border-red-100">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-700 block">Critical Actions Logged</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-gray-900">{highRiskCount}</span>
            <span className="text-xs text-red-700 font-semibold">Deletes & Roles</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-4 rounded-2xl border border-blue-100">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 block">Active Staff Officers</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-gray-900">{uniqueUsersCount}</span>
            <span className="text-xs text-blue-700 font-semibold">Tracked Users</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 p-4 rounded-2xl border border-emerald-100">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block">Activity Today</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-gray-900">{todayCount}</span>
            <span className="text-xs text-emerald-700 font-semibold">Actions Today</span>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search staff, action or keyword..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-xl pl-8 pr-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <select
            value={selectedModule}
            onChange={e => setSelectedModule(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Modules</option>
            <option value="Vacancies">Vacancies / Careers</option>
            <option value="News">News & Announcements</option>
            <option value="Events">Events Calendar</option>
            <option value="Documents">Official Documents</option>
            <option value="Users">User & Role Management</option>
            <option value="Departments">Departments</option>
            <option value="Emergency Alert">Emergency Alert</option>
            <option value="Hero Slideshow">Hero Slideshow</option>
            <option value="County Branding">County Branding</option>
            <option value="Governor Statement">Governor Statement</option>
            <option value="System">System Session</option>
          </select>
        </div>

        <div>
          <select
            value={selectedAction}
            onChange={e => setSelectedAction(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Action Types</option>
            <option value="CREATE">CREATE (New Items)</option>
            <option value="UPDATE">UPDATE (Modifications)</option>
            <option value="SOFT_DELETE">SOFT_DELETE (Moved to Trash)</option>
            <option value="RESTORE">RESTORE (Restored from Trash)</option>
            <option value="HARD_DELETE">HARD_DELETE (Permanent Delete)</option>
            <option value="SESSION_SWITCH">SESSION_SWITCH (Account Switch)</option>
            <option value="PERMISSIONS_UPDATE">PERMISSIONS_UPDATE (Role Edits)</option>
            <option value="GLOBAL_SETTINGS_UPDATE">GLOBAL_SETTINGS_UPDATE (Branding/Alerts)</option>
          </select>
        </div>

        <div>
          <select
            value={selectedUser}
            onChange={e => setSelectedUser(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Staff Officers</option>
            {allSystemUsers.map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-44">Date & Time</th>
                <th className="py-3 px-4 w-56">Staff Member</th>
                <th className="py-3 px-4 w-36">Action Type</th>
                <th className="py-3 px-4 w-36">Module / Scope</th>
                <th className="py-3 px-4">Action Summary</th>
                <th className="py-3 px-4 text-right w-16">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredLogs.map(log => {
                const isExpanded = expandedLogId === log.id;
                const deptName = getDeptName(log.departmentId);

                return (
                  <React.Fragment key={log.id}>
                    <tr 
                      className={`hover:bg-gray-50/80 transition-colors ${isExpanded ? 'bg-orange-50/30' : ''}`}
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center text-gray-700 font-medium text-[11px]">
                          <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-400 shrink-0" />
                          {log.timestamp}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div>
                          <strong className="text-gray-900 font-bold block text-xs">{log.userName}</strong>
                          <div className="flex items-center space-x-1 mt-0.5">
                            <span className="text-[10px] text-gray-500">{log.userEmail}</span>
                            <span className="text-[9px] px-1.5 py-0.2 bg-gray-100 text-gray-600 rounded font-bold">
                              {log.userRole}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        {getActionBadge(log.action)}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-800 rounded font-bold text-[10px] border border-gray-200">
                            {log.module}
                          </span>
                          {deptName && (
                            <div className="text-[10px] text-gray-500 flex items-center">
                              <Building2 className="w-2.5 h-2.5 mr-1 text-gray-400" />
                              <span className="truncate max-w-[120px]">{deptName}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <p className="text-gray-900 font-medium text-xs leading-relaxed">
                          {log.details}
                        </p>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                          className="p-1 hover:bg-gray-200 rounded-lg text-gray-500 transition-colors"
                          title="Toggle technical details"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Technical View */}
                    {isExpanded && (
                      <tr className="bg-gray-50/90 border-b border-gray-200">
                        <td colSpan={6} className="p-4">
                          <div className="bg-slate-900 text-slate-100 p-3.5 rounded-xl text-[11px] font-mono space-y-2 shadow-inner">
                            <div className="flex justify-between text-slate-400 text-[10px] border-b border-slate-800 pb-1.5">
                              <span>LOG EVENT ID: {log.id}</span>
                              <span>TERMINAL IP: {log.ipAddress || '197.232.88.14'}</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                              <div><span className="text-amber-400">User ID:</span> {log.userId}</div>
                              <div><span className="text-amber-400">User Role:</span> {log.userRole}</div>
                              <div><span className="text-amber-400">Module Target:</span> {log.module}</div>
                              <div><span className="text-amber-400">Department Scope:</span> {log.departmentId || 'Global / N/A'}</div>
                            </div>
                            <div className="pt-1">
                              <span className="text-emerald-400 block mb-0.5">Payload Description:</span>
                              <div className="bg-slate-950 p-2 rounded text-slate-200 border border-slate-800">
                                {log.details}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <Activity className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="font-semibold text-sm">No audit logs found matching your search filters.</p>
                    <p className="text-xs text-gray-400 mt-1">Try resetting the filters or searching with different keywords.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
