import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataTable } from '../../components/admin/DataTable';
import { Modal } from '../../components/admin/Modal';
import { FormField } from '../../components/admin/FormField';
import { AdminLayout } from '../../components/admin/AdminLayout';

interface Student {
  id: number;
  name: string;
  email: string;
  contactNumber: string;
  technology: string;
  assignedTo: string;
}

export const StudentsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    technology: '',
    password: '',
  });

  const { data: students, isLoading } = useQuery({
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

  const { data: technologies } = useQuery({
    queryKey: ['technologies'],
    queryFn: async () => {
      const response = await fetch('/api/admin/technologies', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch technologies');
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch('/api/admin/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ ...data, role: 'student' }),
      });
      if (!response.ok) throw new Error('Failed to create student');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setIsModalOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData & { id: number }) => {
      const response = await fetch(`/api/admin/students/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update student');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setIsModalOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/students/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete student');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'contactNumber', header: 'Contact Number' },
    { key: 'technology', header: 'Technology' },
    { 
      key: 'assignedTo', 
      header: 'Assigned To',
      render: (value: string) => value || 'Not Assigned'
    },
  ];

  const handleSubmit = () => {
    if (selectedStudent) {
      updateMutation.mutate({ ...formData, id: selectedStudent.id });
    } else {
      createMutation.mutate(formData);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      contactNumber: '',
      technology: '',
      password: '',
    });
    setSelectedStudent(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      contactNumber: student.contactNumber,
      technology: student.technology,
      password: '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (student: Student) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      deleteMutation.mutate(student.id);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Students Management</h1>
        </div>

        <DataTable
          columns={columns}
          data={students || []}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          addButtonText="Add Student"
        />

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedStudent ? 'Edit Student' : 'Add New Student'}
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <FormField
              label="Name"
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
              label="Technology"
              type="select"
              value={formData.technology}
              onChange={(value) => setFormData({ ...formData, technology: value })}
              options={technologies?.map((tech: string) => ({
                value: tech,
                label: tech,
              })) || []}
              required
            />
            {!selectedStudent && (
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