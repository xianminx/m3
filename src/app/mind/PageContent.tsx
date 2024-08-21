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
            {/* <div className="absolute top-0 left-0 w-auto mr-4 ml-2 py-2 z-20">
                <CollapsibleIconMenu
                    initMode="mindmap"
                    onModeChange={(mode: string) => setMode(mode)}
                />
            </div> */}
            <div className="flex flex-col flex-grow h-full ">
                <div className="flex divide-x ">
                    <VscSplitHorizontal className="absolute top-0 right-0" />

                    <div className="flex-1 flex-grow" style={{ width: previewWidth }}>
                        {/* <div className="absolute top-16 left-0 w-auto mr-4 ml-2 py-2 z-20">
                            <GistLoader onMarkdownContent={(content) => setContent(content)} />
                        </div> */}
                        <MarkdownEditor
                            theme={theme}
                            content={content}
                            onChange={handleEditorChange}
                        />
                    </div>
                    <Resizer onResize={handleResize} />
                    <div className="flex-1">
                        <Mindmap content={content} className={`p-2 ${theme === 'dark' ? 'markmap-dark' : 'markmap'}`} />
                    </div>
                </div>

                {/* {mode === 'preview' && (
                    <MarkdownPreview source={content} style={{ padding: 32 }} />
                )}
                {mode === 'mindmap' && (
                    <Mindmap
                        content={content}
                        className={`p-2 ${
                            theme === 'dark' ? 'markmap-dark' : 'markmap'
                        }`}
                    />
                )} */}
            </div>
        </div>
    );
}
