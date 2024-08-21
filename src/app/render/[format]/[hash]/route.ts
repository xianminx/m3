import { decode } from '@/utils/encoder';
import { renderHtml, renderPng } from '@/utils/mm';
import { list } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { cachePngPath, saveMd, savePng } from './store';

/**
 * @swagger
 * /render/{format}/{hash}:
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
            const html = await renderHtml(markdown);
            return new Response(html, {
                headers: { 'Content-Type': 'text/html' },
            });
        } else if (format === 'png') {
            // check if png has been rendered before, if so, return the url
            const md5 = createHash('md5').update(markdown).digest('hex');
            const existingPngUrl = cachePngPath(md5);

            try {
                // head function requires a full url, not just the pathname
                // const blob = await head(existingPngUrl);
                const blobs = await list({ prefix: existingPngUrl });
                if (blobs.blobs.length > 0) {
                    const blob = blobs.blobs[0];
                    return NextResponse.redirect(blob.downloadUrl);
                }
            } catch (e: unknown) {
                console.error('Blob not found', e);
            }

            const buffer = await renderPng(markdown);
            const [png, md] = await Promise.all([savePng(md5, buffer), saveMd(md5, markdown)]);

            console.log(`PNG uploaded to ${png}, MD to ${md}`);
            return NextResponse.redirect(png);
        }
    } catch (e) {
        console.error('Error rendering', e);
        return NextResponse.json({ error: 'Render error' + JSON.stringify(e) }, { status: 400 });
    }

    return NextResponse.json({ format, hash });
}
