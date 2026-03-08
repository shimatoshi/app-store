export interface AppData {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  link: string;
  install_steps?: string[];
  installSteps?: string[]; // For backward compatibility
  user_id?: string;
  developer_name?: string;
  created_at?: string;
}

export interface User {
  id: string;
  email?: string;
}
