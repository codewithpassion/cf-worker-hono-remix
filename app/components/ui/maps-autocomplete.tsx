import { useRef, useEffect, useState, useCallback, FormEvent } from 'react';
import { APIProvider, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { Input } from './input';
import { ClientOnly } from 'remix-utils/client-only';
import { AutoComplete } from './autocomplete';
import { MapPoint } from 'packages/database/db/schema';

export type PlaceResult = {
    address: string;
    location: MapPoint;
}

interface Props {
    onPlaceSelect: (place: PlaceResult | null) => void;
    address: string | undefined | null;
}

export const Search = ({ address, onPlaceSelect }: Props) => {
    const places = useMapsLibrary('places');
    const [placeAutocomplete, setPlaceAutocomplete] =
        useState<google.maps.places.AutocompleteService | null>(null);

    const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);

    useEffect(() => {
        if (!places) return;

        setPlaceAutocomplete(new places.AutocompleteService());

        return () => setPlaceAutocomplete(null);
    }, [places]);

    const [searchValue, setSearchValue] = useState(address);
    const [selectedValue, setSelectedValue] = useState<string | null>(null);

    const onSearchValueChange = (value: string) => {
        console.log("Search value changed", value, placeAutocomplete);
        setSearchValue(value);
        if (!placeAutocomplete) return;

        placeAutocomplete.getPlacePredictions({
            input: value,
            types: ['address'],
        }, (predictions, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
                setPredictions(predictions);

            }
        });

    };

    const getPlaceDetails = (placeId: string) => {
        // You need a map or div element to create the PlacesService
        const map = new google.maps.Map(document.createElement('div'));
        const placesService = new google.maps.places.PlacesService(map);

        return new Promise<PlaceResult>((resolve, reject) => {
            placesService.getDetails({
                placeId: placeId,
                fields: ['geometry', 'formatted_address']
            }, (place, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    const res: PlaceResult = {
                        address: place?.formatted_address || "",
                        location: {
                            lat: place?.geometry?.location?.lat() || 0,
                            lng: place?.geometry?.location?.lng() || 0
                        }
                    }
                    resolve(res);
                } else {
                    reject(new Error(`Place details failed: ${status}`));
                }
            });
        });
    };

    function onSelectedValueChanged(value: string): void {
        const prediction = predictions.find(p => p.place_id === value);
        setSelectedValue(value);

        if (prediction) {
            getPlaceDetails(value).then((place) => {
                onPlaceSelect(place);
            });
        }
    }

    return <AutoComplete
        id="address-search"
        searchValue={searchValue || ""}
        selectedValue={selectedValue || ""}
        onSearchValueChange={onSearchValueChange}
        onSelectedValueChange={onSelectedValueChanged}
        items={predictions.map(p => ({ label: p.description, value: p.place_id }))}
    />
}

export const MapsAutocomplete = ({ address, onPlaceSelect }: Props & { address: string | undefined | null }) => {
    return <>
        <ClientOnly>
            {() => (
                <Search address={address!} onPlaceSelect={onPlaceSelect} />
            )}</ClientOnly>
    </>
}