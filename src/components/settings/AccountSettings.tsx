import React, { useState } from 'react';
import { Button } from '../Button';
import { Input } from '../Input';

export const AccountSettings: React.FC = () => {
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement update personal info
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement update security settings
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <form onSubmit={handlePersonalInfoSubmit} className="space-y-4">
          <Input
            label="Full Name"
            value={personalInfo.name}
            onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            value={personalInfo.email}
            onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
          />
          <Input
            label="Phone Number"
            type="tel"
            value={personalInfo.phone}
            onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
          />
          <Button type="submit">Update Profile</Button>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
        <form onSubmit={handleSecuritySubmit} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            value={security.currentPassword}
            onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
          />
          <Input
            label="New Password"
            type="password"
            value={security.newPassword}
            onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={security.confirmPassword}
            onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
          />
          <Button type="submit">Update Password</Button>
        </form>
      </div>
    </div>
  );
};