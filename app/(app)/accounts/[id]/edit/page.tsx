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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  fetchAccount,
  updateAccount,
  type Account,
  type AccountType,
} from "@/lib/api/accounts";
import { getErrorMessage, isApiError } from "@/lib/api/client";

export default function EditAccountPage() {
  return (
    <AdminGate>
      <AccountEditLoader />
    </AdminGate>
  );
}

function AccountEditLoader() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const detail = useQuery({
    queryKey: ["accounts", id],
    queryFn: () => fetchAccount(id),
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
          <AlertTitle>Could not load account</AlertTitle>
          <AlertDescription>{getErrorMessage(detail.error)}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <AccountEditForm
      key={detail.data.account.id}
      account={detail.data.account}
      types={detail.data.types}
    />
  );
}

function AccountEditForm({
  account,
  types,
}: {
  account: Account;
  types: AccountType[];
}) {
  const router = useRouter();
  const [name, setName] = useState(account.name);
  const [type, setType] = useState<AccountType>(account.type);
  const [ownerName, setOwnerName] = useState(account.owner_name);
  const [openingBalance, setOpeningBalance] = useState(
    String(account.opening_balance),
  );
  const [balanceStartedAt, setBalanceStartedAt] = useState(
    account.balance_started_at ?? new Date().toISOString().slice(0, 10),
  );
  const [sortOrder, setSortOrder] = useState(String(account.sort_order ?? 0));
  const [isActive, setIsActive] = useState(account.is_active);

  const save = useMutation({
    mutationFn: () =>
      updateAccount(account.id, {
        name,
        type,
        owner_name: ownerName,
        opening_balance: Number(openingBalance) || 0,
        balance_started_at: balanceStartedAt,
        sort_order: Number(sortOrder) || 0,
        is_active: isActive,
      }),
    onSuccess: () => router.push("/accounts"),
  });

  const fieldErrors = isApiError(save.error) ? save.error.errors : undefined;

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    save.mutate();
  }

  return (
    <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Edit Account"
        description={account.name}
        backHref="/accounts"
      />

      <form
        onSubmit={onSubmit}
        className="dashboard-panel mx-auto w-full max-w-lg space-y-4"
      >
        {save.isError ? (
          <Alert variant="destructive">
            <AlertTitle>Could not update account</AlertTitle>
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
          <Label>Type</Label>
          <Select
            value={type}
            onValueChange={(value) => setType(value as AccountType)}
          >
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
          <Button type="submit" disabled={save.isPending}>
            {save.isPending ? "Saving…" : "Save changes"}
          </Button>
          <Button variant="outline" render={<Link href="/accounts" />}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
