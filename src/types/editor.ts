
export interface User {
  id: string;
  name: string;
  color: string;
  cursor?: number;
}

export interface Operation {
  type: 'insert' | 'delete' | 'retain';
  position: number;
  content?: string;
  length?: number;
  userId: string;
  timestamp: number;
}

export interface DocumentVersion {
  id: string;
  content: string;
  operations: Operation[];
  timestamp: number;
  version: number;
}

export interface EditorMessage {
  type: 'operation' | 'cursor' | 'user-join' | 'user-leave' | 'document-state';
  userId: string;
  operation?: Operation;
  cursor?: number;
  user?: User;
  document?: DocumentVersion;
}
