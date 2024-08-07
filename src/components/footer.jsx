import { Button } from '@nextui-org/button';
import { Image } from '@nextui-org/react';
export default function Footer() {
    return (
        <footer className="pt-24">
            <div className="max-w-screen-xl mx-auto px-4 md:px-8">
                <div className="flex items-center py-10 justify-center">
                    <Image src="/logo/s15n.png" alt="Logo" className="h-6 w-6" />
                    <div>© 2024 s15n. All rights reserved. </div>
                    <a href="/terms" target="_blank">
                        <Button variant="light">Terms & policies</Button>
                    </a>
                    <a href="/privacy" target="_blank">
                        <Button variant="light">Privacy policy</Button>
                    </a>
                </div>
            </div>
        </footer>
    );
}
