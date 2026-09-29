"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminGate } from "@/components/admin-gate";
import { PageHeader } from "@/components/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createUser } from "@/lib/api/users";
import { getErrorMessage, isApiError } from "@/lib/api/client";
import { invalidateQueryKeys, queryKeys } from "@/lib/query-keys";

export default function NewUserPage() {
  return (
    <AdminGate>
      <NewUserForm />
    </AdminGate>
  );
}

function NewUserForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const create = useMutation({
    mutationFn: createUser,
    onSuccess: async () => {
      await invalidateQueryKeys(queryClient, [queryKeys.users.all]);
      router.push("/users");
    },
  });

  const fieldErrors = isApiError(create.error) ? create.error.errors : undefined;

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    create.mutate({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
      is_admin: isAdmin,
    });
  }

  return (
    <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Add User"
        description="Create a household login account"
        backHref="/users"
      />

      <form onSubmit={onSubmit} className="dashboard-panel mx-auto w-full max-w-lg space-y-4">
        {create.isError ? (
          <Alert variant="destructive">
            <AlertTitle>Could not create user</AlertTitle>
            <AlertDescription>{getErrorMessage(create.error)}</AlertDescription>
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
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onValueChange={setPassword}
          />
          {fieldErrors?.password?.[0] ? (
            <p className="text-sm text-destructive">{fieldErrors.password[0]}</p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password_confirmation">Confirm password</Label>
          <Input
            id="password_confirmation"
            type="password"
            required
            value={passwordConfirmation}
            onValueChange={setPasswordConfirmation}
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={isAdmin}
            onCheckedChange={(checked) => setIsAdmin(checked === true)}
          />
          Admin
        </label>

        <div className="flex gap-2 pt-2">
          <Button type="submit" disabled={create.isPending}>
            {create.isPending ? "Saving…" : "Create user"}
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
