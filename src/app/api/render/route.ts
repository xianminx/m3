import { NextRequest, NextResponse } from 'next/server';
import { encode } from '../../../utils/encoder';

async function handleRequest(content: string | null, req: NextRequest) {
    if (!content) {
        return NextResponse.json({ error: 'Markdown content is required' }, { status: 400 });
    }

    const hash = encode(content);

    const host = req.headers.get('host');
    const protocol = req.headers.get('x-forwarded-proto') || 'https';
    const baseUrl = `${protocol}://${host}`;

    const resp = {
        url: `${baseUrl}/api/render/png/${hash}`,
        html: `${baseUrl}/api/render/html/${hash}`,
        content: content,
    }
    return NextResponse.json(resp);
}

export async function POST(req: NextRequest) {
    const { content } = await req.json();
    return handleRequest(content, req);
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const content = searchParams.get('content');
    return handleRequest(content, req);
}