import { fillTemplate } from 'markmap-render';
import { Transformer } from 'markmap-lib';
import puppeteer, { Browser, Page } from 'puppeteer';
import chromium from '@sparticuz/chromium';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

const transformer = new Transformer();
// Keep in memory for possible re-use between innovations
let browser: Browser | null = null;
const isLocal = process.env.VERCEL !== '1';

export async function renderHtml(markdown: string) {
    const projectRoot = process.cwd();
    console.log('Project Root:', projectRoot);

    const { root, features } = transformer.transform(markdown);
    const assets = transformer.getUsedAssets(features);
    //   const assets = transformer.getAssets();
    const html = fillTemplate(root, assets);
    return html;
}

export async function renderPng(markdown: string): Promise<Buffer> {
    const html = await renderHtml(markdown);
    const chromeArgs = [
        ...chromium.args,
        // @sparticuz/chromium has default chromeArgs to improve serverless performance, but you can add others as you deem appropriate
        '--font-render-hinting=none', // Improves font-rendering quality and spacing
    ];

    // Set this variable as required - @sparticuz/chromium does not work on ARM, so we use a standard Chrome executable locally - see issue https://github.com/Sparticuz/chromium/issues/186
    const isLocal = process.env.RENDER_LOCAL_CHROMIUM;

    console.log('renderPng isLocal:', isLocal);

    console.log('renderPng chrome path:', await chromium.executablePath());
    console.log('renderPng puppeteer path:', await puppeteer.executablePath());

    if (!browser?.connected) {
        // If you don't need webGL, this skips the extraction of the bin/swiftshader.tar.br file, improving performance
        chromium.setGraphicsMode = false;
        browser = await puppeteer.launch({
            ...(isLocal
                ? { channel: 'chrome', headless: false, executablePath: await puppeteer.executablePath() }
                : {
                      args: chromeArgs,
                      executablePath: await chromium.executablePath(),
                      headless: chromium.headless,
                      ignoreHTTPSErrors: true,
                  }),
        });
    }

    const page = await browser.newPage();

    await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 2 });
    // wait until all assets are loaded, or the generated image will be incomplete
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // await new Promise((resolve) => setTimeout(resolve, 10000));

    const screenshot = await page.screenshot({ fullPage: true });
    // We don't want headless Chrome instances left running locally
    if (isLocal) {
        await browser.close();
    }

    const localHtmlFilePath = path.join(process.cwd(), 'public', 'assets', `${Date.now()}.html`);
    fs.writeFileSync(localHtmlFilePath, html);
    console.log(`HTML saved locally at ${localHtmlFilePath}`);
    return screenshot;
}

