import type { ColumnDef } from "@tanstack/react-table";

export type PendingGuest = {
  id: number;
  email: string;
  invitedAt: string;
  expiresAt: string;
};

export const columns: ColumnDef<PendingGuest>[] = [
  {
    accessorKey: "email",
    header: "이메일",
  },
  {
    accessorKey: "invitedAt",
    header: "초대일",
  },
  {
    accessorKey: "expiresAt",
    header: "만료일",
  },
  {
    id: "status",
    header: "상태",
    cell: ({ row }) => {
      const expires = new Date(row.original.expiresAt);
      const now = new Date();
      const isValid = expires > now;

      return (
        <span className ={isValid ? "text-green-600" : "text-red-600"}>
          {isValid ? "유효" : "만료"}
        </span>
      );
    },
  },
];