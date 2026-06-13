"use client";

import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/forms/FormField";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm space-y-6 rounded-lg border border-foreground/20 bg-background p-8 shadow-sm">
      <h1 className="text-center text-2xl font-semibold">Login</h1>
      <form
        className="space-y-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <FormField label="Email" htmlFor="email">
          <Input id="email" type="email" placeholder="you@example.com" required />
        </FormField>
        <FormField label="Password" htmlFor="password">
          <Input id="password" type="password" placeholder="••••••••" required />
        </FormField>
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </div>
  );
}
