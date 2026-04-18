import { getCollection, type CollectionEntry } from "astro:content";
import type { APIRoute } from "astro";
import { resolveExample } from "../../../examples";

type Props = {
  exampleId: string;
};

export async function getStaticPaths() {
  const entries = await getCollection("examples");

  return entries.map((entry: CollectionEntry<"examples">) => ({
    params: { slug: entry.id },
    props: { exampleId: entry.id }
  }));
}

export const GET: APIRoute<Props> = async ({ props }) => {
  const loadExample = resolveExample(props.exampleId);

  if (!loadExample) {
    return new Response("Example not found", { status: 404 });
  }

  const source = await loadExample()

  return new Response(source, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8"
    }
  });
};
