"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { logout } from "@/actions/auth";
import { LogOut } from "lucide-react";

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
    address: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("customer_profiles")
        .select("full_name, phone, address")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setProfile({
          full_name: data.full_name || "",
          phone: data.phone || "",
          address: data.address || "",
        });
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("customer_profiles")
      .update(profile)
      .eq("user_id", user.id);

    setSaving(false);
    setMessage(error ? error.message : "Profile updated successfully!");
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <PageHeader title="Settings" subtitle="Manage your account" />

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <div
              className={`rounded-xl p-3 text-sm ${
                message.includes("success")
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={profile.full_name}
              onChange={(e) =>
                setProfile({ ...profile, full_name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={profile.phone}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
              placeholder="(555) 123-4567"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={profile.address}
              onChange={(e) =>
                setProfile({ ...profile, address: e.target.value })
              }
              placeholder="123 Cat Street, Kittyville"
            />
          </div>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={logout}>
            <Button variant="outline" type="submit">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
