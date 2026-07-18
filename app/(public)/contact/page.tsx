"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import {
  Card,
  CardContent,
  InputGroup,
  InputGroupInput,
  InputGroupPrefix,
  InputGroupTextArea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectPopover,
  ListBox,
  ListBoxItem,
  Button,
} from "@heroui/react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface FormFields {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

type FormStatus = "idle" | "submitting" | "success";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const SUBJECT_OPTIONS = [
  { id: "general", label: "General Inquiry" },
  { id: "support", label: "Support" },
  { id: "feedback", label: "Feedback" },
  { id: "partnership", label: "Partnership" },
];

const INFO_CARDS: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}[] = [
  {
    icon: <Mail size={18} className="text-indigo-600 dark:text-indigo-400" />,
    label: "Email",
    value: "support@smartwallet.ai",
    href: "mailto:support@smartwallet.ai",
  },
  {
    icon: (
      <Phone size={18} className="text-indigo-600 dark:text-indigo-400" />
    ),
    label: "Phone",
    value: "+880 171-234-5678",
    href: "tel:+8801712345678",
  },
  {
    icon: (
      <MapPin size={18} className="text-indigo-600 dark:text-indigo-400" />
    ),
    label: "Location",
    value: "Dhaka, Bangladesh",
  },
  {
    icon: (
      <Clock size={18} className="text-indigo-600 dark:text-indigo-400" />
    ),
    label: "Office Hours",
    value: "Sat\u2013Thu, 9:00 AM \u2013 6:00 PM",
  },
];

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: "https://x.com",
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 0 1 1.772 1.153 4.902 4.902 0 0 1 1.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 0 1-1.153 1.772 4.902 4.902 0 0 1-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 0 1-1.772-1.153 4.902 4.902 0 0 1-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 0 1 1.153-1.772A4.902 4.902 0 0 1 5.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 0 0-.748-1.15 3.098 3.098 0 0 0-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 1 1 0 10.27 5.135 5.135 0 0 1 0-10.27zm0 1.802a3.333 3.333 0 1 0 0 6.666 3.333 3.333 0 0 0 0-6.666zm5.338-3.205a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z" clipRule="evenodd" />
      </svg>
    ),
  },
];

/* ------------------------------------------------------------------ */
/*  Validation                                                         */
/* ------------------------------------------------------------------ */

