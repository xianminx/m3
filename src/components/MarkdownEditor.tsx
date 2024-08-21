import { Editor } from '@monaco-editor/react';
import { Tooltip } from '@nextui-org/react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { useEffect, useState } from 'react';
import { PiCode, PiMarkdownLogo } from 'react-icons/pi';
import GistLoader from './GistLoader';

interface MarkdownEditorProps {
    className?: string;
    theme?: string;
    content: string;
    onChange: (value: string | undefined) => void;
}

export default function MarkdownEditor({ className, theme, content, onChange }: MarkdownEditorProps) {
    const iconClasses = 'text-xl pointer-events-none flex-shrink-0 color-neutral-500 dark:color-neutral-300';

    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        //  for MarkdownPreview
        document.documentElement.setAttribute('data-color-mode', theme || 'light');
    }, [theme]);

    const switchMode = () => {
        // toggle between editor and preview
        setShowPreview((prevShowPreview) => !prevShowPreview);
    };

    return (
        <div className={`relative ${className}`}>
            <div className="absolute top-2 right-2 z-20 flex gap-2">
                <GistLoader onMarkdownContent={(val) => onChange(val)} />
                <Tooltip content={showPreview ? 'Edit' : 'Preview'} placement="bottom">
                    <div onClick={switchMode}>
                        {showPreview ? <PiCode className={iconClasses} /> : <PiMarkdownLogo className={iconClasses} />}
                    </div>
                </Tooltip>
            </div>
            {showPreview ? (
                <MarkdownPreview source={content} style={{ padding: 32 }} />
            ) : (
                <Editor
                    height="90vh"
                    defaultLanguage="markdown"
                    theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
                    value={content}
                    onChange={onChange}
                    options={{ minimap: { enabled: false } }}
                />
            )}
        </div>
    );
}
