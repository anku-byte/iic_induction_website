"use client";

import React from "react"

import { Navbar } from "@/components/navbar";
import { Starfield } from "@/components/starfield";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Rocket,
  Cpu,
  Wrench,
  Beaker,
  Megaphone,
  Zap,
  Hash,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { RegistrationFormData } from "@/lib/registration-schema";

interface DomainData {
  name: string;
  icon: React.ElementType;
  description: string;
  subdomains?: { name: string; description: string }[];
}

const domains: DomainData[] = [
  {
    name: "Computer Science",
    icon: Cpu,
    description:
      "Building the brains behind the rockets -- from intelligent systems to web platforms.",
    subdomains: [
      {
        name: "AIML",
        description:
          "Artificial Intelligence & Machine Learning -- predictive models, data analysis, and autonomous systems.",
      },
      {
        name: "WebDev",
        description:
          "Web Development -- building tools, dashboards, and platforms for the club.",
      },
    ],
  },
  {
    name: "Electronics",
    icon: Zap,
    description:
      "Circuit design, avionics, telemetry, and embedded systems that power our rockets.",
  },
  {
    name: "Mechanical",
    icon: Wrench,
    description:
      "Structural design, aerodynamics, propulsion systems, and manufacturing.",
  },
  {
    name: "Chemical",
    icon: Beaker,
    description:
      "Propellant chemistry, fuel research, and material science for rocket components.",
  },
  {
    name: "Outreach",
    icon: Megaphone,
    description:
      "Spreading the word and building the brand through creative content and design.",
    subdomains: [
      {
        name: "Graphic Designing",
        description:
          "Visual identity, posters, social media graphics, and event branding.",
      },
      {
        name: "Content Writing",
        description:
          "Blogs, reports, social media content, and documentation.",
      },
    ],
  },
];

function DomainCard({ domain }: { domain: DomainData }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = domain.icon;

  return (
    <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm transition-colors hover:bg-secondary/30">
      <button
        type="button"
        onClick={() => domain.subdomains && setExpanded(!expanded)}
        className={`flex w-full items-center gap-4 p-5 text-left ${domain.subdomains ? "cursor-pointer" : "cursor-default"}`}
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">{domain.name}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            {domain.description}
          </p>
        </div>
        {domain.subdomains && (
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {expanded && domain.subdomains && (
        <div className="flex flex-col gap-2 border-t border-border px-5 py-4">
          {domain.subdomains.map((sub) => (
            <div
              key={sub.name}
              className="rounded-lg border border-border/50 bg-secondary/20 p-4"
            >
              <p className="mb-1 text-xs font-semibold tracking-wide text-foreground">
                {sub.name}
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {sub.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"domains" | "profile">("domains");
  const [userData, setUserData] = useState<RegistrationFormData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("iic_registration");
    if (stored) {
      try {
        setUserData(JSON.parse(stored));
      } catch {
        setUserData(null);
      }
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-background">
      <Starfield />
      <Navbar />

      <main className="relative z-10 mx-auto max-w-4xl px-6 pt-24 pb-16">
        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground">
            Mission Control
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Dashboard
          </h1>
        </div>

        {/* Tab switch */}
        <div className="mb-8 flex w-fit gap-1 rounded-lg border border-border bg-secondary/30 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("domains")}
            className={`rounded-md px-5 py-2 text-sm font-medium tracking-wide transition-colors ${
              activeTab === "domains"
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Domains
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`rounded-md px-5 py-2 text-sm font-medium tracking-wide transition-colors ${
              activeTab === "profile"
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Profile
          </button>
        </div>

        {activeTab === "domains" ? (
          <div className="flex flex-col gap-6">
            {/* Club brief */}
            <div className="rounded-xl border border-border bg-card/50 p-6 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary">
                  <Rocket className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h2 className="mb-1 text-lg font-bold text-foreground">
                    IIC Rocketry Club
                  </h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    The Innovation & Incubation Club is a student-driven rocketry
                    organization focused on building, launching, and innovating
                    across multiple engineering domains. From propulsion to AI,
                    we push boundaries.
                  </p>
                </div>
              </div>
            </div>

            {/* Domains list */}
            <div>
              <h3 className="mb-4 text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground">
                Club Domains
              </h3>
              <div className="flex flex-col gap-3">
                {domains.map((domain) => (
                  <DomainCard key={domain.name} domain={domain} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Profile Tab */
          <div>
            {userData ? (
              <div className="flex flex-col gap-6">
                {/* Profile header card */}
                <div className="flex flex-col items-center gap-5 rounded-xl border border-border bg-card/50 p-8 text-center backdrop-blur-sm sm:flex-row sm:text-left">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-border bg-secondary">
                    <User className="h-9 w-9 text-muted-foreground" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      {userData.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {userData.branch} | Reg: {userData.registrationNumber}
                    </p>
                    <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-foreground" />
                      </span>
                      <span className="text-[10px] font-medium uppercase tracking-widest text-foreground">
                        Registered
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details grid */}
                <div className="rounded-xl border border-border bg-card/50 p-6 backdrop-blur-sm">
                  <h3 className="mb-5 text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground">
                    Personal Details
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { icon: User, label: "Full Name", value: userData.name },
                      { icon: Mail, label: "Email", value: userData.email },
                      { icon: Phone, label: "Phone", value: userData.phone },
                      {
                        icon: GraduationCap,
                        label: "Branch",
                        value: userData.branch,
                      },
                      {
                        icon: Hash,
                        label: "Registration No.",
                        value: userData.registrationNumber,
                      },
                    ].map((field) => (
                      <div
                        key={field.label}
                        className="flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-4"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary">
                          <field.icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground">
                            {field.label}
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {field.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Not registered */
              <div className="flex flex-col items-center gap-6 rounded-xl border border-border bg-card/50 p-12 text-center backdrop-blur-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-secondary">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h2 className="mb-2 text-xl font-bold text-foreground">
                    No Profile Found
                  </h2>
                  <p className="mb-6 text-sm text-muted-foreground">
                    You need to register first to view your profile details.
                  </p>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-foreground px-6 py-3 text-sm font-bold uppercase tracking-widest text-background transition-colors hover:bg-foreground/90"
                  >
                    <Rocket className="h-4 w-4" />
                    Register Now
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
