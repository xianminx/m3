import { fillTemplate } from 'markmap-render';
import { Transformer } from 'markmap-lib';
import puppeteer, { Browser } from 'puppeteer';
import chromium from '@sparticuz/chromium';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import getConfig from 'next/config';

export async function renderHtml(markdown: string) {
    const { serverRuntimeConfig } = getConfig();
    console.log('serverRuntimeConfig', serverRuntimeConfig);

    // Get the project root directory

    const projectRoot = process.cwd();

    console.log('Project Root:', projectRoot);

    const transformer = new Transformer();
    const { root, features } = transformer.transform(markdown);
    // const assets = transformer.getUsedAssets(features);
    const assets = transformer.getAssets();
    let html = fillTemplate(root, assets);
    html = await inlineStylesAndScript(html);

    const timestamp = Date.now();
    const filename = `${timestamp}.html`;
    const filepath = path.join(projectRoot, 'public', filename);
    fs.writeFileSync(filepath, html);
    console.log(`HTML content written to ${filepath}`);
    console.log('current script path: ', __dirname);
    return html;
}

async function inlineStylesAndScript(html: string) {
    const styleLinks = html.match(/<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi);
    if (styleLinks) {
        for (const styleLink of styleLinks) {
            const styleHrefMatch = styleLink.match(/href=["'](.*?)["']/i);
            if (styleHrefMatch) {
                const styleHref = styleHrefMatch[1];
                const filepath = await fetchAndInlineContent(styleHref);
                html = html.replace(styleLink, `<link rel="stylesheet" href="${filepath}">`);
                console.log('styleLink: original', styleLink);
                // console.log('styleLink: replaced', `<style>${inlineStyle}</style>`);
            } else {
                console.error('styleLink: no match', styleLink);
            }
        }
    }

    const scriptTags = html.match(/<script\b[^>]*src=["'](.*?)["'][^>]*>([\s\S]*?)<\/script>/gi);
    if (scriptTags) {
        for (const scriptTag of scriptTags) {
            const scriptContentMatch = scriptTag.match(/src=["'](.*?)["']/i);
            if (scriptContentMatch) {
                const scriptContent = scriptContentMatch[1];
                const filepath = await fetchAndInlineContent(scriptContent);
                html = html.replace(
                    scriptTag,
                    `<script type="text/javascript" src="${filepath}"></script>
                `
                );
                console.log('scriptTag: original', scriptTag);
                // console.log('scriptTag: replaced', `<script>${inlineScript}</script>`);
            } else {
                console.error('scriptTag: no match', scriptTag);
            }
        }
    }

    return html;
}

async function fetchAndInlineContent(url: string): Promise<string> {
    const filename = url.substring(url.lastIndexOf('/') + 1);
    const projectRoot = process.cwd();
    const filepath = path.join(projectRoot, 'public', filename);
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    fs.writeFileSync(filepath, response.data);
    console.log(`Content fetched from ${url} and saved to ${filepath}`);
    return `/${filename}`;
}

// Keep in memory for possible re-use between innovations
let browser: Browser | null = null;

export async function renderPng(markdown: string): Promise<Buffer> {
    console.time('renderPng');
    const html = await renderHtml(markdown);
    console.timeLog('renderPng', 'html rendered');

    // Set this variable as required - @sparticuz/chromium does not work on ARM, so we use a standard Chrome executable locally - see issue https://github.com/Sparticuz/chromium/issues/186

    const isLocal = process.env.VERCEL !== '1';
    console.log('isLocal', isLocal);
    console.log('renderPng', browser?.connected);

    if (!browser?.connected) {
        console.timeLog('renderPng', 'await puppeteer.launch');

        // If you don't need webGL, this skips the extraction of the bin/swiftshader.tar.br file, improving performance
        chromium.setGraphicsMode = false;
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
        console.timeLog('renderPng', 'launching browser');

        browser = await puppeteer.launch(options);
        puppeteer.connect({ browserWSEndpoint: browser.wsEndpoint() });

        console.timeLog('renderPng', 'browser launched');
    }

    console.timeLog('renderPng', 'await browser.newPage');
    const page = await browser.newPage();
    console.timeLog('renderPng', 'page created');

    await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 2 });
    console.timeLog('renderPng', 'viewport set');
    await page.goto('file:///Users/lucas/dev/workspace/ff/m3/public/sample.html');
    // await page.setContent(html);
    console.log('renderPng: page.url', page.url());
    console.timeLog('renderPng', 'content set');

    console.timeLog('renderPng', 'await page.screenshot');
    const screenshot = await page.screenshot({ fullPage: true });
    console.timeLog('renderPng', 'screenshot taken');
    // We don't want headless Chrome instances left running locally
    if (isLocal) {
        // await browser.close();
        // console.timeLog('renderPng', 'browser closed');
    }

    console.timeEnd('renderPng');
    return screenshot;
}
