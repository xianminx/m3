import { Button } from '@nextui-org/button';
import { Image } from '@nextui-org/react';
export default function Footer() {
    return (
        <footer className="pt-24">
            <div className="max-w-screen-xl mx-auto px-4 md:px-8 mb-10 items-center justify-center">
                <div className="flex flex-col md:flex-row items-center py-10 justify-between">
                    <div className="flex items-center ml-24">
                        <Image
                            src="/logo/s15n.png"
                            alt="Logo"
                            className="h-5 w-5 mx-2"
                        />
                        <div>© 2024 s15n. All rights reserved. </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-center items-center">
                        <a href="/terms" target="_blank">
                            <Button variant="light">Terms</Button>
                        </a>
                        <a href="/privacy" target="_blank">
                            <Button variant="light">Privacy</Button>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
