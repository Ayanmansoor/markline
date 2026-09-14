import { getLlmsTxtContent } from "@/lib/geo";

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const content = await getLlmsTxtContent();
    return new Response(content, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error serving /llms.txt:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
