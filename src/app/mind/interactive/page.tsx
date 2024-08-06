'use client';

import React, { useEffect, useState, Suspense, Key } from 'react';
import { Tabs, Tab, Card, CardBody } from '@nextui-org/react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import Mindmap from '../../../components/Mindmap';
import { toast } from 'react-toastify';
import { Editor, OnChange } from '@monaco-editor/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { decode, encode } from '@/utils/encoder';
interface PageContentProps {
    content: string;
    activeTab: string;
    setContent: (value: string) => void;
    setActiveTab: (value: string) => void;
}
const PageContent = ({ content, activeTab, setContent, setActiveTab }: PageContentProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleEditorChange: OnChange = (value) => {
        if (value !== undefined) {
            setContent(value);
            const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
            currentParams.set('hash', encode(value));
            console.log('currentParams', currentParams.toString());
            router.replace(`${pathname}?${currentParams.toString()}`);
        }
    };

    const handleTabChange = (key: Key) => {
        const tab = key as string;
        const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
        currentParams.set('tab', tab);
        router.replace(`${pathname}?${currentParams.toString()}`);
        setActiveTab(tab);
    };

    return (
        <div id="page" className="flex w-full flex-col min-h-full">
            <Tabs
                key="default"
                color="primary"
                aria-label="Options"
                // radius="full"
                size='sm'
                placement="top"
                selectedKey={activeTab}
                onSelectionChange={handleTabChange}
            >
                <Tab key="markdown" title="Markdown">
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
                </Tab>
                <Tab key="preview" title="Preview">
                    <Card className="flex-grow">
                        <CardBody className="h-full">
                            <MarkdownPreview source={content} style={{ padding: 16 }} />
                        </CardBody>
                    </Card>
                </Tab>
                <Tab key="mindmap" title="Mindmap">
                    <Mindmap content={content} />
                </Tab>
            </Tabs>
        </div>
    );
};

interface SearchParamsHandlerProps {
    setContent: (value: string) => void;
    setActiveTab: (value: string) => void;
}
const SearchParamsHandler = ({ setContent, setActiveTab }: SearchParamsHandlerProps) => {
    const searchParams = useSearchParams();
    useEffect(() => {
        const hash = searchParams.get('hash');
        const gist = searchParams.get('gist');
        if (hash) {
            setContent(decode(hash));
        } else if (gist) {
            fetch(`${gist}`)
                .then((response) => response.text())
                .then((data) => {
                    setContent(data);
                    console.log('data', data);
                  })
                .catch((error) => toast('Error fetching the gist:', error));
        }

        const tabParam = searchParams.get('tab') || 'markdown';
        setActiveTab(tabParam);
    }, [searchParams, setContent, setActiveTab]);

    return null;
};

export default function Page() {
    const [content, setContent] = useState('');
    const [activeTab, setActiveTab] = useState('markdown');

    useEffect(() => {
        if (!content) {
            fetch('/sample.md')
                .then((response) => response.text())
                .then((data) => {
                    if (!content) {
                        setContent(data);
                    }
                })
                .catch((error) =>
                    toast('Error fetching the markdown file:', error)
                );
        }
    }, [content]);

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchParamsHandler setContent={setContent} setActiveTab={setActiveTab} />
            <PageContent content={content} activeTab={activeTab} setContent={setContent} setActiveTab={setActiveTab} />
        </Suspense>
    );
}
