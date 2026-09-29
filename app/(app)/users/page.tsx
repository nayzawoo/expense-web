"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit2, Plus, Trash2, Users } from "lucide-react";
import { AdminGate } from "@/components/admin-gate";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteUser, fetchUsers } from "@/lib/api/users";
import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/lib/api/client";
import { invalidateQueryKeys, queryKeys } from "@/lib/query-keys";

export default function UsersPage() {
  return (
    <AdminGate>
      <UsersContent />
    </AdminGate>
  );
}

function UsersContent() {
  const queryClient = useQueryClient();
  const users = useQuery({
    queryKey: queryKeys.users.all,
    queryFn: fetchUsers,
  });
  const remove = useMutation({
    mutationFn: deleteUser,
    onSuccess: async () => {
      await invalidateQueryKeys(queryClient, [queryKeys.users.all]);
    },
  });

  return (
    <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Users"
        description="Manage household login accounts"
        action={
          <Link
            href="/users/new"
            className={cn(buttonVariants(), "gap-2")}
          >
            <Plus className="size-4" />
            Add User
          </Link>
        }
      />

      <div className="dashboard-panel overflow-hidden p-0">
        {users.isLoading ? (
          <div className="space-y-3 p-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : users.isError ? (
          <p className="p-4 text-sm text-destructive">
            {getErrorMessage(users.error)}
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(users.data ?? []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    <Users className="mx-auto mb-2 size-8 opacity-40" />
                    No users yet.
                  </TableCell>
                </TableRow>
              ) : (
                (users.data ?? []).map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.is_admin ? "default" : "secondary"}>
                        {user.is_admin ? "Admin" : "Member"}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.created_at ?? "—"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/users/${user.id}/edit`}
                          className={cn(
                            buttonVariants({ variant: "ghost", size: "icon-sm" }),
                          )}
                        >
                          <Edit2 className="size-4" />
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          disabled={!user.can_delete || remove.isPending}
                          onClick={() => {
                            if (
                              confirm(
                                `Delete user "${user.name}"? This cannot be undone.`,
                              )
                            ) {
                              remove.mutate(user.id);
                            }
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
