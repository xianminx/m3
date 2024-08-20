import { renderHtml, renderPng } from '@/utils/mm';
import { NextRequest, NextResponse } from 'next/server';
import { decode } from '@/utils/encoder';
import { createHash } from 'node:crypto';
import { put, head, BlobNotFoundError } from '@vercel/blob';
import path from 'node:path';
import fs from 'node:fs';

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

            // try {
            //     const meta = await head(existingPngUrl);
            //     if (meta && meta.downloadUrl) {
            //         return NextResponse.redirect(meta.downloadUrl);
            //     }
            // } catch (e: unknown) {
            //     console.error('Blob not found', e);
            // }

            const buffer = await renderPng(markdown);
            const [png, md] = await Promise.all([savePng(md5, buffer), saveMarkdown(md5, markdown)]);

            console.log(`PNG uploaded to ${png}, MD to ${md}`);
            return NextResponse.redirect(png);
        }
    } catch (e) {
        console.error('Error rendering', e);
        return NextResponse.json({ error: 'Render error' + JSON.stringify(e) }, { status: 400 });
    }

    return NextResponse.json({ format, hash });
}

function cachePngPath(md5: string) {
    return `/m3/render/png/${md5}.png`;
}

async function savePng(md5: string, screenshot: Buffer): Promise<string> {
    const localFilePath = path.join(process.cwd(), 'public', 'assets', `${md5}.png`);

    fs.writeFileSync(localFilePath, screenshot);
    console.log(`Screenshot saved locally at ${localFilePath}`);

    const { url } = await put(cachePngPath(md5), screenshot, { access: 'public' });
    return url;
}

async function saveMarkdown(md5: string, markdown: string): Promise<string> {
    const localFilePath = path.join(process.cwd(), 'public', 'assets', `${md5}.md`);
    fs.writeFileSync(localFilePath, markdown);
    console.log(`Screenshot saved locally at ${localFilePath}`);
    const { url } = await put(`/m3/render/md/${md5}.md`, markdown, { access: 'public' });
    return url;
}
