'use client';
import CollapsibleIconMenu from '@/components/CollapsibleIconMenu';
import Mindmap from '@/components/Mindmap';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

import { decode, encode } from '@/utils/encoder';
import { Editor, OnChange } from '@monaco-editor/react';
import { Card, CardBody } from '@nextui-org/react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { SearchParamsHandler } from '@/components/SearchParamsHandler';

interface PageContentProps {
    content: string;
    mode: string;
    setContent: (value: string) => void;
    setMode: (value: string) => void;
}
const PageContent = ({
    content,
    mode,
    setContent,
    setMode,
}: PageContentProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    console.log('searchParams', searchParams.toString());
    console.log('content is:  ', content.slice(0, 10));

    useEffect(() => {
        const currentParams = new URLSearchParams(
            Array.from(searchParams.entries())
        );
        if (content !== undefined) {
            currentParams.set('hash', encode(content));
        }
        if (mode !== undefined) {
            currentParams.set('mode', mode);
        }
        router.replace(`${pathname}?${currentParams.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [content, mode]);

    const handleEditorChange: OnChange = (value) => {
        if (value !== undefined) {
            setContent(value);
        }
    };

    return (
        <div className="relative flex flex-col w-full h-full">
            <div className="absolute top-0 right-0 w-auto mx-4 py-4 z-20">
                <CollapsibleIconMenu
                    initMode="mindmap"
                    onModeChange={(mode: string) => setMode(mode)}
                />
            </div>
            <div className="flex-gro bg-green-100">
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
};

export default function Page() {
    const [content, setContent] = useState('');

    const [mode, setMode] = useState('mindmap');
    const searchParams = useSearchParams();
    useEffect(() => {
        const mode = searchParams.get('mode') || 'mindmap';
        setMode(mode);
        const fetchData = async () => {
            const hash = searchParams.get('hash');
            const gist = searchParams.get('gist');
            if (hash) {
                setContent(decode(hash));
            } else if (gist) {
                try {
                    const response = await fetch(`${gist}`);
                    const data = await response.text();
                    setContent(data);
                    console.log('data', data);
                } catch (error) {
                    toast.error(`Error fetching the gist: ${error}`);
                }
            }

            if (!content) {
                try {
                    console.log(
                        'no gist or hash is given, load the sample markdown'
                    );

                    const response = await fetch('/sample.md');
                    const data = await response.text();
                    if (!content) {
                        setContent(data);
                    }
                } catch (error) {
                    toast.error(`rror fetching the markdown file: ${error}`);
                }
            }
        };

        fetchData();
    }, [content, searchParams]);

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchParamsHandler setContent={setContent} setMode={setMode} />
            <PageContent
                content={content}
                mode={mode}
                setContent={setContent}
                setMode={setMode}
            />
        </Suspense>
    );
}
