export type TUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  passWordChangedAt: Date | null;
  profilePhoto: string | null;
  address: string | null;
  contactNumber: string | null;
  status: "ACTIVE" | "BLOCKED" | "DELETED";
};
