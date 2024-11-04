import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataTable } from '../../components/admin/DataTable';
import { Modal } from '../../components/admin/Modal';
import { FormField } from '../../components/admin/FormField';
import { AdminLayout } from '../../components/admin/AdminLayout';

interface Mapping {
  id: number;
  studentName: string;
  teacherName: string;
  technology: string;
  assignedDate: string;
}

export const MappingPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    technology: '',
    teacherId: '',
  });

  const { data: mappings, isLoading } = useQuery({
    queryKey: ['mappings'],
    queryFn: async () => {
      const response = await fetch('/api/admin/mappings', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch mappings');
      return response.json();
    },
  });

  const { data: students } = useQuery({
    queryKey: ['unmappedStudents'],
    queryFn: async () => {
      const response = await fetch('/api/admin/students/unmapped', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch unmapped students');
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

  const { data: teachers } = useQuery({
    queryKey: ['teachersByTechnology', formData.technology],
    enabled: !!formData.technology,
    queryFn: async () => {
      const response = await fetch(`/api/admin/teachers/by-technology/${formData.technology}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch teachers');
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch('/api/admin/mappings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create mapping');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mappings'] });
      queryClient.invalidateQueries({ queryKey: ['unmappedStudents'] });
      setIsModalOpen(false);
      resetForm();
    },
  });

  const columns = [
    { key: 'studentName', header: 'Student Name' },
    { key: 'teacherName', header: 'Teacher Name' },
    { key: 'technology', header: 'Technology' },
    { 
      key: 'assignedDate', 
      header: 'Assigned Date',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
  ];

  const handleSubmit = () => {
    createMutation.mutate(formData);
  };

  const resetForm = () => {
    setFormData({
      studentId: '',
      technology: '',
      teacherId: '',
    });
  };

  const handleAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Student-Teacher Mapping</h1>
        </div>

        <DataTable
          columns={columns}
          data={mappings || []}
          onAdd={handleAdd}
          addButtonText="Assign Student"
        />

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Assign Student to Teacher"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
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
            <FormField
              label="Technology"
              type="select"
              value={formData.technology}
              onChange={(value) => setFormData({ ...formData, technology: value, teacherId: '' })}
              options={technologies?.map((tech: string) => ({
                value: tech,
                label: tech,
              })) || []}
              required
            />
            {formData.technology && (
              <FormField
                label="Teacher"
                type="select"
                value={formData.teacherId}
                onChange={(value) => setFormData({ ...formData, teacherId: value })}
                options={teachers?.map((teacher: any) => ({
                  value: teacher.id,
                  label: teacher.name,
                })) || []}
                required
              />
            )}
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
};