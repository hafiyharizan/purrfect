import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <Link href="/" className="mb-8">
        <h1 className="text-3xl font-display font-bold text-primary">
          Snuggle Cat Sitter
        </h1>
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
