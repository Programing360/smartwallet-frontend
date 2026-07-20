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
  ArrowRight,
} from "lucide-react";
import {
  Select,
  Label,
  Description,
  ListBox,
  TextArea,
  Input,
  Button,
  Card,
} from "@heroui/react";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
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
/*  Constants                                                         */
/* ------------------------------------------------------------------ */

const SUBJECT_OPTIONS = [
  { id: "general", label: "General Inquiry" },
  { id: "support", label: "Technical Support" },
  { id: "feedback", label: "Product Feedback" },
  { id: "partnership", label: "Strategic Partnership" },
];

const INFO_CARDS = [
  {
    icon: <Mail size={18} className="text-indigo-600 dark:text-indigo-400" />,
    label: "Email Us",
    value: "support@smartwallet.ai",
    href: "mailto:support@smartwallet.ai",
  },
  {
    icon: <Phone size={18} className="text-indigo-600 dark:text-indigo-400" />,
    label: "Call Us",
    value: "+880 171-234-5678",
    href: "tel:+8801712345678",
  },
  {
    icon: <MapPin size={18} className="text-indigo-600 dark:text-indigo-400" />,
    label: "Headquarters",
    value: "Dhaka, Bangladesh",
  },
  {
    icon: <Clock size={18} className="text-indigo-600 dark:text-indigo-400" />,
    label: "Availability",
    value: "Sat–Thu, 9:00 AM – 6:00 PM",
  },
];

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg
        className="h-4 w-4"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: "https://x.com",
    icon: (
      <svg
        className="h-4 w-4"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg
        className="h-4 w-4"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

/* ------------------------------------------------------------------ */
/*  Validation                                                        */
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
/*  Page Component                                                    */
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

  const updateField = useCallback(
    (key: keyof FormFields, value: string) => {
      setFields((prev) => ({ ...prev, [key]: value }));
      if (errors[key]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
      }
    },
    [errors],
  );

  const markTouched = useCallback((key: string) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const validationErrors = validate(fields);
      setErrors(validationErrors);
      setTouched({ name: true, email: true, subject: true, message: true });

      if (Object.keys(validationErrors).length > 0) return;

      setStatus("submitting");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus("success");
    },
    [fields],
  );

  const resetForm = useCallback(() => {
    setFields({ name: "", email: "", subject: "", message: "" });
    setErrors({});
    setTouched({});
    setStatus("idle");
  }, []);

  const selectedSubjectLabel =
    SUBJECT_OPTIONS.find((o) => o.id === fields.subject)?.label ||
    "Select a subject topic";

  return (
    <main className="relative min-h-screen bg-slate-50 overflow-x-hidden px-4 py-24 transition-colors duration-300 dark:bg-[#020618] sm:px-6 lg:px-8">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none dark:bg-indigo-500/5" />
      <div className="absolute bottom-[10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-emerald-500/5 blur-[140px] pointer-events-none" />

      {/* Page Header */}
      <div className="relative mx-auto max-w-3xl text-center">
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-block rounded-full border border-indigo-200 bg-indigo-50/50 backdrop-blur-md px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-950/30 dark:text-indigo-400"
        >
          Get In Touch
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="mt-6 text-4xl font-black tracking-tight text-slate-900 bg-clip-text dark:text-white sm:text-6xl"
        >
          Lets a build something{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
            together
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="mx-auto mt-6 max-w-xl text-lg text-slate-600 font-normal leading-relaxed dark:text-slate-400"
        >
          Have a question, an innovative idea, or a scaling project? Drop us a
          line and let our experts support your journey.
        </motion.p>
      </div>

      {/* Two-Column Grid layout */}
      <div className="mx-auto mt-20 grid max-w-6xl gap-8 lg:grid-cols-5 relative z-10">
        {/* Left Side: Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="lg:col-span-3"
        >
          <Card className="border border-slate-200/80 bg-white/70 shadow-xl shadow-slate-100 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/50 dark:shadow-none">
            <div className="p-6 sm:p-10 overflow-hidden">
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="flex flex-col items-center py-16 text-center"
                  >
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 ring-4 ring-emerald-500/10">
                      <CheckCircle2
                        size={40}
                        className="text-emerald-500 dark:text-emerald-400"
                      />
                    </div>
                    <h3 className="mt-8 text-2xl font-bold text-slate-900 dark:text-white">
                      Transmission Successful
                    </h3>
                    <p className="mt-3 max-w-sm text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      Thank you. Your message has been routed successfully. We
                      typically respond within 24 hours.
                    </p>
                    <Button
                      
                      onPress={resetForm}
                      className="mt-8 font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      Send another message
                    </Button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    noValidate
                    className="space-y-6"
                  >
                    <div className="flex gap-2">
                      {/* Name Input */}
                      <Input
                        type="text"
                        placeholder="John Doe"
                        value={fields.name}
                        onBlur={() => markTouched("name")}
                        className={
                          "font-medium text-slate-700 border p-2 rounded-lg w-full dark:text-slate-300 border-slate-200 bg-slate-50/50 hover:border-indigo-400 focus-within:!border-indigo-500 dark:border-slate-800 dark:bg-[#020618]/40 dark:hover:border-indigo-500"
                        }
                      />

                      {/* Email Input */}
                      <Input
                        type="email"
                        value={fields.email}
                        onBlur={() => markTouched("email")}
                        placeholder="Enter your Email"
                        className={
                          "font-medium text-slate-700 dark:text-slate-30 border rounded-lg p-2 w-full border-slate-200 bg-slate-50/50 hover:border-indigo-400 focus-within:!border-indigo-500 dark:border-slate-800 dark:bg-[#020618]/40 dark:hover:border-indigo-500"
                        }
                      />
                    </div>

                    {/* Compound Select Architectural Match */}
                    <div className="flex flex-col gap-1.5 relative">
                      <Select
                        className="w-full"
                        isOpen={
                          undefined
                        } /* Controlled state overrides can be placed here if desired */
                      >
                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
                          Inquiry Subject
                        </Label>
                        <Select.Trigger
                          onClick={(e) => {
                            e.preventDefault();
                          }} /* Intercept default action if wrapping with custom popover system */
                          className={`flex items-center justify-between w-full h-12 px-3 rounded-md border text-left bg-slate-50/50 text-sm transition-all duration-150 dark:bg-[#020618]/40 ${
                            touched.subject && errors.subject
                              ? "border-danger text-danger"
                              : "border-slate-200 text-slate-800 hover:border-indigo-400 dark:border-slate-800 dark:text-slate-200 dark:hover:border-indigo-500"
                          }`}
                        >
                          <Select.Value className="block truncate">
                            {selectedSubjectLabel}
                          </Select.Value>
                          <Select.Indicator>
                            <ChevronDown size={18} className="text-slate-400" />
                          </Select.Indicator>
                        </Select.Trigger>

                        {touched.subject && errors.subject ? (
                          <Description className="text-xs text-danger mt-1">
                            {errors.subject}
                          </Description>
                        ) : (
                          <Description className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                            Select the option matching your department intent.
                          </Description>
                        )}

                        <Select.Popover className="absolute left-0 right-0 z-50 mt-2 p-1 rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 pointer-events-auto hidden group-focus-within:block focus:block">
                          <ListBox className="p-1 space-y-0.5">
                            {SUBJECT_OPTIONS.map((opt) => (
                              <ListBox.Item
                                key={opt.id}
                                onClick={() => {
                                  updateField("subject", opt.id);
                                  markTouched("subject");
                                }}
                                className={`flex flex-col px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-colors duration-150 select-none ${
                                  fields.subject === opt.id
                                    ? "bg-indigo-50 text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300"
                                    : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-[#020618]/60"
                                }`}
                              >
                                <Label className="font-medium pointer-events-none">
                                  {opt.label}
                                </Label>
                                <Description className="text-xs text-slate-400 pointer-events-none">
                                  Route your case directly
                                </Description>
                              </ListBox.Item>
                            ))}
                          </ListBox>
                        </Select.Popover>
                      </Select>
                    </div>

                    {/* Structural Compound TextArea Component */}
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Your Message
                      </Label>
                      <TextArea
                        aria-label="Contact Message Content"
                        placeholder="Describe your goals, timeline, or inquiries..."
                        value={fields.message}
                        onChange={(e) =>
                          updateField(
                            "message",
                            (e.target as HTMLTextAreaElement).value,
                          )
                        }
                        onBlur={() => markTouched("message")}
                        className={`w-full min-h-[120px] p-3 rounded-md border text-sm bg-slate-50/50 transition-all duration-150 dark:bg-[#020618]/40 dark:text-slate-200 ${
                          touched.message && errors.message
                            ? "border-danger focus:border-danger outline-none"
                            : "border-slate-200 hover:border-indigo-400 focus:border-indigo-500 dark:border-slate-800 dark:hover:border-indigo-500 outline-none"
                        }`}
                      />
                      {touched.message && errors.message && (
                        <Description className="text-xs text-danger mt-0.5">
                          {errors.message}
                        </Description>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <Button
                        type="submit"
                        fullWidth
                        className="bg-indigo-600 dark:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/20 dark:shadow-none hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-200 p-2 rounded-4xl"
                      >
                        {status === "submitting"
                          ? "Encrypting & Sending..."
                          : "Send Secure Message"}
                      </Button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </motion.div>

        {/* Right Side: Contact Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="space-y-4 lg:col-span-2"
        >
          {INFO_CARDS.map((card) => (
            <Card
              key={card.label}
              className="border border-slate-200/60 bg-white/60 backdrop-blur-md text-left transition-all duration-300 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/5 dark:border-slate-800/80 dark:bg-slate-900/40 dark:hover:border-indigo-500/40"
            >
              <div className="flex flex-row items-center gap-5 p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100/50 dark:bg-indigo-950/40 dark:border-indigo-500/10">
                  {card.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    {card.label}
                  </p>
                  <p className="mt-1 text-base font-semibold text-slate-800 tracking-tight dark:text-slate-200">
                    {card.value}
                  </p>
                </div>
              </div>
            </Card>
          ))}

          {/* Social Links Card */}
          <Card className="border border-slate-200/60 bg-white/60 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/40">
            <div className="p-5">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Connect Ecosystem
              </p>
              <div className="mt-4 flex items-center gap-3">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-800 dark:bg-[#020618]/50 dark:text-slate-400 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* FAQ Teaser Band */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
        className="mx-auto mt-20 max-w-3xl text-center relative z-10"
      >
        <div className="rounded-2xl border border-slate-200/60 bg-white/40 px-6 py-5 backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/30 sm:flex sm:items-center sm:justify-between sm:gap-6 text-left">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-900 dark:text-white mr-1">
              Looking for quick answers?
            </span>
            Skip the queue and explore our instant knowledge bank.
          </p>
          <Link
            href="/#faq"
            className="group mt-4 inline-flex items-center gap-1 text-sm font-bold text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 sm:mt-0 whitespace-nowrap"
          >
            Explore FAQ
            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
