"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registrationSchema,
  type RegistrationFormData,
  BRANCHES,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Rocket, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function RegistrationForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      registrationNumber: "",
    },
  });

  async function onSubmit(data: RegistrationFormData) {
    setSubmitError(null);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        setSubmitError(
          payload?.error ?? "Something went wrong. Please try again.",
        );
        return;
      }
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
      return;
    }

    // Store in localStorage so dashboard/profile can read it
    localStorage.setItem("iic_registration", JSON.stringify(data));
    setIsSubmitted(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center gap-6 rounded-xl border border-border bg-card/50 p-12 text-center backdrop-blur-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-secondary">
          <CheckCircle className="h-8 w-8 text-foreground" />
        </div>
        <div>
          <h2 className="mb-2 text-2xl font-bold text-foreground">
            Registration Successful
          </h2>
          <p className="text-sm text-muted-foreground">
            Redirecting you to the dashboard...
          </p>
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
            Join the Crew
          </span>
        </div>
        <h2 className="mb-1 text-2xl font-bold tracking-tight text-foreground">
          Register for Induction
        </h2>
        <p className="text-sm text-muted-foreground">
          Fill in your details to register for the IIC Rocketry Club induction quiz.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-border bg-secondary/30 text-foreground focus:ring-foreground/20">
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border-border bg-popover">
                      {BRANCHES.map((branch) => (
                        <SelectItem key={branch} value={branch}>
                          {branch}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
