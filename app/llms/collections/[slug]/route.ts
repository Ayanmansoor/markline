import { getCollectionGeoMarkdown } from "@/lib/geo";

export const revalidate = 3600; // Cache for 1 hour

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const markdown = await getCollectionGeoMarkdown(slug);

    if (!markdown) {
      return new Response("Collection Not Found", {
        status: 404,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    return new Response(markdown, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error serving collection GEO markdown:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
