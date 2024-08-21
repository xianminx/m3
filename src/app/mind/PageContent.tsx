'use client';
import CollapsibleIconMenu from '@/components/CollapsibleIconMenu';
import Resizer from '@/components/Resizer';
import GistLoader from '@/components/GistLoader';
import Mindmap from '@/components/Mindmap';

import { useSearchParamsHandler } from '@/hooks/useSearchParamsHandler';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { VscSplitHorizontal } from 'react-icons/vsc';
import MarkdownEditor from '@/components/MarkdownEditor';
import Split from '@uiw/react-split';

export default function PageContent() {
    const { content, mode, setContent, setMode } = useSearchParamsHandler();
    const { theme } = useTheme();

    const [previewWidth, setPreviewWidth] = useState('50%');

    const handleResize = (newWidth: number) => {
        setPreviewWidth(`${newWidth}px`);
    };

    useEffect(() => {
        //  for MarkdownPreview
        document.documentElement.setAttribute('data-color-mode', theme || 'light');
    }, [theme]);
    const handleEditorChange: OnChange = (value) => {
        if (value !== undefined) {
            setContent(value);
        }
    };

    return (
        <div className="relative flex flex-col w-full h-full flex-grow">
            <div className="flex flex-col flex-grow h-full ">
                <Split style={{ border: '1px solid #d5d5d5', borderRadius: 3 }}>
                    <div style={{ width: '50%' }}>
                        <MarkdownEditor theme={theme} content={content} onChange={handleEditorChange} />
                    </div>
                    <div style={{ width: '50%' }}>
                        <Mindmap content={content} className={`p-2 ${theme === 'dark' ? 'markmap-dark' : 'markmap'}`} />
                    </div>
                </Split>
            </div>
        </div>
    );
}
