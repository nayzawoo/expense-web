"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api/client";
import { useLogin } from "@/hooks/use-auth";

export default function LoginPage() {
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    login.mutate({ email, password });
  }

  const fieldErrors =
    login.error instanceof ApiError ? login.error.errors : undefined;
  const formError =
    login.error instanceof ApiError
      ? login.error.message
      : login.error
        ? "Unable to sign in. Try again."
        : null;

  return (
    <div className="flex flex-1 items-center justify-center bg-muted/40 px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Use your Expense account to open the dashboard.
          </CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="space-y-4">
            {formError ? (
              <Alert variant="destructive">
                <AlertTitle>Login failed</AlertTitle>
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              {fieldErrors?.email?.[0] ? (
                <p className="text-sm text-destructive">{fieldErrors.email[0]}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              {fieldErrors?.password?.[0] ? (
                <p className="text-sm text-destructive">
                  {fieldErrors.password[0]}
                </p>
              ) : null}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button type="submit" disabled={login.isPending} className="w-full sm:w-auto">
              {login.isPending ? "Signing in…" : "Sign in"}
            </Button>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Back to home
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
