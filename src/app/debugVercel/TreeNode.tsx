'use client';
import { useState } from "react";
// Define a type for our directory tree structure
export interface DirectoryItem {
  name: string;
  children?: DirectoryItem[];
}

 
export interface DirectoryItemComponentProps {
  item: DirectoryItem; // Assuming DirectoryItem is defined elsewhere
  depth: number; // Add depth prop
}

export const DirectoryItemComponent: React.FC<DirectoryItemComponentProps> = ({ item, depth }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const paddingLeft = depth * 20;

  return (
    <div>
      <div style={{ paddingLeft: `${paddingLeft}px`, cursor: 'pointer' }} onClick={toggleExpand}>
        {item.children && item.children.length > 0 ? (isExpanded ? '-' : '+') : ' '}
        {item.name}
      </div>
      {isExpanded && item.children && (
        <div>
          {item.children.map((child, index) => (
            <DirectoryItemComponent key={index} item={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};
// Recursive component to render the directory tree
export const DirectoryTree = ({ items }: { items: DirectoryItem[] }) => {
  return (
    <ul>
      {items.map((item) => (
        <DirectoryItemComponent key={item.name} item={item} depth={0} />
      ))}
    </ul>
  );
};