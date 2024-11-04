import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataTable } from '../../components/admin/DataTable';
import { Modal } from '../../components/admin/Modal';
import { FormField } from '../../components/admin/FormField';
import { AdminLayout } from '../../components/admin/AdminLayout';

interface Parent {
  id: number;
  name: string;
  studentName: string;
  contactNumber: string;
  whatsappNumber: string;
  email: string;
}

export const ParentsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    whatsappNumber: '',
    studentId: '',
    password: '',
  });

  const { data: parents, isLoading } = useQuery({
    queryKey: ['parents'],
    queryFn: async () => {
      const response = await fetch('/api/admin/parents', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch parents');
      return response.json();
    },
  });

  const { data: students } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const response = await fetch('/api/admin/students', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch students');
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch('/api/admin/parents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ ...data, role: 'parent' }),
      });
      if (!response.ok) throw new Error('Failed to create parent');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] });
      setIsModalOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData & { id: number }) => {
      const response = await fetch(`/api/admin/parents/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update parent');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] });
      setIsModalOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/parents/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete parent');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] });
    },
  });

  const columns = [
    { key: 'name', header: 'Parent Name' },
    { key: 'studentName', header: 'Student Name' },
    { key: 'contactNumber', header: 'Contact Number' },
    { key: 'whatsappNumber', header: 'WhatsApp Number' },
    { key: 'email', header: 'Username' },
  ];

  const handleSubmit = () => {
    if (selectedParent) {
      updateMutation.mutate({ ...formData, id: selectedParent.id });
    } else {
      createMutation.mutate(formData);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      contactNumber: '',
      whatsappNumber: '',
      studentId: '',
      password: '',
    });
    setSelectedParent(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (parent: Parent) => {
    setSelectedParent(parent);
    setFormData({
      name: parent.name,
      email: parent.email,
      contactNumber: parent.contactNumber,
      whatsappNumber: parent.whatsappNumber,
      studentId: '', // Need to fetch current student ID
      password: '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (parent: Parent) => {
    if (window.confirm('Are you sure you want to delete this parent?')) {
      deleteMutation.mutate(parent.id);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Parents Management</h1>
        </div>

        <DataTable
          columns={columns}
          data={parents || []}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          addButtonText="Add Parent"
        />

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedParent ? 'Edit Parent' : 'Add New Parent'}
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <FormField
              label="Parent Name"
              value={formData.name}
              onChange={(value) => setFormData({ ...formData, name: value })}
              required
            />
            <FormField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(value) => setFormData({ ...formData, email: value })}
              required
            />
            <FormField
              label="Contact Number"
              type="tel"
              value={formData.contactNumber}
              onChange={(value) => setFormData({ ...formData, contactNumber: value })}
              required
            />
            <FormField
              label="WhatsApp Number"
              type="tel"
              value={formData.whatsappNumber}
              onChange={(value) => setFormData({ ...formData, whatsappNumber: value })}
              required
            />
            <FormField
              label="Student"
              type="select"
              value={formData.studentId}
              onChange={(value) => setFormData({ ...formData, studentId: value })}
              options={students?.map((student: any) => ({
                value: student.id,
                label: student.name,
              })) || []}
              required
            />
            {!selectedParent && (
              <FormField
                label="Password"
                type="password"
                value={formData.password}
                onChange={(value) => setFormData({ ...formData, password: value })}
                required
              />
            )}
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
};