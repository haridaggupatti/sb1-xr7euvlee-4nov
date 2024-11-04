import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataTable } from '../../components/admin/DataTable';
import { Modal } from '../../components/admin/Modal';
import { FormField } from '../../components/admin/FormField';
import { AdminLayout } from '../../components/admin/AdminLayout';

interface Teacher {
  id: number;
  name: string;
  email: string;
  contactNumber: string;
  technology: string;
  studentCount: number;
}

export const TeachersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [showStudents, setShowStudents] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    technology: '',
    password: '',
  });

  const { data: teachers, isLoading } = useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      const response = await fetch('/api/admin/teachers', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch teachers');
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

  const { data: teacherStudents } = useQuery({
    queryKey: ['teacherStudents', showStudents],
    enabled: showStudents !== null,
    queryFn: async () => {
      const response = await fetch(`/api/admin/teachers/${showStudents}/students`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch teacher\'s students');
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch('/api/admin/teachers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ ...data, role: 'instructor' }),
      });
      if (!response.ok) throw new Error('Failed to create teacher');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      setIsModalOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData & { id: number }) => {
      const response = await fetch(`/api/admin/teachers/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update teacher');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      setIsModalOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/teachers/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete teacher');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
  });

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'contactNumber', header: 'Contact Number' },
    { key: 'technology', header: 'Technology' },
    {
      key: 'studentCount',
      header: 'Students',
      render: (value: number, row: Teacher) => (
        <button
          onClick={() => setShowStudents(row.id)}
          className="text-blue-600 hover:text-blue-800"
        >
          {value} Students
        </button>
      ),
    },
  ];

  const handleSubmit = () => {
    if (selectedTeacher) {
      updateMutation.mutate({ ...formData, id: selectedTeacher.id });
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
    setSelectedTeacher(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      contactNumber: teacher.contactNumber,
      technology: teacher.technology,
      password: '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (teacher: Teacher) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      deleteMutation.mutate(teacher.id);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Teachers Management</h1>
        </div>

        <DataTable
          columns={columns}
          data={teachers || []}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          addButtonText="Add Teacher"
        />

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedTeacher ? 'Edit Teacher' : 'Add New Teacher'}
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
            {!selectedTeacher && (
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

        <Modal
          isOpen={showStudents !== null}
          onClose={() => setShowStudents(null)}
          title="Assigned Students"
        >
          <div className="space-y-4">
            {teacherStudents?.map((student: any) => (
              <div
                key={student.id}
                className="p-4 border rounded-lg flex justify-between items-center"
              >
                <div>
                  <h3 className="font-medium">{student.name}</h3>
                  <p className="text-sm text-gray-500">{student.email}</p>
                </div>
                <span className="text-sm text-gray-500">{student.technology}</span>
              </div>
            ))}
            {teacherStudents?.length === 0 && (
              <p className="text-center text-gray-500">No students assigned</p>
            )}
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
};