import { Map as GMap, Marker } from '@vis.gl/react-google-maps';
import { MapPoint } from 'packages/database/db/schema';
import { ClientOnly } from 'remix-utils/client-only';
import { Skeleton } from './skeleton';

export function Map({ point, mapId }: { point?: MapPoint, mapId?: string }) {
    return (
        <ClientOnly fallback={<Skeleton className='w-full h-full' />}>
            {() => (
                <GMap
                    id={mapId}
                    className='w-full h-full'
                    defaultCenter={point || { lat: 42, lng: 0 }}
                    center={point}
                    defaultZoom={12}
                    gestureHandling={'greedy'}
                    disableDefaultUI={true}
                >
                    {point && (
                        <Marker position={point} />
                    )}
                </GMap>
            )}
        </ClientOnly>
    );
}
