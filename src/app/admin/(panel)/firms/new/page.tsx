import { createFirm } from "../../../actions";
import { Field, Select, assetClassOptions } from "../../../_components/fields";

export default async function NewFirmPage({ searchParams }: PageProps<"/admin/firms/new">) {
  const { error } = await searchParams;
  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Add a firm</h1>
      {error === "slug" && (
        <p className="text-sm text-red-400">A firm with that name or URL slug already exists.</p>
      )}
      <form action={createFirm} className="space-y-4">
        <Field label="Name" name="name" required />
        <Field label="Website" name="website" type="url" placeholder="https://" />
        <Select label="Asset class" name="assetClass" defaultValue="FUTURES" options={assetClassOptions} />
        <button className="btn-primary">Create firm</button>
      </form>
    </div>
  );
}
