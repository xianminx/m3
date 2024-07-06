import { renderHtml, renderPng } from '@/utils/mm';
import { NextRequest, NextResponse } from 'next/server';
import { decode } from '@/utils/encoder';

/**
 * @swagger
 * /api/render/{format}/{hash}:
 *   get:
 *     operationId: renderWithFormatAndHash
 *     description: Return a rendered png image if format is 'png', and a html source code if format is 'html'.
 *     parameters:
 *       - name: format
 *         in: path
 *         description: png or html
 *         required: true
 *         schema:
 *           type: string
 *       - name: hash
 *         in: path
 *         description: content encoded in base64-similar encoding, see [PlantUML web server](https://www.plantuml.com/plantuml/uml/SyfFKj2rKt3CoKnELR1Io4ZDoSa70000)
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           image/png:
 *              schema:
 *                type: string
 *                format: binary
 *           text/html:
 *              schema:
 *                type: string
 *
 *
 */
export async function GET(req: NextRequest, { params }: { params: { format: string; hash: string } }) {
    const { format, hash } = params;
    if (!format || !hash) {
        return NextResponse.json({ error: 'Format and hash are required' }, { status: 400 });
    }

    if (format !== 'html' && format !== 'png') {
        return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
    }

    if (!hash.match(/^[a-zA-Z0-9+-/_]+$/)) {
        return NextResponse.json({ error: 'Invalid hash' }, { status: 400 });
    }

    try {
        const markdown = decode(hash);
        if (format === 'html') {
            const html = renderHtml(markdown);
            return new Response(html, {
                headers: { 'Content-Type': 'text/html' },
            });
        } else if (format === 'png') {
            const buffer = await renderPng(markdown);
            return new Response(buffer, {
                headers: { 'Content-Type': 'image/png' },
            });
        }
    } catch (e) {
        return NextResponse.json({ error: 'Invalid hash', e }, { status: 400 });
    }

    return NextResponse.json({ format, hash });
}
