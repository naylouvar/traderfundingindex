"use client";

import { useActionState } from "react";
import { login } from "../actions";

export function LoginForm() {
  const [error, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="space-y-4">
      <label className="block space-y-1 text-sm">
        <span className="text-muted">Admin password</span>
        <input
          type="password"
          name="password"
          required
          autoFocus
          autoComplete="current-password"
          className="input"
        />
      </label>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button disabled={pending} className="btn-primary w-full">
        {pending ? "Checking…" : "Log in"}
      </button>
    </form>
  );
}
