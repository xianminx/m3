import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    Checkbox,
    Link,
    Button,
    useDisclosure,
    Progress,
} from '@nextui-org/react';
import { on } from 'events';
import { useState } from 'react';
import { FaMarkdown } from 'react-icons/fa';
import { RiMindMap } from 'react-icons/ri';
import { VscGist, VscPreview } from 'react-icons/vsc';
import { FaLink } from 'react-icons/fa6';

interface GistLoaderProps {
    onMarkdownContent: (content: string) => void;
}

const GistLoader = (props: GistLoaderProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const iconClasses = 'text-xl pointer-events-none flex-shrink-0';
    const [url, setUrl] = useState('');

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [loading, setLoading] = useState(false);

    const loadContent = () => {
        setLoading(true); // Show loading state

        // setTimeout(() => {

        fetch(url)
            .then((response) => response.text())
            .then((text) => {
                props.onMarkdownContent(text);
                setLoading(false); // Close loading state
                onClose();
            })
            .catch((error) => {
                console.error('Error loading content:', error);
                setLoading(false); // Handle error and close loading state
                onClose();
            });
        // }, 5000);
    };

    return (
        <div className="relative inline-block" onClick={onOpen}>
            <div className=" flex items-center justify-end gap-2 transition-all duration-300 ease-in-out">
                <div
                    className={`transform transition-all duration-300 ease-in-out flex items-center scale-1 hover:scale-150
                                text-neutral-500 hover:text-primary  hover:translate-x-10  bg-white dark:bg-black gap-2 hover:px-4`}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <FaLink className={iconClasses} />
                    {isHovered && 'Load markdown from url'}
                </div>
            </div>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="top-center"
                isDismissable={true}
                hideCloseButton={true}
                onClose={onClose}
            >
                <ModalContent>
                    {/* {(onClose) => ( */}
                    <>
                        <ModalBody>
                            <div className="flex items-center justify-between gap-2">
                                <Input
                                    autoFocus
                                    placeholder="https://gist.githubusercontent.com/xianminx/4f3f3b8e9433aa5191682025caf7a51b/raw/b25ded6d8f82ccdc54982252f8908938d319e3b6/Schema%2520Theory%2520in%2520Reading.md"
                                    variant="bordered"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                />
                                <Button color="primary" onPress={loadContent}>
                                    Load
                                </Button>
                            </div>
                            {loading && (
                                <Progress
                                    size="sm"
                                    isIndeterminate
                                    aria-label="Loading..."
                                    className="max-w-md"
                                />
                            )}
                        </ModalBody>
                    </>
                    {/* )} */}
                </ModalContent>
            </Modal>
        </div>
    );
};

export default GistLoader;
