import { fillTemplate } from "markmap-render";
import { Transformer } from "markmap-lib";
import puppeteer from "puppeteer";

export function renderHtml(markdown: string): string {
    const transformer = new Transformer();
    const { root, features } = transformer.transform(markdown);
    // const assets = transformer.getUsedAssets(features);
    const assets = transformer.getAssets();
    const html = fillTemplate(root, assets);
    return html;
}

export async function renderPng(markdown: string): Promise<Buffer> {
    const html = renderHtml(markdown);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    await page.setContent(html);

    const screenshot = await page.screenshot({ fullPage: true });
    await browser.close();

    return screenshot;
}
