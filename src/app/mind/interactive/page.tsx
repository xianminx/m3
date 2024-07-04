"use client";
import React, { Key, useEffect, useState } from "react";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import MarkdownPreivew from "@uiw/react-markdown-preview";
import Mindmap from "../../../components/Mindmap";
import { toast } from "react-toastify";
import { Editor } from "@monaco-editor/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function App() {
    const [content, setContent] = useState("");
    const searchParams = useSearchParams();
    const defaultContent = searchParams.get("content") || "";
    const router = useRouter();
    const initialTab = searchParams.get("tab") || "markdown";

    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        // Update the URL query parameter when the active tab changes
        const queryParams = new URLSearchParams(window.location.search);
        queryParams.set("tab", activeTab);
        router.push(`?${queryParams.toString()}`);
    }, [activeTab, router]);

    useEffect(() => {
        if (defaultContent) {
            setContent(defaultContent);
        } else {
            fetch("/sample.md")
                .then((response) => response.text())
                .then((data) => setContent(data))
                .catch((error) => toast("Error fetching the markdown file:", error));
        }
    }, [defaultContent]);

    function handleEditorChange(value: any, event: any) {
        setContent(value);
    }

    function handleTabChange(key: Key) {
        setActiveTab(String(key));
    }

    return (
        <div id='page' className="flex w-full flex-col min-h-full">
            <Tabs
                key="default"
                color="primary"
                aria-label="Tabs colors"
                radius="full"
                selectedKey={activeTab}
                onSelectionChange={handleTabChange}
            >
                <Tab key="markdown" title="Markdown">
                    <Card className="flex-grow">
                        <CardBody>
                            <Editor
                                height="90vh"
                                defaultLanguage="markdown"
                                defaultValue={content}
                                onChange={handleEditorChange}
                            />
                        </CardBody>
                    </Card>
                </Tab>
                <Tab key="preview" title="Preview">
                    <Card className="flex-grow">
                        <CardBody className="h-full">
                            <MarkdownPreivew source={content} style={{ padding: 16 }} />
                        </CardBody>
                    </Card>
                </Tab>
                <Tab key="mindmap" title="Mindmap">
                        <Mindmap content={content} />
                </Tab>
            </Tabs>
        </div>
    );
}
