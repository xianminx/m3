import { useEffect, useState } from 'react';
import {
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from '@nextui-org/react';
import { FaMarkdown } from 'react-icons/fa';
import { VscPreview } from 'react-icons/vsc';
import { RiMindMap } from 'react-icons/ri';
import React from 'react';

interface CollapsibleIconMenuProps {
    initMode: string;
    onModeChange: (mode: string) => void;
}

const CollapsibleIconMenu = (props: CollapsibleIconMenuProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const iconClasses = 'text-xl pointer-events-none flex-shrink-0';

    const MODES = [
        {
            key: 'editor',
            label: 'Editor',
            icon: <FaMarkdown className={iconClasses} />,
            shortcut: '⌘E',
        },
        {
            key: 'preview',
            label: 'Markdown',
            icon: <VscPreview className={iconClasses} />,
            shortcut: '⌘P',
        },
        {
            key: 'mindmap',
            label: 'Mindmap',
            icon: <RiMindMap className={iconClasses} />,
            shortcut: '⌘M',
        },
    ];
    const { initMode = 'editor', onModeChange } = props;

    const [mode, setMode] = useState(
        MODES.find((m) => m.key === initMode) || MODES[0]
    );
    console.log('mode', mode);
    const selectMode = (key: string) => {
        const selectedMode = MODES.find((m) => m.key === key);
        if (selectedMode) {
            setMode(selectedMode);
            if (onModeChange) {
                onModeChange(selectedMode.key);
            }
        }
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Dropdown isOpen={isHovered}>
                <DropdownTrigger>
                    <div className="px-4 text-primary flex items-center justify-end gap-2 transition-all duration-300 ease-in-out">
                        <div
                            className={`transform transition-all duration-300 ease-in-out flex items-center ${
                                isHovered ? 'translate-x-0' : 'translate-x-full'
                            }`}
                        >
                            {mode.icon}
                            {isHovered && (
                                <div className="ml-2">{mode.label}</div>
                            )}
                        </div>
                    </div>
                </DropdownTrigger>
                <div
                    className="absolute top-full left-0"
                    onMouseEnter={() => setIsHovered(true)} // Keep menu visible
                    onMouseLeave={() => setIsHovered(false)} // Allow it to close when leaving the menu
                >
                    <DropdownMenu
                        variant="faded"
                        aria-label="Mode"
                        onAction={(key) => selectMode(key as string)}
                        items={MODES}
                        className={`transition-all duration-1000 ease-in-out transform ${
                            isHovered
                                ? 'scale-y-100 opacity-100'
                                : 'scale-y-0 opacity-0'
                        } origin-top`}
                    >
                        {(item) => (
                            <DropdownItem
                                key={item.key}
                                shortcut={item.shortcut}
                                startContent={item.icon}
                                className={
                                    item.key === mode.key
                                        ? 'text-primary'
                                        : 'default'
                                }
                            >
                                {item.label}
                            </DropdownItem>
                        )}
                    </DropdownMenu>
                </div>
            </Dropdown>
        </div>
    );
};

export default CollapsibleIconMenu;
