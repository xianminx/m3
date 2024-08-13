'use client';
import CollapsibleIconMenu from '@/components/CollapsibleIconMenu';
import Mindmap from '@/components/Mindmap';

import { useSearchParamsHandler } from '@/hooks/useSearchParamsHandler';
import { Editor, OnChange } from '@monaco-editor/react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';

export default function PageContent() {
    const { content, mode, setContent, setMode } = useSearchParamsHandler();
    const { theme } = useTheme();

    useEffect(() => {
        //  for MarkdownPreview
        document.documentElement.setAttribute(
            'data-color-mode',
            theme || 'light'
        );
    }, [theme]);
    const handleEditorChange: OnChange = (value) => {
        if (value !== undefined) {
            setContent(value);
        }
    };

    return (
        <div className="relative flex flex-col w-full h-full">
            <div className="absolute top-0 left-0 w-auto mr-4 ml-2 py-2 z-20">
                <CollapsibleIconMenu
                    initMode="mindmap"
                    onModeChange={(mode: string) => setMode(mode)}
                />
            </div>
            <div className="flex-grow">
                {mode === 'editor' && (
                    <div className="flex-grow">
                        <Editor
                            height="90vh"
                            defaultLanguage="markdown"
                            theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
                            value={content}
                            onChange={handleEditorChange}
                        />
                    </div>
                )}
                {mode === 'preview' && (
                    <MarkdownPreview source={content} style={{ padding: 32 }} />
                )}
                {mode === 'mindmap' && <Mindmap content={content} />}
            </div>
        </div>
    );
}
