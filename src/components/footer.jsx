import { Button } from '@nextui-org/button';
export default function Footer() {
    return (
        <footer className="pt-24">
            <div className="max-w-screen-xl mx-auto px-4 md:px-8">
                <div className="flex items-center py-10 justify-center">
                    <img src="/s15n.svg" alt="Logo" className="h-10 w-10" />
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
