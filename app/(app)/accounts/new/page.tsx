"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { AdminGate } from "@/components/admin-gate";
import { PageHeader } from "@/components/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAccount, type AccountType } from "@/lib/api/accounts";
import { getErrorMessage, isApiError } from "@/lib/api/client";

const types: AccountType[] = ["bank", "wallet", "cash"];

export default function NewAccountPage() {
  return (
    <AdminGate>
      <AccountCreateForm />
    </AdminGate>
  );
}

function AccountCreateForm() {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const [name, setName] = useState("");
  const [type, setType] = useState<AccountType>("bank");
  const [ownerName, setOwnerName] = useState("");
  const [openingBalance, setOpeningBalance] = useState("0");
  const [balanceStartedAt, setBalanceStartedAt] = useState(today);
  const [sortOrder, setSortOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);

  const create = useMutation({
    mutationFn: createAccount,
    onSuccess: () => router.push("/accounts"),
  });

  const fieldErrors = isApiError(create.error) ? create.error.errors : undefined;

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    create.mutate({
      name,
      type,
      owner_name: ownerName,
      opening_balance: Number(openingBalance) || 0,
      balance_started_at: balanceStartedAt,
      sort_order: Number(sortOrder) || 0,
      is_active: isActive,
    });
  }

  return (
    <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Add Account"
        description="Create a household account"
        backHref="/accounts"
      />

      <form onSubmit={onSubmit} className="dashboard-panel mx-auto w-full max-w-lg space-y-4">
        {create.isError ? (
          <Alert variant="destructive">
            <AlertTitle>Could not create account</AlertTitle>
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
          <Label>Type</Label>
          <Select value={type} onValueChange={(value) => setType(value as AccountType)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {types.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="owner_name">Owner</Label>
          <Input
            id="owner_name"
            required
            value={ownerName}
            onValueChange={setOwnerName}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="opening_balance">Opening balance</Label>
          <Input
            id="opening_balance"
            type="number"
            min={0}
            step="0.01"
            required
            value={openingBalance}
            onValueChange={setOpeningBalance}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="balance_started_at">Balance started at</Label>
          <Input
            id="balance_started_at"
            type="date"
            required
            value={balanceStartedAt}
            onValueChange={setBalanceStartedAt}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="sort_order">Sort order</Label>
          <Input
            id="sort_order"
            type="number"
            min={0}
            value={sortOrder}
            onValueChange={setSortOrder}
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={isActive}
            onCheckedChange={(checked) => setIsActive(checked === true)}
          />
          Active
        </label>

        <div className="flex gap-2 pt-2">
          <Button type="submit" disabled={create.isPending}>
            {create.isPending ? "Saving…" : "Create account"}
          </Button>
          <Button variant="outline" render={<Link href="/accounts" />}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
