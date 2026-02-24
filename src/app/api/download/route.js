export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const fileUrl = searchParams.get("url");
  const filename = searchParams.get("name") || "file.pdf";

  if (!fileUrl) {
    return new Response("No file", { status: 400 });
  }

  const fileRes = await fetch(fileUrl);
  const buffer = await fileRes.arrayBuffer();

  const safeName = "download.pdf";
  const encodedName = encodeURIComponent(filename);

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition":
        `attachment; filename="${safeName}"; filename*=UTF-8''${encodedName}`,
    },
  });
}