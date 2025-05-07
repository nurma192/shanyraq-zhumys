export interface ProfileData {
  username: string;
  jobTitle: string;
  company: string;
  location: string;
  email: string;
  phone: string;
  withUsSince: string;
  role: string;
  reviewsCount: number;
  salaryCount: number;
}

export interface UpdateProfileRequest {
  username: string;
  jobTitle: string;
  company: string;
  location: string;
  email: string;
  phone: string;
}

export interface UpdatePasswordRequest {
  oldPassword: string;
  newPassword: string;
}
