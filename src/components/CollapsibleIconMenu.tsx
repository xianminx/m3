import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from '@nextui-org/react';
import { useState } from 'react';
import { FaMarkdown } from 'react-icons/fa';
import { RiMindMap } from 'react-icons/ri';
import { VscPreview } from 'react-icons/vsc';

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
                    <div className="px-4 flex items-center justify-end gap-2 transition-all duration-300 ease-in-out">
                        <div
                            className={`transform transition-all duration-300 ease-in-out flex items-center scale-1 hover:scale-150
                                text-neutral-500 hover:text-primary`}
                        >
                            {mode.icon}
                        </div>
                    </div>
                </DropdownTrigger>
                <div
                    className="absolute top-full left-0"
                    onMouseEnter={() => setIsHovered(true)} 
                    onMouseLeave={() => setIsHovered(false)} 
                >
                    <DropdownMenu
                        variant="faded"
                        aria-label="Mode"
                        onAction={(key) => selectMode(key as string)}
                        items={MODES}
                        className={`transition-all duration-1000 ease-in-out transform `}
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
