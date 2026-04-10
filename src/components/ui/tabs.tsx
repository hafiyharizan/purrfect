"use client";

import { cn } from "@/lib/utils";
import { createContext, useContext, useState, type ReactNode } from "react";

const TabsContext = createContext<{
  value: string;
  onChange: (value: string) => void;
}>({ value: "", onChange: () => {} });

interface TabsProps {
  defaultValue: string;
  children: ReactNode;
  className?: string;
}

export function Tabs({ defaultValue, children, className }: TabsProps) {
  const [value, setValue] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ value, onChange: setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-accent/50 p-1",
        className
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  children,
  className,
}: {
  value: string;
  children: ReactNode;
  className?: string;
}) {
  const context = useContext(TabsContext);
  const isActive = context.value === value;

  return (
    <button
      onClick={() => context.onChange(value)}
      className={cn(
        "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-white text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: ReactNode;
  className?: string;
}) {
  const context = useContext(TabsContext);
  if (context.value !== value) return null;
  return <div className={className}>{children}</div>;
}
