"use client";

import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getErrorMessage, isApiError } from "@/lib/api/client";
import { updatePassword } from "@/lib/api/settings";

export default function SecuritySettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [saved, setSaved] = useState(false);

  const save = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      setCurrentPassword("");
      setPassword("");
      setPasswordConfirmation("");
      setSaved(true);
    },
  });

  const fieldErrors = isApiError(save.error) ? save.error.errors : undefined;

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaved(false);
    save.mutate({
      current_password: currentPassword,
      password,
      password_confirmation: passwordConfirmation,
    });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-medium">Update password</h2>
        <p className="text-sm text-muted-foreground">
          Ensure your account is using a long, random password to stay secure
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {save.isError ? (
          <Alert variant="destructive">
            <AlertTitle>Could not update password</AlertTitle>
            <AlertDescription>{getErrorMessage(save.error)}</AlertDescription>
          </Alert>
        ) : null}

        {saved ? (
          <Alert>
            <AlertTitle>Saved</AlertTitle>
            <AlertDescription>Your password has been updated.</AlertDescription>
          </Alert>
        ) : null}

        <div className="grid gap-2">
          <Label htmlFor="current_password">Current password</Label>
          <Input
            id="current_password"
            type="password"
            required
            value={currentPassword}
            onValueChange={setCurrentPassword}
            autoComplete="current-password"
            placeholder="Current password"
          />
          {fieldErrors?.current_password?.[0] ? (
            <p className="text-sm text-destructive">
              {fieldErrors.current_password[0]}
            </p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onValueChange={setPassword}
            autoComplete="new-password"
            placeholder="New password"
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
            autoComplete="new-password"
            placeholder="Confirm password"
          />
        </div>

        <Button type="submit" disabled={save.isPending}>
          {save.isPending ? "Saving…" : "Save password"}
        </Button>
      </form>
    </div>
  );
}
