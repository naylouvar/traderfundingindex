import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/contact-form";
import { Markdown } from "@/components/markdown";
import { getPage } from "@/lib/pages";

async function load(slug: string) {
  const page = await getPage(slug);
  return page?.published ? page : null;
}

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const page = await load((await params).slug);
  return page ? { title: page.title, description: page.description || undefined } : {};
}

export default async function ContentPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const page = await load(slug);
  if (!page) notFound();

  return (
    <article className="mx-auto max-w-3xl">
      <header className="border-b border-white/10 pb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{page.title}</h1>
        {page.description && <p className="mt-3 text-lg text-muted">{page.description}</p>}
        {page.updatedAt && (
          <p className="mt-4 text-xs text-muted">
            Last updated {page.updatedAt.toLocaleDateString("en-US", { dateStyle: "long" })}
          </p>
        )}
      </header>
      <div className="pt-8">
        <Markdown source={page.body} />
      </div>
      {slug === "contact" && (
        <div className="mt-10">
          <ContactForm />
        </div>
      )}
    </article>
  );
}
