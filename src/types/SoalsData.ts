export interface Soal {
  id: string;
  soal: string;
  url: string | null;
  flag: string;
  category: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

export interface UpdateMessage {
  type: "success" | "error" | "";
  message: string;
}
