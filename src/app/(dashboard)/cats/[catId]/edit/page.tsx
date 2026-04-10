import { getCatById } from "@/actions/cats";
import { CatForm } from "@/components/cats/cat-form";
import { notFound } from "next/navigation";

export default async function EditCatPage({
  params,
}: {
  params: Promise<{ catId: string }>;
}) {
  const { catId } = await params;
  const cat = await getCatById(catId);

  if (!cat) {
    notFound();
  }

  return (
    <div>
      <CatForm cat={cat} />
    </div>
  );
}
