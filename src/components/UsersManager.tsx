import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Users, 
  UserPlus, 
  Search, 
  Shield, 
  CheckCircle2, 
  X, 
  Edit2, 
  Trash2, 
  RotateCcw, 
  Building2, 
  Key, 
  AlertTriangle, 
  UserCheck, 
  UserX, 
  ShieldAlert,
  Check,
  BadgeCheck
} from 'lucide-react';
import { SystemUser, UserRole, UserPermissions } from '../types';
import { safeConfirm } from '../utils/safeConfirm';
import { isSuperAdmin, canUserManageUsers } from '../utils/permissions';

export function UsersManager() {
  const { 
    allSystemUsers, 
    currentUser, 
    setCurrentUser, 
    saveSystemUser, 
    deleteSystemUser, 
    restoreSystemUser, 
    hardDeleteSystemUser,
    departments 
  } = useData();

  const [viewTab, setViewTab] = useState<'active' | 'trash'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  
  // Modal / Form state
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [payrollNumber, setPayrollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Communication Officer');
  const [selectedDeptIds, setSelectedDeptIds] = useState<string[]>([]);
  const [status, setStatus] = useState<'Active' | 'Suspended'>('Active');
  const [permissions, setPermissions] = useState<UserPermissions>({
    canAdd: true,
    canEdit: true,
    canSoftDelete: true,
    canHardDelete: false,
    canManageUsers: false,
    canManageGlobalSettings: false,
  });

  const getDeptName = (id: string) => {
    if (id === '*') return 'All Departments';
    const d = departments.find(dept => dept.id === id);
    return d ? d.name : id;
  };

  const handleStartCreate = () => {
    setName('');
    setEmail('');
    setPayrollNumber('');
    setPassword('admin123');
    setRole('Communication Officer');
    setSelectedDeptIds(departments[0] ? [departments[0].id] : []);
    setStatus('Active');
    setPermissions({
      canAdd: true,
      canEdit: true,
      canSoftDelete: true,
      canHardDelete: false,
      canManageUsers: false,
      canManageGlobalSettings: false,
    });
    setSelectedUser(null);
    setIsEditing(true);
  };

  const handleStartEdit = (user: SystemUser) => {
    setName(user.name);
    setEmail(user.email);
    setPayrollNumber(user.payrollNumber || '');
    setPassword(user.password || 'admin123');
    setRole(user.role);
    setSelectedDeptIds(user.departmentIds);
    setStatus(user.status);
    setPermissions(user.permissions);
    setSelectedUser(user);
    setIsEditing(true);
  };

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'Super Admin') {
      setSelectedDeptIds(['*']);
      setPermissions({
        canAdd: true,
        canEdit: true,
        canSoftDelete: true,
        canHardDelete: true,
        canManageUsers: true,
        canManageGlobalSettings: true,
      });
    } else if (newRole === 'Communication Officer') {
      if (selectedDeptIds.includes('*') || selectedDeptIds.length === 0) {
        setSelectedDeptIds(departments[0] ? [departments[0].id] : []);
      }
      setPermissions({
        canAdd: true,
        canEdit: true,
        canSoftDelete: true,
        canHardDelete: false,
        canManageUsers: false,
        canManageGlobalSettings: false,
      });
    } else if (newRole === 'Department Admin') {
      if (selectedDeptIds.includes('*') || selectedDeptIds.length === 0) {
        setSelectedDeptIds(departments[0] ? [departments[0].id] : []);
      }
      setPermissions({
        canAdd: true,
        canEdit: true,
        canSoftDelete: true,
        canHardDelete: false,
        canManageUsers: false,
        canManageGlobalSettings: false,
      });
    } else if (newRole === 'Auditor') {
      setSelectedDeptIds(['*']);
      setPermissions({
        canAdd: false,
        canEdit: false,
        canSoftDelete: false,
        canHardDelete: false,
        canManageUsers: false,
        canManageGlobalSettings: false,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const userObj: SystemUser = {
      id: selectedUser ? selectedUser.id : `usr-${Date.now()}`,
      name,
      email,
      payrollNumber: payrollNumber.trim() || undefined,
      password: password.trim() || 'admin123',
      role,
      departmentIds: role === 'Super Admin' || role === 'Auditor' ? ['*'] : selectedDeptIds,
      status,
      createdAt: selectedUser ? selectedUser.createdAt : new Date().toISOString().split('T')[0],
      lastLogin: selectedUser ? selectedUser.lastLogin : 'Just created',
      permissions,
      deleted: false
    };

    saveSystemUser(userObj);
    setIsEditing(false);
    setSelectedUser(null);
  };

  // Filtered lists
  const activeUsers = allSystemUsers.filter(u => !u.deleted);
  const trashedUsers = allSystemUsers.filter(u => u.deleted);

  const displayedUsers = (viewTab === 'active' ? activeUsers : trashedUsers).filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (r: UserRole) => {
    switch (r) {
      case 'Super Admin': return 'bg-green-100 text-green-800 border-green-200';
      case 'Communication Officer': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Department Admin': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Auditor': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const canEditUsers = canUserManageUsers(currentUser);

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Users className="w-6 h-6 mr-2.5 text-green-700" />
            User & Role Management
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Assign communication officers to specific departments, manage administrative roles, and configure soft delete permissions.
          </p>
        </div>

        {canEditUsers && (
          <button
            onClick={handleStartCreate}
            className="inline-flex items-center px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm shrink-0"
          >
            <UserPlus className="w-4 h-4 mr-1.5" />
            Add New System User
          </button>
        )}
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50/50 p-4 rounded-2xl border border-green-100">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-green-700 block">Total System Users</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-gray-900">{activeUsers.length}</span>
            <span className="text-xs text-green-700 font-semibold">Registered</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-4 rounded-2xl border border-blue-100">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 block">Communication Officers</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-gray-900">
              {activeUsers.filter(u => u.role === 'Communication Officer').length}
            </span>
            <span className="text-xs text-blue-700 font-semibold">Dept Scoped</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-50/50 p-4 rounded-2xl border border-purple-100">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 block">Super Administrators</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-gray-900">
              {activeUsers.filter(u => u.role === 'Super Admin').length}
            </span>
            <span className="text-xs text-purple-700 font-semibold">Full Authority</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 p-4 rounded-2xl border border-amber-100">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 block">Trash / Suspended</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-gray-900">
              {trashedUsers.length + activeUsers.filter(u => u.status === 'Suspended').length}
            </span>
            <span className="text-xs text-amber-700 font-semibold">Soft Deleted / On Hold</span>
          </div>
        </div>
      </div>

      {/* Tabs & Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50 p-3 rounded-2xl border border-gray-200">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewTab('active')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewTab === 'active' 
                ? 'bg-white text-green-800 shadow-xs border border-gray-200' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Active Users ({activeUsers.length})
          </button>
          <button
            onClick={() => setViewTab('trash')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center ${
              viewTab === 'trash' 
                ? 'bg-red-50 text-red-700 shadow-xs border border-red-200' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Trash Bin ({trashedUsers.length})
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search user or email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl pl-8 pr-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Roles</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Communication Officer">Communication Officer</option>
            <option value="Department Admin">Department Admin</option>
            <option value="Auditor">Auditor</option>
          </select>
        </div>
      </div>

      {/* User Form Modal */}
      {isEditing && (
        <div className="bg-white rounded-2xl p-6 border-2 border-green-700 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <h3 className="font-bold text-sm text-gray-900 flex items-center">
              <Shield className="w-4 h-4 mr-2 text-green-700" />
              {selectedUser ? `Edit User Permissions: ${selectedUser.name}` : 'Create New System User'}
            </h3>
            <button
              onClick={() => { setIsEditing(false); setSelectedUser(null); }}
              className="p-1 hover:bg-gray-100 rounded-lg text-gray-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Dr. Mercy Mwakio"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white text-sm focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Official Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. mercy.mwakio@taitataveta.go.ke"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white text-sm focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">System Role *</label>
                <select
                  value={role}
                  onChange={e => handleRoleChange(e.target.value as UserRole)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white text-xs font-bold focus:ring-2 focus:ring-green-500 outline-none"
                >
                  <option value="Communication Officer">Communication Officer (Dept Restricted)</option>
                  <option value="Super Admin">Super Admin (Full System Access)</option>
                  <option value="Department Admin">Department Admin (Dept Management)</option>
                  <option value="Auditor">Auditor (Read-Only Inspection)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Account Status *</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white text-xs font-bold focus:ring-2 focus:ring-green-500 outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended (Access Disabled)</option>
                </select>
              </div>
            </div>

            {/* Department Assignment for Communication Officers */}
            {role !== 'Super Admin' && role !== 'Auditor' && (
              <div className="bg-blue-50/80 p-4 rounded-xl border border-blue-200">
                <label className="block font-bold text-blue-900 mb-1.5 flex items-center">
                  <Building2 className="w-4 h-4 mr-1 text-blue-700" />
                  Assigned Department Scope * (Select all permitted departments)
                </label>
                <p className="text-[11px] text-blue-700 mb-2">
                  This user will ONLY be able to publish, edit, or soft-delete news, events, documents, and vacancies belonging to these selected departments.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto bg-white p-2.5 rounded-lg border border-blue-200">
                  {departments.map(d => {
                    const checked = selectedDeptIds.includes(d.id);
                    return (
                      <label key={d.id} className="flex items-center space-x-2 text-xs text-gray-800 cursor-pointer hover:bg-blue-50 p-1 rounded">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={e => {
                            if (e.target.checked) {
                              setSelectedDeptIds([...selectedDeptIds, d.id]);
                            } else {
                              if (selectedDeptIds.length > 1) {
                                setSelectedDeptIds(selectedDeptIds.filter(id => id !== d.id));
                              }
                            }
                          }}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className="font-medium">{d.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Granular Permissions Matrix */}
            <div>
              <label className="block font-bold text-gray-700 mb-2">Granular Action Permissions Matrix</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <label className="flex items-center space-x-2 text-xs text-gray-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.canAdd}
                    onChange={e => setPermissions({ ...permissions, canAdd: e.target.checked })}
                    className="rounded text-green-600 focus:ring-green-500"
                  />
                  <span>Can Add Content</span>
                </label>

                <label className="flex items-center space-x-2 text-xs text-gray-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.canEdit}
                    onChange={e => setPermissions({ ...permissions, canEdit: e.target.checked })}
                    className="rounded text-green-600 focus:ring-green-500"
                  />
                  <span>Can Edit Content</span>
                </label>

                <label className="flex items-center space-x-2 text-xs text-gray-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.canSoftDelete}
                    onChange={e => setPermissions({ ...permissions, canSoftDelete: e.target.checked })}
                    className="rounded text-green-600 focus:ring-green-500"
                  />
                  <span>Can Soft Delete Items</span>
                </label>

                <label className="flex items-center space-x-2 text-xs text-gray-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.canHardDelete}
                    onChange={e => setPermissions({ ...permissions, canHardDelete: e.target.checked })}
                    className="rounded text-green-600 focus:ring-green-500"
                  />
                  <span>Can Hard Delete (Super Admin)</span>
                </label>

                <label className="flex items-center space-x-2 text-xs text-gray-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.canManageUsers}
                    onChange={e => setPermissions({ ...permissions, canManageUsers: e.target.checked })}
                    className="rounded text-green-600 focus:ring-green-500"
                  />
                  <span>Can Manage System Users</span>
                </label>

                <label className="flex items-center space-x-2 text-xs text-gray-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions.canManageGlobalSettings}
                    onChange={e => setPermissions({ ...permissions, canManageGlobalSettings: e.target.checked })}
                    className="rounded text-green-600 focus:ring-green-500"
                  />
                  <span>Can Edit Global Branding & Alerts</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-gray-200">
              <button
                type="button"
                onClick={() => { setIsEditing(false); setSelectedUser(null); }}
                className="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl text-xs shadow-sm"
              >
                Save User Permissions
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4">User Officer</th>
                <th className="py-3 px-4">Role & Status</th>
                <th className="py-3 px-4">Assigned Department Scope</th>
                <th className="py-3 px-4">Permissions Matrix</th>
                <th className="py-3 px-4">Created / Last Login</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {displayedUsers.map(usr => {
                const isCurrentSessionUser = usr.id === currentUser.id;
                const usrDepts = usr.departmentIds.includes('*')
                  ? ['All Departments (Unrestricted)']
                  : usr.departmentIds.map(getDeptName);

                return (
                  <tr key={usr.id} className={`hover:bg-gray-50/80 transition-colors ${isCurrentSessionUser ? 'bg-green-50/40' : ''}`}>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-gray-100 border border-gray-200 text-gray-700 font-bold flex items-center justify-center shrink-0">
                          {usr.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <strong className="text-gray-900 font-bold block text-sm">{usr.name}</strong>
                            {isCurrentSessionUser && (
                              <span className="px-2 py-0.5 bg-green-600 text-white text-[9px] font-black rounded-md">
                                ACTIVE SESSION
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-gray-500">{usr.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <span className={`inline-block px-2.5 py-0.5 rounded font-bold text-[10px] uppercase border ${getRoleBadgeColor(usr.role)}`}>
                          {usr.role}
                        </span>
                        <div>
                          {usr.status === 'Active' ? (
                            <span className="inline-flex items-center text-[10px] font-semibold text-green-700">
                              <CheckCircle2 className="w-3 h-3 mr-1" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-[10px] font-semibold text-red-600">
                              <UserX className="w-3 h-3 mr-1" /> Suspended
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {usrDepts.map((dName, i) => (
                          <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-[10px] font-medium border border-gray-200">
                            {dName}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 text-[10px]">
                        {usr.permissions.canAdd && <span className="px-1.5 py-0.5 bg-green-50 text-green-800 rounded font-semibold">+Add</span>}
                        {usr.permissions.canEdit && <span className="px-1.5 py-0.5 bg-blue-50 text-blue-800 rounded font-semibold">✏️Edit</span>}
                        {usr.permissions.canSoftDelete && <span className="px-1.5 py-0.5 bg-amber-50 text-amber-800 rounded font-semibold">🗑️SoftDel</span>}
                        {usr.permissions.canHardDelete && <span className="px-1.5 py-0.5 bg-red-50 text-red-800 rounded font-semibold">⚠️HardDel</span>}
                        {usr.permissions.canManageUsers && <span className="px-1.5 py-0.5 bg-purple-50 text-purple-800 rounded font-semibold">👥Users</span>}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-[11px] text-gray-600 block">{usr.createdAt}</span>
                      <span className="text-[10px] text-gray-400 block">Login: {usr.lastLogin || 'N/A'}</span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      {viewTab === 'active' ? (
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            type="button"
                            onClick={() => setCurrentUser(usr)}
                            title="Switch active session to this user"
                            className="px-2 py-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg text-[11px] font-bold transition-colors inline-flex items-center"
                          >
                            <Key className="w-3 h-3 mr-1 text-emerald-600" />
                            Switch
                          </button>

                          {canEditUsers && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleStartEdit(usr)}
                                className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-[11px] font-bold transition-colors"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  if (safeConfirm(`Soft delete user account for ${usr.name}?`)) {
                                    deleteSystemUser(usr.id);
                                  }
                                }}
                                className="px-2 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-[11px] font-bold transition-colors"
                              >
                                Soft Delete
                              </button>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            type="button"
                            onClick={() => restoreSystemUser(usr.id)}
                            className="px-2.5 py-1 bg-green-50 text-green-800 hover:bg-green-100 rounded-lg text-[11px] font-bold transition-colors inline-flex items-center"
                          >
                            <RotateCcw className="w-3 h-3 mr-1" />
                            Restore
                          </button>

                          {isSuperAdmin(currentUser) && (
                            <button
                              type="button"
                              onClick={() => {
                                if (safeConfirm(`PERMANENTLY hard delete user account for ${usr.name}? This cannot be undone.`)) {
                                  hardDeleteSystemUser(usr.id);
                                }
                              }}
                              className="px-2.5 py-1 bg-red-600 text-white hover:bg-red-700 rounded-lg text-[11px] font-bold transition-colors"
                            >
                              Hard Delete
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}

              {displayedUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    {viewTab === 'active' 
                      ? 'No active users found matching your search.' 
                      : 'Trash bin is empty. No soft-deleted users.'}
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
