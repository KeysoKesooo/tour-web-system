'use client';

import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { useUsers } from '@/hooks/UseUser';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Role } from '@/types/RoleAction';
import { Toast } from '@/components/ui/Toast';
import { ConfirmDelete } from '@/components/ui/ConfirmModal';

export default function AdminUsersPage() {
  const {
    filteredUsers,
    loading,
    searchTerm,
    setSearchTerm,
    showModal,
    openModal,
    closeModal,
    editingUser,
    formData,
    setFormData,
    handleSubmit,
    handleDelete,
    toasts,
    removeToast,
    confirmModal,
  } = useUsers();


  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading users...</div>
      </div>
    );

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold">User Management</h1>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              onClick={() => openModal()}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              <Plus className="w-4 h-4" /> Create User
            </Button>
          </div>
        </div>

        {/* Users Table */}

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Role</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4 capitalize">{user.role}</td>
                  <td className="px-6 py-4 flex justify-end gap-2">
                    <Button onClick={() => openModal(user)} variant="secondary" size="sm">
                      <Edit className="w-4 h-4" /> Edit
                    </Button>
                    <Button onClick={() => handleDelete(user)} variant="secondary" size="sm">
                      <Trash2 className="w-4 h-4" /> Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Confirm Delete Modal */}
        {confirmModal}

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-gray-500">No users found</div>
        )}
      </div>

      {/* Modal for create/edit */}
      <Modal
        open={showModal}
        onClose={closeModal}
        title={editingUser ? 'Edit User' : 'Create New User'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {!editingUser && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Password *</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Role *</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {Object.values(Role).map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit">{editingUser ? 'Update User' : 'Create User'}</Button>
          </div>
        </form>
      </Modal>

      {/* toast messages */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </div>
  );
}
