'use client';
import CollapsibleIconMenu from '@/components/CollapsibleIconMenu';
import Mindmap from '@/components/Mindmap';

import { useSearchParamsHandler } from '@/hooks/useSearchParamsHandler';
import { Editor, OnChange } from '@monaco-editor/react';
import { Card, CardBody } from '@nextui-org/react';
import MarkdownPreview from '@uiw/react-markdown-preview';


export default function PageContent() {
    const { content, mode, setContent, setMode } = useSearchParamsHandler();

    const handleEditorChange: OnChange = (value) => {
        if (value !== undefined) {
            setContent(value);
        }
    };

    return (
        <div className="relative flex flex-col w-full h-full">
            <div className="absolute top-0 left-0 w-auto mr-4 py-4 z-20">
                <CollapsibleIconMenu
                    initMode="mindmap"
                    onModeChange={(mode: string) => setMode(mode)}
                />
            </div>
            <div className="flex-grow bg-green-100">
                {mode === 'editor' && (
                    <Card className="flex-grow">
                        <CardBody>
                            <Editor
                                height="90vh"
                                defaultLanguage="markdown"
                                value={content}
                                onChange={handleEditorChange}
                            />
                        </CardBody>
                    </Card>
                )}
                {mode === 'preview' && (
                    <Card className="flex-grow">
                        <CardBody className="h-full">
                            <MarkdownPreview
                                source={content}
                                style={{ padding: 16 }}
                            />
                        </CardBody>
                    </Card>
                )}
                {mode === 'mindmap' && <Mindmap content={content} />}
            </div>
        </div>
    );
}
