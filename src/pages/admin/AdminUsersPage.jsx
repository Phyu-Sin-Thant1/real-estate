import React, { useState } from 'react';
import { users } from '../../mock/adminData';

const AdminUsersPage = () => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const roles = ['ALL', 'USER', 'BUSINESS_REAL_ESTATE', 'BUSINESS_DELIVERY', 'ADMIN'];
  const statuses = ['ALL', 'ACTIVE', 'INACTIVE'];

  const filteredUsers = users.filter(user => {
    const roleMatch = roleFilter === 'ALL' || user.role === roleFilter;
    const statusMatch = statusFilter === 'ALL' || user.status === statusFilter;
    return roleMatch && statusMatch;
  });

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleClass = (role) => {
    switch (role) {
      case 'USER': return 'bg-blue-100 text-blue-800';
      case 'BUSINESS_REAL_ESTATE': return 'bg-purple-100 text-purple-800';
      case 'BUSINESS_DELIVERY': return 'bg-indigo-100 text-indigo-800';
      case 'ADMIN': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-dabang-primary/10 via-indigo-50/50 to-purple-50/30 rounded-2xl p-6 border border-dabang-primary/20">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-dabang-primary to-indigo-600 bg-clip-text text-transparent">
          Users Management
        </h1>
        <p className="text-gray-600 mt-2 font-medium">Manage platform users and their roles</p>
      </div>

      {/* Premium Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-shadow duration-300">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-dabang-primary focus:ring-dabang-primary"
            >
              {roles.map(role => (
                <option key={role} value={role}>
                  {role === 'ALL' ? 'All Roles' : role.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-dabang-primary focus:ring-dabang-primary"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'ALL' ? 'All Statuses' : status}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setRoleFilter('ALL');
                setStatusFilter('ALL');
              }}
              className="px-5 py-2.5 border border-gray-300 text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Premium Users Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-dabang-primary border-gray-300 rounded focus:ring-dabang-primary"
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/30 transition-all duration-200 border-b border-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="h-4 w-4 text-dabang-primary border-gray-300 rounded focus:ring-dabang-primary"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleClass(user.role)}`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLoginAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <select className="text-sm rounded-lg border-gray-300 focus:border-dabang-primary focus:ring-2 focus:ring-dabang-primary shadow-sm px-3 py-1.5 font-medium">
                        <option>Change Role</option>
                        <option>USER</option>
                        <option>BUSINESS_REAL_ESTATE</option>
                        <option>BUSINESS_DELIVERY</option>
                        <option>ADMIN</option>
                      </select>
                      <button className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors shadow-sm hover:shadow-md">
                        Deactivate
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;