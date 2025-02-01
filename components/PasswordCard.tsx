import { useState } from 'react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { toast } from 'react-toastify';

interface PasswordCardProps {
  onUpdate: (passwordData: { currentPassword: string; newPassword: string }) => void;
}

export default function PasswordCard({ onUpdate }: PasswordCardProps) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    if (!formData.currentPassword.trim()) {
      toast.error('Current password is required');

      return;
    }
    if (!formData.newPassword.trim()) {
      toast.error('New password is required');

      return;
    }
    if (formData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');

      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');

      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');

      return;
    }
    onUpdate({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    });
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <form className="space-y-6 max-w-4xl w-full mx-auto">
      <Input
        fullWidth
        label="Current Password"
        name="currentPassword"
        type="password"
        value={formData.currentPassword}
        onChange={handleInputChange}
      />
      <Input
        fullWidth
        label="New Password"
        name="newPassword"
        type="password"
        value={formData.newPassword}
        onChange={handleInputChange}
      />
      <Input
        fullWidth
        label="Confirm New Password"
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleInputChange}
      />
      <Button fullWidth color="primary" onPress={handleSave}>
        Update Password
      </Button>
    </form>
  );
}
