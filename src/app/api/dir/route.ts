import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';

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

/**
 * Get the directory tree of the current working directory.
 * @param req
 * @param res
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const currentDir = process.cwd();
  const directoryTree = getDirectoryTree(currentDir);
  const content = directoryTree.join('\n');
  res.status(200).send(content);
}
