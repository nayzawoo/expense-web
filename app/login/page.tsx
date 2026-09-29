"use client";

import Link from "next/link";
import { useState, type SubmitEvent } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getErrorMessage, isApiError } from "@/lib/api/client";
import { useLogin } from "@/hooks/use-auth";

export default function LoginPage() {
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    login.mutate({ email, password });
  }

  const fieldErrors = isApiError(login.error) ? login.error.errors : undefined;
  const formError = login.error ? getErrorMessage(login.error) : null;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-center gap-4">
            <Link
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="mb-1 flex size-9 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
                E
              </div>
              <span className="sr-only">Expense</span>
            </Link>

            <div className="space-y-2 text-center">
              <h1 className="text-xl font-medium">Log in to your account</h1>
              <p className="text-center text-sm text-muted-foreground">
                Enter your email and password below to log in
              </p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-6">
            <div className="grid gap-6">
              {formError ? (
                <Alert variant="destructive">
                  <AlertTitle>Login failed</AlertTitle>
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              ) : null}

              <div className="grid gap-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  required
                  placeholder="email@example.com"
                  value={email}
                  onValueChange={setEmail}
                  aria-invalid={Boolean(fieldErrors?.email)}
                />
                {fieldErrors?.email?.[0] ? (
                  <p className="text-sm text-destructive">
                    {fieldErrors.email[0]}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="Password"
                  value={password}
                  onValueChange={setPassword}
                  aria-invalid={Boolean(fieldErrors?.password)}
                />
                {fieldErrors?.password?.[0] ? (
                  <p className="text-sm text-destructive">
                    {fieldErrors.password[0]}
                  </p>
                ) : null}
              </div>

              <Button
                type="submit"
                className="mt-2 w-full"
                disabled={login.isPending}
                size="lg"
              >
                {login.isPending ? "Logging in…" : "Log in"}
              </Button>
            </div>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            <Link href="/" className="underline-offset-4 hover:underline">
              Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
