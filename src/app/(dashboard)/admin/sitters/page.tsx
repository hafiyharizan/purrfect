import { getSitters } from "@/actions/admin";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Users } from "lucide-react";

export default async function SittersPage() {
  const sitters = await getSitters();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Sitters"
        subtitle="Manage your team of cat care professionals"
      />

      {sitters.length === 0 ? (
        <EmptyState
          icon={<Users className="h-8 w-8" />}
          title="No sitters yet"
          description="Sitters will appear here once they create accounts with the sitter role."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sitters.map((sitter) => (
            <Card key={sitter.id} className="p-6">
              <div className="flex items-center gap-4">
                <Avatar
                  src={sitter.avatar_url}
                  alt={sitter.full_name}
                  fallback={sitter.full_name.charAt(0)}
                  size="lg"
                />
                <div>
                  <h3 className="font-serif font-semibold">
                    {sitter.full_name}
                  </h3>
                  <Badge variant="outline" className="mt-1">
                    Sitter
                  </Badge>
                </div>
              </div>
              {sitter.phone && (
                <p className="text-sm text-muted-foreground mt-3">
                  {sitter.phone}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
