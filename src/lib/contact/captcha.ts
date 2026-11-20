import "server-only";
import { siteUrl } from "@/lib/site";
import { verifyTurnstile } from "@/lib/turnstile";
import { ContactError } from "./errors";
import type { Submission } from "./validation";

/** Hostnames allowed to submit the form (origin check) and to solve Turnstile.
    CONTACT_ALLOWED_HOSTNAMES is a comma-separated list. Defaults to this
    deployment's own host (production, preview branch URL or localhost). */
export function allowedHostnames(): string[] {
  const configured = (process.env.CONTACT_ALLOWED_HOSTNAMES ?? "")
    .split(",").map((host) => host.trim().toLowerCase()).filter(Boolean);
  return [...new Set(configured.length ? configured : [new URL(siteUrl()).hostname])];
}

/** Cloudflare Turnstile check. `hostname` is the already-allowed origin host. */
export async function verifyCaptcha(data: Submission, hostname: string): Promise<void> {
  const result = await verifyTurnstile({ token: data.turnstileToken, hostname });
  if (result.ok) return;
  if (result.reason === "unavailable") {
    throw new ContactError("CONTACT_CAPTCHA_SERVICE_UNAVAILABLE", undefined, { service: "cloudflare", reason: "provider" });
  }
  throw new ContactError("CONTACT_CAPTCHA_FAILED");
}
