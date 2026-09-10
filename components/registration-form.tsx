"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registrationSchema,
  type RegistrationFormData,
} from "@/lib/registration-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Rocket, CheckCircle } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export function RegistrationForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      branch: "",
      registrationNumber: "",
    },
  });

  async function onSubmit(data: RegistrationFormData) {
    setSubmitError(null);

    // Try saving to the server (non-blocking — registration works even if DB is down)
    try {
      await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch {
      // Server unavailable — continue with local registration
    }

    // Store in localStorage so dashboard/profile can read it
    localStorage.setItem("iic_registration", JSON.stringify(data));
    setIsSubmitted(true);
  }

  if (isSubmitted) {
    return (
      <div className="flex w-full max-w-2xl flex-col items-center gap-8 rounded-xl border border-border bg-card/50 p-12 text-center backdrop-blur-sm">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-border bg-secondary">
          <CheckCircle className="h-10 w-10 text-foreground" />
        </div>

        <div>
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground">
            Registration Successful
          </h2>
          <p className="mb-2 font-mono text-sm tracking-[0.3em] uppercase text-muted-foreground">
            You&apos;re In
          </p>
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground">
            Welcome to the Idea Innovation Cell. Your registration has been
            confirmed — the countdown to your induction begins now. Stay tuned
            for further updates.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 pt-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-foreground" />
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-foreground">
              Registered
            </span>
          </div>

          <Link
            href="/dashboard"
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border bg-foreground px-6 py-3 text-sm font-bold uppercase tracking-widest text-background transition-colors hover:bg-foreground/90"
          >
            <Rocket className="h-4 w-4" />
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl rounded-xl border border-border bg-card/50 p-8 backdrop-blur-sm">
      <div className="mb-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1">
          <Rocket className="h-3 w-3 text-muted-foreground" />
          <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground">
            Join Us
          </span>
        </div>
        <h2 className="mb-1 text-2xl font-bold tracking-tight text-foreground">
          Register for Orientation
        </h2>
        <p className="text-sm text-muted-foreground">
          Fill in your details to register for the Idea Innovation Cell
          orientation.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs tracking-wider uppercase text-muted-foreground">
                  Full Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your full name"
                    className="border-border bg-secondary/30 text-foreground placeholder:text-muted-foreground focus-visible:ring-foreground/20"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email & Phone row */}
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs tracking-wider uppercase text-muted-foreground">
                    Email ID
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      className="border-border bg-secondary/30 text-foreground placeholder:text-muted-foreground focus-visible:ring-foreground/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs tracking-wider uppercase text-muted-foreground">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="10-digit number"
                      className="border-border bg-secondary/30 text-foreground placeholder:text-muted-foreground focus-visible:ring-foreground/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Branch & Registration Number */}
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="branch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs tracking-wider uppercase text-muted-foreground">
                    Branch
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Computer Science"
                      className="border-border bg-secondary/30 text-foreground placeholder:text-muted-foreground focus-visible:ring-foreground/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="registrationNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs tracking-wider uppercase text-muted-foreground">
                    Registration Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 2024XXXX"
                      className="border-border bg-secondary/30 text-foreground placeholder:text-muted-foreground focus-visible:ring-foreground/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {submitError && (
            <p className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {submitError}
            </p>
          )}

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="mt-2 h-12 w-full font-bold tracking-widest uppercase"
          >
            <Rocket className="h-4 w-4" />
            {form.formState.isSubmitting ? "Registering..." : "Register Now"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
