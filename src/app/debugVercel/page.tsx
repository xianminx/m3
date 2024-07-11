import fs from 'fs';
import { DirectoryItem, DirectoryTree } from './TreeNode';


// Modified getDirectoryTree function
function getDirectoryTree(dirPath: string): DirectoryItem[] {
  const files = fs.readdirSync(dirPath);
  const tree: DirectoryItem[] = [];

  for (const file of files) {
    const filePath = `${dirPath}/${file}`;
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      tree.push({
        name: file,
        children: getDirectoryTree(filePath),
      });
    } else {
      tree.push({ name: file });
    }
  }

  return tree;
}




// Page component
export default function Page() {
  const currentDir = process.cwd();
  const directoryTree = getDirectoryTree(currentDir);

  return (
    <div>
      <h1>Directory Tree</h1>
      <DirectoryTree items={directoryTree} />
    </div>
  );
}