export async function renderPng2(markdown: string): Promise<Buffer> {
    // TODO: cache the rendered png file.
    console.time('renderPng');
    let html = await renderHtml(markdown);

    function cacheHtml() {
        const timestamp = Date.now();
        const filename = `${timestamp}.html`;
        // NOTE: This is a temporary solution, and should be replaced with a proper cache mechanism
        // Vercel /public is read-only, so we write to /tmp

        const filepath = path.join('/tmp', filename);
        fs.writeFileSync(filepath, html);
        return filepath;
    }
    console.timeLog('renderPng', 'html rendered');

    html = await localizeAssets(html);
    //   if (isLocal) {
    const cacheHtmlPath = cacheHtml();
    console.log(`HTML content written to ${cacheHtmlPath}`);
    //   }
    console.log('renderPng', browser?.connected);

    // if (!browser?.connected) {
    console.timeLog('renderPng', 'await puppeteer.launch');

    // If you don't need webGL, this skips the extraction of the bin/swiftshader.tar.br file, improving performance
    chromium.setGraphicsMode = false;
    const chromePath = await chromium.executablePath();
    const options = isLocal
        ? {}
        : {
              args: [
                  ...chromium.args,
                  // @sparticuz/chromium has default chromeArgs to improve serverless performance, but you can add others as you deem appropriate
                  // '--font-render-hinting=none', // Improves font-rendering quality and spacing
              ],
              executablePath: chromePath,
              headless: chromium.headless,
              ignoreHTTPSErrors: true,
          };
    console.timeLog('renderPng', 'launching browser');

    browser = await puppeteer.launch(options);
    // puppeteer.connect({ browserWSEndpoint: browser.wsEndpoint() });

    console.timeLog('renderPng', 'browser launched');
    // }

    console.timeLog('renderPng', 'await browser.newPage');
    for (const page of await browser.pages()) {
        await page.close();
    }
    // await browser.close();
    const page = await browser.newPage();
    console.timeLog('renderPng', 'page created isLocal=', isLocal);

    // if (isLocal) {
    //   debugPuppeter(page);
    // }

    console.timeLog('renderPng', 'page created');

    await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 2 });
    console.timeLog('renderPng', 'viewport set');

    await page.goto(`file://${cacheHtmlPath}`);
    // raw content will fail to load assets
    //   await page.setContent(html);
    console.log('renderPng: page.url', page.url());
    console.timeLog('renderPng', 'content set');

    console.timeLog('renderPng', 'await page.screenshot');
    const screenshot = await page.screenshot({ fullPage: true });
    console.timeLog('renderPng', 'screenshot taken');
    // We don't want headless Chrome instances left running locally
    if (isLocal) {
        const filename = `${path.parse(cacheHtmlPath).name}.png`;
        const filepath = path.join('/tmp', filename);
        fs.writeFileSync(filepath, screenshot);
        console.log(`PNG content written to ${filepath}`);
    }

    console.timeEnd('renderPng');

    return screenshot;
}

function debugPuppeter(page: Page) {
    page.on('console', (message) =>
        console.error('puppeter', `${message.type().substr(0, 3).toUpperCase()} ${message.text()}`)
    )
        .on('pageerror', ({ message }) => console.error('puppeter', message))
        .on('request', (request) => {
            console.error('puppeter', request.url());
        })
        .on('response', (response) => console.error('puppeter', `${response.status()} ${response.url()}`))
        .on('requestfailed', (request) =>
            console.error('puppeter', `${request?.failure()?.errorText} ${request.url()}`)
        );
}

async function localizeAssets(html: string) {
    const styleLinks = html.match(/<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi);
    if (styleLinks) {
        for (const styleLink of styleLinks) {
            const styleHrefMatch = styleLink.match(/href=["'](.*?)["']/i);
            if (styleHrefMatch) {
                const styleHref = styleHrefMatch[1];
                const filepath = await localizeUrl(styleHref);
                html = html.replace(styleLink, `<link rel="stylesheet" href="${filepath}">`);
                console.log(`styleLink: original ${styleLink}, replaced: ${filepath}`);
            }
        }
    }

    const scriptTags = html.match(/<script\b[^>]*src=["'](.*?)["'][^>]*>([\s\S]*?)<\/script>/gi);
    if (scriptTags) {
        for (const scriptTag of scriptTags) {
            const scriptContentMatch = scriptTag.match(/src=["'](.*?)["']/i);
            if (scriptContentMatch) {
                const scriptUrl = scriptContentMatch[1];
                const filepath = await localizeUrl(scriptUrl);
                html = html.replace(
                    scriptTag,
                    `<script type="text/javascript" src="${filepath}"></script>
                  `
                );
                console.log(`scriptTag: original ${scriptUrl}, replaced: ${filepath}`);
            }
        }
    }

    return html;
}

async function localizeUrl(url: string): Promise<string> {
    const sanitizedFilename = url.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const projectRoot = process.cwd();
    const filepath = path.join(projectRoot, 'public', 'assets', sanitizedFilename);
    if (!fs.existsSync(filepath) && isLocal) {
        const response = await axios.get(url);
        fs.writeFileSync(filepath, response.data);
        console.log(`Content fetched from ${url} and saved to ${filepath}`);
    } else {
        console.log(`File ${filepath} already exists. Skipping download.`);
    }
    return `${filepath}`;
}
