'use client';
import { Button } from '@nextui-org/button';
import { Image } from '@nextui-org/image';
import { Link } from '@nextui-org/link';
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle,
} from '@nextui-org/navbar';
import { FaGithub, FaMedium } from "react-icons/fa6";
import { RiOpenaiFill } from 'react-icons/ri';
import { TfiArrowTopRight } from "react-icons/tfi";
import ThemeSwitcher from './ThemeSwitcher';

export default function NavBar() {
    const menuItems = [
        { label: 'Home', link: '/' },
        { label: 'Mind', link: '/mind' },
        { label: 'Docs', link: '/docs' },
        {
            label: 'Blog',
            link: 'https://medium.com/@xianminx/revolutionizing-reading-how-s15n-harnesses-schema-theory-for-smarter-comprehension-dfa4e20f6f59',
        },
        { label: 'GPT', link: 'https://chatgpt.com/g/g-6jmUwdhcA-s15n' },
        { label: 'GitHub', link: 'https://github.com/xianminx/m3' },
    ];

    return (
        <Navbar isBlurred maxWidth="xl" >
            <NavbarContent className="sm:hidden" justify="start">
                <NavbarMenuToggle />
            </NavbarContent>

            <NavbarContent className="sm:hidden pr-3" justify="center">
                <Link href="/" className="flex items-center">
                    <NavbarBrand>
                        <Image
                            src="/logo/s15n.png"
                            alt="Logo"
                            className="h-6 w-6"
                        />
                        <span className="font-light tracking-tighter ml-3 text-inherit text-lg">
                            Structuralization
                        </span>
                    </NavbarBrand>
                </Link>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-5" justify="center">
                <NavbarBrand>
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/logo/s15n.png"
                            alt="Logo"
                            className="h-6 w-6"
                        />
                        <span className="font-light tracking-tighter text-2xl ml-3 flex gap-3 justify-center items-center">
                            Structuralization
                        </span>
                    </Link>
                </NavbarBrand>
                <NavbarItem>
                    <Button as={Link} variant="light" href="/mind">
                        Mind
                    </Button>
                </NavbarItem>
                <NavbarItem  >
                    <Button isDisabled as={Link} variant="light" >
                        Docs
                        <TfiArrowTopRight className='w-4 h-4 mt-1' />
                    </Button>
                </NavbarItem>

                <NavbarItem>
                    <Button
                        as={Link}
                        variant="light"
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://medium.com/@xianminx/revolutionizing-reading-how-s15n-harnesses-schema-theory-for-smarter-comprehension-dfa4e20f6f59"
                    >
                        <FaMedium className='w-5 h-5 -mr-1'/>
                        Blog
                        <TfiArrowTopRight className='w-4 h-4 mt-1' />

                    </Button>
                </NavbarItem>

                <NavbarItem>
                    <Button
                        as={Link}
                        variant="light"
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://chatgpt.com/g/g-6jmUwdhcA-s15n"
                    >
                        <RiOpenaiFill className='w-5 h-5 -mr-1'/>
                        GPT
                        <TfiArrowTopRight className='w-4 h-4 mt-1' />

                    </Button>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem>
                    <a href="https://github.com/xianminx/m3" target="_blank">
                        <Button isIconOnly variant="light">
                            <FaGithub size={24}  />
                        </Button>
                    </a>
                </NavbarItem>
                <NavbarItem>
                    <ThemeSwitcher />
                </NavbarItem>
            </NavbarContent>
            <NavbarMenu>
                {menuItems.map((item, index) => (
                    <NavbarMenuItem key={`${item.label}-${index}`} isActive>
                        <Link
                            className="w-full"
                            href={`${item.link}`}
                            size="lg"
                            color="foreground"
                        >
                            {item.label}
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Navbar>
    );
}
