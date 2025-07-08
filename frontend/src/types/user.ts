//frontend/types/user.ts
export type UserProfile = {
  id: number;
  email: string;
  name: string;
  phone: string;
  profile_image: string | null;
  created_at: string;
  updated_at: string;
  is_verified: number;
}

export type UpdateProfileData = {
  name?: string;
  email?: string;
  phone?: string;
}

export type ChangePasswordData = {
  currentPassword: string;
  newPassword: string;
}