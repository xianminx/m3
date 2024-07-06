import { fillTemplate } from 'markmap-render';
import { Transformer } from 'markmap-lib';
import puppeteer, { Browser } from 'puppeteer';
import chromium from '@sparticuz/chromium';

export function renderHtml(markdown: string): string {
    const transformer = new Transformer();
    const { root, features } = transformer.transform(markdown);
    // const assets = transformer.getUsedAssets(features);
    const assets = transformer.getAssets();
    const html = fillTemplate(root, assets);
    return html;
}

// Keep in memory for possible re-use between innovations
let browser: Browser | null = null;

export async function renderPng(markdown: string): Promise<Buffer> {
    const html = renderHtml(markdown);

    // Set this variable as required - @sparticuz/chromium does not work on ARM, so we use a standard Chrome executable locally - see issue https://github.com/Sparticuz/chromium/issues/186

    const isLocal = process.env.VERCEL !== '1';
    console.log('renderPng chrome path:', await chromium.executablePath());

    if (!browser?.connected) {
        // If you don't need webGL, this skips the extraction of the bin/swiftshader.tar.br file, improving performance
        chromium.setGraphicsMode = false;
        console.log('renderPng chromium loading chrome');
        const options = isLocal
            ? {}
            : {
                  args: [
                      ...chromium.args,
                      // @sparticuz/chromium has default chromeArgs to improve serverless performance, but you can add others as you deem appropriate
                      '--font-render-hinting=none', // Improves font-rendering quality and spacing
                  ],
                  executablePath: await chromium.executablePath(),
                  headless: chromium.headless,
                  ignoreHTTPSErrors: true,
              };
        console.log('renderPng chromium chrome before launch');

        browser = await puppeteer.launch(options);
        console.log('renderPng chromium chrome after launch');
    }

    console.log('renderPng chromium chrome before page');

    const page = await browser.newPage();
    console.log('renderPng chromium chrome after page');

    await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 2 });
    await page.setContent(html);

    console.log('renderPng chromium chrome before screenshot');
    const screenshot = await page.screenshot({ fullPage: true });
    console.log('renderPng chromium chrome after screenshot');

    // We don't want headless Chrome instances left running locally
    if (isLocal) {
        await browser.close();
    }

    return screenshot;
}
