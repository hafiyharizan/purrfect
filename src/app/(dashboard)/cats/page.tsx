import { getCats } from "@/actions/cats";
import { CatCard } from "@/components/cats/cat-card";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function CatsPage() {
  const cats = await getCats();

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Kitties"
        subtitle="Your feline family members"
        action={
          <Link href="/cats/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add a Feline
            </Button>
          </Link>
        }
      />

      {cats.length === 0 ? (
        <EmptyState
          title="No felines yet"
          description="Add your first cat to start booking care services."
          action={
            <Link href="/cats/new">
              <Button>Add Your First Cat</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cats.map((cat) => (
            <CatCard key={cat.id} cat={cat} />
          ))}
        </div>
      )}
    </div>
  );
}
