import { encode } from '@/utils/encoder';
import { NextRequest, NextResponse } from 'next/server';

type Params = {
    markdown: string;
};
/**
 * @swagger
 * components:
 *   schemas:
 *     RenderLinks:
 *       type: object
 *       properties:
 *         hash:
 *           type: string
 *         png:
 *           type: string
 *         html:
 *           type: string
 *         interactive:
 *           type: string
 *
 */
interface RenderLinks {
    hash: string;
    png: string;
    html: string;
    interactive: string;
}

/**
 * @swagger
 * /api/links:
 *   get:
 *     operationId: renderLinks
 *     description: Returns the HTML or PNG render URL given markdown content in raw text.
 *     parameters:
 *       - name: markdown
 *         in: query
 *         description: markdown content in raw text.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RenderLinks'
 *
 */

export async function GET(req: NextRequest, context: { params: Params }) {
    // console.error('GET /api/links params=', params);
    const { searchParams } = new URL(req.url);
    const markdown = searchParams.get('markdown');
    if (!markdown) {
        return NextResponse.json(
            { error: 'Format and hash are required' },
            { status: 400 }
        );
    }

    const hash = encode(markdown as string);

    const basePath = req.nextUrl.origin;
    const links: RenderLinks = {
        hash,
        png: `${basePath}/render/png/${hash}`,
        html: `${basePath}/render/html/${hash}`,
        interactive: `${basePath}/mind?hash=${hash}`,
    };

    return NextResponse.json(links);
}
