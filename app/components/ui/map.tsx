import { APIProvider, Map as GMap } from '@vis.gl/react-google-maps';
import { MapPoint } from 'packages/database/db/schema';
import { ClientOnly } from 'remix-utils/client-only';
import { Skeleton } from './skeleton';

export function Map({ apiKey, point }: { apiKey: string, point?: MapPoint }) {
    return (
        <ClientOnly fallback={<Skeleton className='w-full h-[20vh]' />}>
            {() => (
                <APIProvider apiKey={apiKey}>
                    <GMap
                        className='w-full h-[20vh]'
                        defaultCenter={point}
                        defaultZoom={3}
                        gestureHandling={'greedy'}
                        disableDefaultUI={true}
                    />
                </APIProvider>
            )}
        </ClientOnly>
    );
}   