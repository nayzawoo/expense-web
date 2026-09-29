"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AdminGate } from "@/components/admin-gate";
import { PageHeader } from "@/components/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchUser, updateUser, type ManagedUser } from "@/lib/api/users";
import { getErrorMessage, isApiError } from "@/lib/api/client";

type EditableUser = Omit<
  ManagedUser,
  "can_delete" | "created_at" | "email_verified_at"
>;

export default function EditUserPage() {
  return (
    <AdminGate>
      <EditUserLoader />
    </AdminGate>
  );
}

function EditUserLoader() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const detail = useQuery({
    queryKey: ["users", id],
    queryFn: () => fetchUser(id),
    enabled: Number.isFinite(id),
  });

  if (detail.isLoading) {
    return (
      <div className="p-4 md:p-6">
        <Skeleton className="h-40 w-full max-w-lg" />
      </div>
    );
  }

  if (detail.isError || !detail.data) {
    return (
      <div className="p-4 md:p-6">
        <Alert variant="destructive">
          <AlertTitle>Could not load user</AlertTitle>
          <AlertDescription>{getErrorMessage(detail.error)}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <EditUserForm
      key={detail.data.user.id}
      user={detail.data.user}
      isLastAdmin={detail.data.is_last_admin}
    />
  );
}

function EditUserForm({
  user,
  isLastAdmin,
}: {
  user: EditableUser;
  isLastAdmin: boolean;
}) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isAdmin, setIsAdmin] = useState(user.is_admin);

  const save = useMutation({
    mutationFn: () =>
      updateUser(user.id, {
        name,
        email,
        password: password || undefined,
        password_confirmation: password ? passwordConfirmation : undefined,
        is_admin: isAdmin,
      }),
    onSuccess: () => router.push("/users"),
  });

  const fieldErrors = isApiError(save.error) ? save.error.errors : undefined;

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    save.mutate();
  }

  return (
    <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Edit User"
        description={user.email}
        backHref="/users"
      />

      <form
        onSubmit={onSubmit}
        className="dashboard-panel mx-auto w-full max-w-lg space-y-4"
      >
        {save.isError ? (
          <Alert variant="destructive">
            <AlertTitle>Could not update user</AlertTitle>
            <AlertDescription>{getErrorMessage(save.error)}</AlertDescription>
          </Alert>
        ) : null}

        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" required value={name} onValueChange={setName} />
          {fieldErrors?.name?.[0] ? (
            <p className="text-sm text-destructive">{fieldErrors.name[0]}</p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onValueChange={setEmail}
          />
          {fieldErrors?.email?.[0] ? (
            <p className="text-sm text-destructive">{fieldErrors.email[0]}</p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">New password (optional)</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onValueChange={setPassword}
          />
          {fieldErrors?.password?.[0] ? (
            <p className="text-sm text-destructive">{fieldErrors.password[0]}</p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password_confirmation">Confirm new password</Label>
          <Input
            id="password_confirmation"
            type="password"
            value={passwordConfirmation}
            onValueChange={setPasswordConfirmation}
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={isAdmin}
            disabled={isLastAdmin}
            onCheckedChange={(checked) => setIsAdmin(checked === true)}
          />
          Admin
          {isLastAdmin ? (
            <span className="text-xs text-muted-foreground">
              (last admin cannot be demoted)
            </span>
          ) : null}
        </label>

        <div className="flex gap-2 pt-2">
          <Button type="submit" disabled={save.isPending}>
            {save.isPending ? "Saving…" : "Save changes"}
          </Button>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/users" />}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
