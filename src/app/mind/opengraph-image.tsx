import { ImageResponse } from '@vercel/og';


export default async function GET() {
    return new ImageResponse(
        (
            <div
                style={{
                    display: 'flex',
                    fontSize: 40,
                    color: 'black',
                    background: 'white',
                    width: '100%',
                    height: '100%',
                    textAlign: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    );
}
