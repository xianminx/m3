import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';

export async function GET(req: NextRequest, res: NextResponse) {
    const currentDir = process.cwd();
    const directoryTree = getDirectoryTree(currentDir);
    return NextResponse.json(directoryTree);
}

function getDirectoryTree(dirPath: string): string[] {
    const files = fs.readdirSync(dirPath);
    const tree: string[] = [];

    for (const file of files) {
        const filePath = `${dirPath}/${file}`;
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            const subTree = getDirectoryTree(filePath);
            tree.push(`${file}/`, ...subTree.map((subFile) => `  ${subFile}`));
        } else {
            tree.push(file);
        }
    }

    return tree;
}
