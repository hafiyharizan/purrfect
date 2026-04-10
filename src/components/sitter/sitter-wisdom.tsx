import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";

export function SitterWisdom() {
  return (
    <Card className="p-6">
      <h3 className="font-serif font-semibold mb-3">Sitter Wisdom</h3>
      <div className="bg-accent/50 rounded-xl p-4 mb-4">
        <p className="text-sm italic text-muted-foreground">
          &ldquo;A slow blink is the highest form of feline flattery. If the
          cat stares, blink slowly to show you&apos;re a friend.&rdquo;
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Avatar src={null} alt="Senior Sitter" fallback="E" size="md" />
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Pro Tip From
          </p>
          <p className="text-sm font-semibold">Senior Sitter Elena</p>
        </div>
      </div>
    </Card>
  );
}
