'use client';
import { Button } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { MoonIcon, SunIcon } from 'lucide-react';

const moon = <MoonIcon size={24} />;
const sun = <SunIcon size={24} />;

export default function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();
    const [svg, setSvg] = useState(theme === 'light' ? sun : moon);
    // Update svg whenever theme changes
    useEffect(() => {
        setSvg(theme === 'light' ? sun : moon);
    }, [theme]);
    const handleClick = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <Button isIconOnly variant="light" onClick={handleClick}>
            {svg}
        </Button>
    );
}
