'use client';

import { useState, useEffect } from 'react';
import { IUser } from '@/types/IntUser';
import { Role } from '@/types/RoleAction';
import { ToastMessage } from '@/types/IntToast';
import { createPortal } from 'react-dom';
import { useMemo } from 'react';
import { ConfirmDelete } from '@/components/ui/ConfirmModal';


export function useUsers() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: Role.STAFF,
  });

  // Toast state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
  };
  const removeToast = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  // Confirm modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<IUser | null>(null);

  const openConfirm = (user: IUser) => {
    setDeletingUser(user);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser) return;
    try {
      const res = await fetch(`/api/admin/users/${deletingUser.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || 'Failed to delete user');
      }
      setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
      showToast('User deleted successfully!');
    } catch (err: any) {
      setError(err.message);
      showToast(err.message, 'error');
    } finally {
      setConfirmOpen(false);
      setDeletingUser(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setDeletingUser(null);
  };

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/users', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data.users?.map((u: any) => u.user) || []);
    } catch (err: any) {
      setError(err.message);
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Modal controls for create/edit
  const openModal = (user?: IUser) => {
    if (user) {
      setEditingUser(user);
      setFormData({ name: user.name, email: user.email, password: '', role: user.role });
    } else {
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', role: Role.STAFF });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  // Submit user (create/update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const payload: any = { ...formData };
      if (!payload.password) delete payload.password;

      const url = editingUser ? `/api/admin/users/${editingUser.id}` : '/api/admin/users';
      const method = editingUser ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || 'Failed to save user');
      }

      await fetchUsers();
      closeModal();
      showToast(editingUser ? 'User updated successfully!' : 'User created successfully!');
    } catch (err: any) {
      setError(err.message);
      showToast(err.message, 'error');
    }
  };

 const confirmModal = useMemo(() => {
  if (typeof window === "undefined") return null;
  return createPortal(
    <ConfirmDelete
      isOpen={confirmOpen}
      onClose={handleCancelDelete}
      onConfirm={handleConfirmDelete}
      title="Delete User"
      message={`Are you sure you want to delete "${deletingUser?.name}"?`}
      confirmText="Delete"
      cancelText="Cancel"
      confirmColor="bg-red-600 hover:bg-red-700"
    />,
    document.body
  );
}, [confirmOpen, deletingUser]);



  // Filtered users
  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    filteredUsers,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    showModal,
    openModal,
    closeModal,
    editingUser,
    formData,
    setFormData,
    handleSubmit,
    handleDelete: openConfirm,
    refresh: fetchUsers,
    toasts,
    removeToast,
    confirmModal, // <<< JUST THIS in the page!
  };

}
