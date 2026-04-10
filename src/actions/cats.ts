"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { ActionResult, Cat } from "@/types";

const CatSchema = z.object({
  name: z.string().min(1, "Name is required"),
  breed: z.string().optional(),
  age_years: z.coerce.number().int().min(0).max(30).optional(),
  weight_kg: z.coerce.number().min(0).max(50).optional(),
  medical_notes: z.string().optional(),
  special_needs: z.string().optional(),
  mood: z.string().optional(),
});

export async function getCats(): Promise<Cat[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: profile } = await supabase
    .from("customer_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!profile) return [];

  const { data } = await supabase
    .from("cats")
    .select("*")
    .eq("owner_id", profile.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (data as Cat[]) || [];
}

export async function getCatById(catId: string): Promise<Cat | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("cats")
    .select("*")
    .eq("id", catId)
    .single();

  return data as Cat | null;
}

export async function createCat(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const parsed = CatSchema.safeParse({
    name: formData.get("name"),
    breed: formData.get("breed") || undefined,
    age_years: formData.get("age_years") || undefined,
    weight_kg: formData.get("weight_kg") || undefined,
    medical_notes: formData.get("medical_notes") || undefined,
    special_needs: formData.get("special_needs") || undefined,
    mood: formData.get("mood") || "Relaxed",
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("customer_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    return { success: false, error: "Profile not found" };
  }

  const { error } = await supabase.from("cats").insert({
    owner_id: profile.id,
    ...parsed.data,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/cats");
  revalidatePath("/dashboard");
  redirect("/cats");
}

export async function updateCat(
  catId: string,
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const parsed = CatSchema.safeParse({
    name: formData.get("name"),
    breed: formData.get("breed") || undefined,
    age_years: formData.get("age_years") || undefined,
    weight_kg: formData.get("weight_kg") || undefined,
    medical_notes: formData.get("medical_notes") || undefined,
    special_needs: formData.get("special_needs") || undefined,
    mood: formData.get("mood") || undefined,
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("cats")
    .update(parsed.data)
    .eq("id", catId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/cats");
  revalidatePath("/dashboard");
  redirect("/cats");
}

export async function deleteCat(catId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("cats")
    .update({ is_active: false })
    .eq("id", catId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/cats");
  revalidatePath("/dashboard");
  return { success: true };
}
