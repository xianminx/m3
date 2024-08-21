import { put, PutCommandOptions } from '@vercel/blob';
import path from 'path';
import fs from 'fs';

const ASSET_DIR = path.join(process.cwd(), 'public', 'assets');

const putOptions: PutCommandOptions = { access: 'public', addRandomSuffix: false };

async function saveFile(localFilePath: string, content: Buffer | string): Promise<void> {
    fs.writeFileSync(localFilePath, content);
    console.log(`File saved locally at ${localFilePath}`);
}

async function uploadFile(remotePath: string, content: Buffer | string, options: PutCommandOptions): Promise<string> {
    const { url } = await put(remotePath, content, options);
    return url;
}

export function cachePngPath(md5: string) {
    // Note: DO NOT use '/' in the path.
    return `m3/render/png/${md5}.png`;
}

export async function savePng(md5: string, screenshot: Buffer): Promise<string> {
    const localFilePath = path.join(ASSET_DIR, `${md5}.png`);
    await saveFile(localFilePath, screenshot);
    return await uploadFile(cachePngPath(md5), screenshot, putOptions);
}

export async function saveMd(md5: string, markdown: string): Promise<string> {
    const localFilePath = path.join(ASSET_DIR, `${md5}.md`);
    await saveFile(localFilePath, markdown);
    return await uploadFile(`/m3/render/md/${md5}.md`, markdown, putOptions);
}
