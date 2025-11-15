"use client";

import { useState } from "react";

const navigationItems = [
  {
    title: "Getting Started",
    items: [
      { id: "overview", label: "Overview" },
      { id: "installation", label: "Installation" },
      { id: "quick-start", label: "Quick Start" },
    ],
  },
  {
    title: "Architecture",
    items: [
      { id: "system-design", label: "System Design" },
      { id: "components", label: "Components" },
      { id: "data-flow", label: "Data Flow" },
    ],
  },
  {
    title: "API Reference",
    items: [
      { id: "endpoints", label: "Endpoints" },
      { id: "authentication", label: "Authentication" },
      { id: "rate-limits", label: "Rate Limits" },
    ],
  },
  {
    title: "Guides",
    items: [
      { id: "best-practices", label: "Best Practices" },
      { id: "troubleshooting", label: "Troubleshooting" },
      { id: "deployment", label: "Deployment" },
    ],
  },
];

export function LeftSidebar() {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <aside className="hidden md:block w-64 shrink-0">
      <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto py-8 pr-4">
        <nav className="space-y-6">
          {navigationItems.map((section) => (
            <div key={section.title}>
              <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </h4>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        activeSection === item.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
