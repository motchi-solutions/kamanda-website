import { CompletionChecklist } from "./completion-checklist";
import type { ContactFormState } from "./use-contact-form";

export function ContactActions({ form }: { form: ContactFormState }) {
  const {
    turnstileContainer,
    validationNotice,
    requirements,
    busy,
    hydrated,
    notice,
  } = form;
  return (
    <div>
      {/* Cloudflare Turnstile: shows a checkbox here only if needed. */}
      <div ref={turnstileContainer} className="mb-4 empty:mb-0" />
      {validationNotice && (
        <p role="alert" className="mb-3 text-sm text-red-700">
          {validationNotice}
        </p>
      )}
      <div className="contact-actions border-t border-carbon/10 pt-5">
        <div className="contact-actions-layout contact-actions-with-sidebar">
          <div className="min-w-0 lg:hidden">
            <CompletionChecklist form={form} />
          </div>
          <p id="contact-requirements" className="sr-only">
            {requirements.length
              ? `Complete: ${requirements.join(", ")}.`
              : busy
                  ? "Sending your enquiry."
                  : "Your enquiry is ready to send."}
          </p>
          <button
            type="submit"
            disabled={
              !hydrated ||
              requirements.length > 0 ||
              busy
            }
            aria-describedby="contact-requirements"
            className="btn btn-primary contact-submit w-full whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-50"
            data-button
          >
            {busy ? "Sending…" : "Send Enquiry"}
          </button>
        </div>
      </div>
      <div
        className="mt-3 min-h-7 text-sm leading-6 text-navy sm:text-right"
        role="status"
        aria-live={busy ? "polite" : "off"}
      >
        {busy ? (
          <span className="inline-flex items-center gap-2">
            <span className="contact-spinner" aria-hidden="true" />
            Sending your enquiry…
          </span>
        ) : null}
      </div>
      {notice && (
        <div className="mt-3 text-sm leading-6 text-navy" role="status">
          <p>{notice.message}</p>
          {notice.reference && (
            <p className="mt-1 wrap-break-word text-xs text-carbon/65">
              {notice.reference.length <= 3 ? "Error code" : "Reference"}:{" "}
              {notice.reference}
            </p>
          )}
        </div>
      )}
      <p className="text-xs leading-5 text-carbon/65">
        This form uses Cloudflare Turnstile to block spam. See the{" "}
        <a href="https://www.cloudflare.com/turnstile-privacy-policy/" className="text-navy">
          Turnstile privacy policy
        </a>
        .
      </p>
      <noscript>
        <p className="mt-3 text-sm">
          Please enable JavaScript to verify and send your enquiry, or email
          info@kamandagroup.com.
        </p>
      </noscript>
    </div>
  );
}
