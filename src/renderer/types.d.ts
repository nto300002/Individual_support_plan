// src/renderer/types.d.ts
interface ElectronAPI {
  ipcRenderer: {
    sendMessage(channel: string, args: unknown[]): void;
    once(channel: string, func: (...args: unknown[]) => void): void;
  };
}

interface Window {
  electron: ElectronAPI;
}

//user type
export type User = {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  is_active: boolean;
  user_icon: string;
  created_at: Date;
  updated_at: Date;
};

type UserInput = Omit<User, 'id' | 'created_at' | 'updated_at'>;
