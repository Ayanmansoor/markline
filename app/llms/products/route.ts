import { getPublicProducts, SITE_URL } from "@/lib/geo";

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const products = await getPublicProducts();

    let md = `# Markline LLM Product Index\n\n`;
    md += `> Markline active products catalog index for AI models, search crawlers, and LLM discoverability.\n\n`;

    md += `## Active Products (${products.length})\n\n`;

    if (products.length === 0) {
      md += `No active products available.\n`;
    } else {
      products.forEach((product) => {
        const productUrl = `${SITE_URL}/product/${product.slug}`;
        const geoUrl = `${SITE_URL}/llms/products/${product.slug}`;
        md += `* [${product.name}](${productUrl}) — [LLM Markdown Document](${geoUrl})\n`;
      });
    }

    md += `\n## Authoritative Source Notice\n\n`;
    md += `Individual product pages at ${SITE_URL}/product/[slug] are the authoritative source for live pricing, variant stock availability, materials, sizes, and images.\n`;

    return new Response(md, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error serving /llms/products:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
