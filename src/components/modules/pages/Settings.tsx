"use client";

import { userSelector } from "@/redux/features/authSlice";
import { useAppSelector } from "@/redux/hook";
import { Card } from "@/components/ui/card";
import { UserCog, Lock } from "lucide-react";
import ProfileForm from "@/components/forms/ProfileForm";
import PasswordForm from "@/components/forms/PasswordForm";

const Settings = () => {
  const user = useAppSelector(userSelector);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Account Settings</h1>

      <div className="space-y-20 max-w-3xl mx-auto">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <UserCog className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Profile Information</h2>
          </div>

          {user && <ProfileForm userData={user} />}
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Change Password</h2>
          </div>

          <PasswordForm />
        </Card>
      </div>
    </div>
  );
};

export default Settings;