function validate(fields: FormFields): FormErrors {
  const errors: FormErrors = {};

  if (!fields.name.trim()) {
    errors.name = "Name is required";
  }

  if (!fields.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!fields.subject) {
    errors.subject = "Please select a subject";
  }

  if (!fields.message.trim()) {
    errors.message = "Message is required";
  } else if (fields.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters";
  }

  return errors;
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function ContactPage() {
  const [fields, setFields] = useState<FormFields>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  /* ---- helpers ---- */

  const updateField = useCallback(
    (key: keyof FormFields, value: string) => {
      setFields((prev) => ({ ...prev, [key]: value }));
      /* clear error for this field on edit */
      if (errors[key]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
      }
    },
    [errors]
  );

  const markTouched = useCallback((key: string) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  }, []);

  /* ---- submit ---- */

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const validationErrors = validate(fields);
      setErrors(validationErrors);
      setTouched({ name: true, email: true, subject: true, message: true });

      if (Object.keys(validationErrors).length > 0) return;

      setStatus("submitting");

      /*
       * ---- Mock async send ----
       * Replace the timeout below with a real API call, e.g.:
       *
       *   await fetch("/api/contact", {
       *     method: "POST",
       *     headers: { "Content-Type": "application/json" },
       *     body: JSON.stringify(fields),
       *   });
       */
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setStatus("success");
    },
    [fields]
  );

  const resetForm = useCallback(() => {
    setFields({ name: "", email: "", subject: "", message: "" });
    setErrors({});
    setTouched({});
    setStatus("idle");
  }, []);

  /* ---- field error renderer (shows only after field is touched) ---- */

  const fieldError = (key: keyof FormErrors) =>
    touched[key] && errors[key] ? (
      <motion.p
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="mt-1.5 text-xs text-red-500"
      >
        {errors[key]}
      </motion.p>
    ) : null;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-24 dark:bg-slate-950 sm:px-6 lg:px-8">
      {/* ================================================================ */}
      {/*  PAGE HEADER                                                     */}
      {/* ================================================================ */}
      <div className="mx-auto max-w-3xl text-center" data-aos="fade-up" data-aos-once="true">
        <span className="inline-block rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-400">
          Contact
        </span>
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          Get in Touch
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600 dark:text-slate-400">
          Have a question, need support, or want to partner with us? We&apos;d
          love to hear from you.
        </p>
      </div>

      {/* ================================================================ */}
      {/*  TWO-COLUMN: FORM + INFO                                         */}
      {/* ================================================================ */}
      <div className="mx-auto mt-16 grid max-w-6xl gap-10 lg:grid-cols-5">
        {/* -------------------------------------------------------------- */}
        {/*  LEFT — Contact Form (3 cols)                                   */}
        {/* -------------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="lg:col-span-3"
        >
          <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <CardContent className="p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  /* ---------- SUCCESS STATE ---------- */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center py-12 text-center"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                      <CheckCircle2
                        size={32}
                        className="text-emerald-600 dark:text-emerald-400"
                      />
                    </div>
                    <h3 className="mt-6 text-xl font-semibold text-slate-900 dark:text-white">
                      Message sent!
                    </h3>
                    <p className="mt-2 max-w-sm text-sm text-slate-600 dark:text-slate-400">
                      We&apos;ll get back to you within 24 hours.
                    </p>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="mt-6 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  /* ---------- FORM STATE ---------- */
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSubmit}
                    noValidate
                    className="space-y-5"
                  >
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                      >
                        Name
                      </label>
                      <InputGroup>
                        <InputGroupPrefix>
                          <User size={16} className="text-slate-400" />
                        </InputGroupPrefix>
                        <InputGroupInput
                          id="contact-name"
                          placeholder="Your full name"
                          value={fields.name}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateField("name", e.target.value)
                          }
                          onBlur={() => markTouched("name")}
                          className="text-sm"
                        />
                      </InputGroup>
                      {fieldError("name")}
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                      >
                        Email
                      </label>
                      <InputGroup>
                        <InputGroupPrefix>
                          <Mail size={16} className="text-slate-400" />
                        </InputGroupPrefix>
                        <InputGroupInput
                          id="contact-email"
                          type="email"
                          placeholder="you@example.com"
                          value={fields.email}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateField("email", e.target.value)
                          }
                          onBlur={() => markTouched("email")}
                          className="text-sm"
                        />
                      </InputGroup>
                      {fieldError("email")}
                    </div>

                    {/* Subject (HeroUI Select) */}
                    <div>
                      <label
                        htmlFor="contact-subject"
                        className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                      >
                        Subject
                      </label>
                      <Select
                        selectedKey={fields.subject || undefined}
                        onSelectionChange={(key) =>
                          updateField("subject", key ? String(key) : "")
                        }
                        placeholder="Select a subject"
                      >
                        <SelectTrigger
                          id="contact-subject"
                          className="w-full"
                        >
                          <SelectValue />
                          <ChevronDown size={16} className="ml-auto text-slate-400" />
                        </SelectTrigger>
                        <SelectPopover className="w-full">
                          <ListBox>
                            {SUBJECT_OPTIONS.map((opt) => (
                              <ListBoxItem key={opt.id} id={opt.id}>
                                {opt.label}
                              </ListBoxItem>
                            ))}
                          </ListBox>
                        </SelectPopover>
                      </Select>
                      {fieldError("subject")}
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="contact-message"
                        className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
                      >
                        Message
                      </label>
                      <InputGroupTextArea
                        id="contact-message"
                        rows={5}
                        placeholder="Tell us how we can help..."
                        value={fields.message}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          updateField("message", e.target.value)
                        }
                        onBlur={() => markTouched("message")}
                        className="w-full rounded-xl border border-slate-300 bg-transparent px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:text-white dark:focus:border-indigo-400"
                      />
                      {fieldError("message")}
                    </div>

                    {/* Submit */}
                    <div className="pt-2">
                      <Button
                        type="submit"
                        isDisabled={status === "submitting"}
                        fullWidth
                        className="bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
                      >
                        {status === "submitting" ? (
                          <span className="inline-flex items-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Sending...
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2">
                            <Send size={16} />
                            Send Message
                          </span>
                        )}
                      </Button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* -------------------------------------------------------------- */}
        {/*  RIGHT — Contact Info Cards (2 cols)                            */}
        {/* -------------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1, ease: "easeOut" }}
          className="space-y-4 lg:col-span-2"
        >
          {INFO_CARDS.map((card) => (
            <Card
              key={card.label}
              className="border border-slate-200 bg-white transition-colors duration-200 hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700"
            >
              <CardContent className="flex items-start gap-4 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40">
                  {card.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {card.label}
                  </p>
                  {card.href ? (
                    <a
                      href={card.href}
                      className="mt-0.5 block text-sm font-medium text-slate-900 transition-colors hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400"
                    >
                      {card.value}
                    </a>
                  ) : (
                    <p className="mt-0.5 text-sm font-medium text-slate-900 dark:text-white">
                      {card.value}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Social icons */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Follow us
            </p>
            <div className="mt-3 flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-indigo-600 dark:hover:text-indigo-400"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ================================================================ */}
      {/*  FAQ TEASER BAND                                                 */}
      {/* ================================================================ */}
      <div
        className="mx-auto mt-16 max-w-3xl text-center"
        data-aos="fade-up"
        data-aos-delay="150"
        data-aos-once="true"
      >
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-5 dark:border-slate-800 dark:bg-slate-900 sm:flex sm:items-center sm:justify-between sm:gap-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            <span className="font-medium text-slate-900 dark:text-white">
              Have a quick question?
            </span>{" "}
            Check our FAQ for instant answers.
          </p>
          <Link
            href="/#faq"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 sm:mt-0"
          >
            View FAQ
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}
