export type UserRole =
  | 'SUPER_ADMIN'
  | 'SYS_ADMIN'
  | 'SECURITY_ADMIN'
  | 'ADMIN'
  | 'WELFARE_OFFICER'
  | 'COMMANDER'
  | 'HR_OFFICER'
  | 'DEPT_HEAD'
  | 'TRAINING_OFFICER'
  | 'MEDICAL_OFFICER'
  | 'PERSONNEL';

export interface User {
  id: number;
  uid?: string;
  force_id?: string;
  regimental_number?: string;
  email: string;
  full_name: string;
  role: UserRole;
  rank?: string;
  unit?: string;
  branch?: string;
  employee_id?: string;
  avatar_url?: string;
  is_active: boolean;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface DemoAccount {
  uid?: string;
  force_id?: string;
  regimental_number?: string;
  role: UserRole;
  role_label: string;
  email: string;
  password: string;
  full_name: string;
  rank: string;
  unit: string;
  branch?: string;
  description: string;
  dashboard_route: string;
}
