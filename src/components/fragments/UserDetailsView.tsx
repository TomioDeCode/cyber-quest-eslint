"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, X, Check, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { signOut } from "next-auth/react";

type UserRole = "admin" | "user";

interface UserData {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

interface EditFormData {
  name: string;
  email: string;
  password: string;
  isValidPasword: string;
}

const UserProfileSkeleton = () => (
  <Card className="w-full h-full">
    <CardContent className="pt-6 flex items-center justify-center h-full">
      <div className="flex flex-col items-center justify-center space-y-4">
        <Skeleton className="w-24 h-24 rounded-full" />
        <Skeleton className="h-6 w-32" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const EditProfileForm = ({
  formData,
  isSubmitting,
  onSubmit,
  onCancel,
  onChange,
}: {
  formData: EditFormData;
  isSubmitting: boolean;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
  onChange: (field: keyof EditFormData, value: string) => void;
}) => (
  <div className="space-y-4 pt-4">
    <div className="space-y-2">
      <label className="text-sm font-medium">Name</label>
      <Input
        value={formData.name}
        onChange={(e) => onChange("name", e.target.value)}
        placeholder="Enter your name"
        disabled={isSubmitting}
      />
    </div>
    <div className="space-y-2">
      <label className="text-sm font-medium">Email</label>
      <Input
        value={formData.email}
        onChange={(e) => onChange("email", e.target.value)}
        placeholder="Enter your email"
        type="email"
        disabled={isSubmitting}
      />
    </div>
    <div className="space-y-2">
      <label className="text-sm font-medium">Password</label>
      <Input
        value={formData.password}
        onChange={(e) => onChange("password", e.target.value)}
        placeholder="Enter your password"
        type="password"
        disabled={isSubmitting}
      />
    </div>
    <div className="space-y-2">
      <label className="text-sm font-medium">Confirm Password</label>
      <Input
        value={formData.isValidPasword}
        onChange={(e) => onChange("isValidPasword", e.target.value)}
        placeholder="Enter your confirm password"
        type="password"
        disabled={isSubmitting}
      />
    </div>
    <div className="flex justify-end gap-2 pt-4">
      <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
        <X className="w-4 h-4 mr-2" />
        Cancel
      </Button>
      <Button onClick={onSubmit} disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Check className="w-4 h-4 mr-2" />
        )}
        Save Changes
      </Button>
    </div>
  </div>
);

const UserProfile = ({ userId }: { userId: string }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<EditFormData>({
    name: "",
    email: "",
    password: "",
    isValidPasword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        const result: APIResponse<UserData> = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.error || result.message || `Error: ${response.status}`
          );
        }

        setUser(result.data);
        setEditForm({
          name: result.data.name,
          email: result.data.email,
          password: "",
          isValidPasword: "",
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch user data"
        );
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const handleFormChange = (field: keyof EditFormData, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditSubmit = async () => {
    if (
      !editForm.name.trim() ||
      !editForm.email.trim() ||
      !editForm.password.trim() ||
      !editForm.isValidPasword.trim()
    ) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Name, password and email are required",
      });
      return;
    }

    if (editForm.password !== editForm.isValidPasword) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Password and confirmation do not match.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/users/${userId}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      const result: APIResponse<UserData> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to update user");
      }

      toast({
        title: "Success",
        description: result.message || "Profile updated successfully",
      });

      signOut();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to update profile",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <UserProfileSkeleton />;
  if (error)
    return (
      <Card className="w-full h-[450px] bg-red-50">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-red-600 text-center">{error}</p>
        </CardContent>
      </Card>
    );
  if (!user) return null;

  return (
    <Card className="w-full h-full flex flex-col justify-center">
      <CardContent className="flex flex-col items-center justify-center">
        <Avatar className="md:w-24 w-20 md:h-24 h-20 mt-5 border-4 border-white shadow-xl mb-4">
          <AvatarImage src="" alt={`${user.name}'s avatar`} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold">{user.name}</h2>
          <div className="flex items-center justify-center gap-2">
            <Mail className="w-4 h-4 text-primary" />
            <span className="text-sm">{user.email}</span>
          </div>
          <Badge variant="secondary" className="capitalize">
            {user.role}
          </Badge>
        </div>
        <div className="mt-4">
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="outline">Edit Profile</Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-4xl sm:max-w-2xl md:max-w-lg lg:max-w-3xl px-4 py-6">
              <DialogHeader>
                <DialogTitle className="text-xl sm:text-2xl">
                  Edit Profile
                </DialogTitle>
              </DialogHeader>
              <EditProfileForm
                formData={editForm}
                isSubmitting={isSubmitting}
                onSubmit={handleEditSubmit}
                onCancel={() => setIsEditing(false)}
                onChange={handleFormChange}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
