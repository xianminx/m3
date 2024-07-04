import { renderHtml, renderPng } from "@/utils/mm";
import { NextRequest, NextResponse } from "next/server";
import { decode } from "@/utils/encoder";

export async function GET(req: NextRequest, { params }: { params: { format: string; hash: string } }) {
    const { format, hash } = params;

    if (!format || !hash) {
        return NextResponse.json({ error: "Format and hash are required" }, { status: 400 });
    }

    if (format !== "html" && format !== "png") {
        return NextResponse.json({ error: "Invalid format" }, { status: 400 });
    }

    if (!hash.match(/^[a-zA-Z0-9+-/_]+$/)) {
        return NextResponse.json({ error: "Invalid hash" }, { status: 400 });
    }

    try {
        const markdown = decode(hash);
        if (format === "html") {
            const html = renderHtml(markdown);
            return new Response(html, {
                headers: { "Content-Type": "text/html" },
            });
        } else if (format === "png") {
            const buffer = await renderPng(markdown);
            return new Response(buffer, {
                headers: { "Content-Type": "image/png" },
            });
        }
    } catch (e) {
        return NextResponse.json({ error: "Invalid hash", e}, { status: 400 });
    }

    return NextResponse.json({ format, hash });
}
