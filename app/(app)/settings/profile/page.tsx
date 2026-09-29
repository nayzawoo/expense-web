"use client";

import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useMe } from "@/hooks/use-auth";
import { getErrorMessage, isApiError, type ApiUser } from "@/lib/api/client";
import { updateProfile } from "@/lib/api/settings";
import { queryKeys } from "@/lib/query-keys";

export default function ProfileSettingsPage() {
  const me = useMe();
  const user = me.data?.user;

  if (me.isPending && !user) {
    return <Skeleton className="h-40 w-full" />;
  }

  if (!user) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Could not load profile</AlertTitle>
        <AlertDescription>{getErrorMessage(me.error)}</AlertDescription>
      </Alert>
    );
  }

  return <ProfileForm key={user.id} user={user} />;
}

function ProfileForm({ user }: { user: ApiUser }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [saved, setSaved] = useState(false);

  const save = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.auth.me, { user: data.user });
      setSaved(true);
    },
  });

  const fieldErrors = isApiError(save.error) ? save.error.errors : undefined;

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaved(false);
    save.mutate({ name, email });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-medium">Profile information</h2>
        <p className="text-sm text-muted-foreground">
          Update your name and email address
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {save.isError ? (
          <Alert variant="destructive">
            <AlertTitle>Could not update profile</AlertTitle>
            <AlertDescription>{getErrorMessage(save.error)}</AlertDescription>
          </Alert>
        ) : null}

        {saved ? (
          <Alert>
            <AlertTitle>Saved</AlertTitle>
            <AlertDescription>Your profile has been updated.</AlertDescription>
          </Alert>
        ) : null}

        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            required
            value={name}
            onValueChange={setName}
            autoComplete="name"
            placeholder="Full name"
          />
          {fieldErrors?.name?.[0] ? (
            <p className="text-sm text-destructive">{fieldErrors.name[0]}</p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onValueChange={setEmail}
            autoComplete="username"
            placeholder="Email address"
          />
          {fieldErrors?.email?.[0] ? (
            <p className="text-sm text-destructive">{fieldErrors.email[0]}</p>
          ) : null}
        </div>

        <Button type="submit" disabled={save.isPending}>
          {save.isPending ? "Saving…" : "Save"}
        </Button>
      </form>
    </div>
  );
}
