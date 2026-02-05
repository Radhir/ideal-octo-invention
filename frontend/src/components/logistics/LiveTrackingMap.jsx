import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Driver Icon
const driverIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const RecenterMap = ({ coords }) => {
    const map = useMap();
    useEffect(() => {
        if (coords) {
            map.setView(coords, map.getZoom());
        }
    }, [coords, map]);
    return null;
};

const LiveTrackingMap = ({ driverCoords, pickupCoords, dropoffCoords, driverName }) => {
    // Default to Dubai center if no coords
    const defaultCenter = [25.2048, 55.2708];
    const center = driverCoords || pickupCoords || defaultCenter;

    return (
        <MapContainer
            center={center}
            zoom={13}
            style={{ height: '100%', width: '100%', borderRadius: '15px' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {pickupCoords && (
                <Marker position={pickupCoords}>
                    <Popup>Pickup Location</Popup>
                </Marker>
            )}

            {dropoffCoords && (
                <Marker position={dropoffCoords}>
                    <Popup>Drop-off Location</Popup>
                </Marker>
            )}

            {driverCoords && (
                <Marker position={driverCoords} icon={driverIcon}>
                    <Popup>
                        <strong>{driverName}</strong><br />
                        Current Position
                    </Popup>
                </Marker>
            )}

            <RecenterMap coords={driverCoords} />
        </MapContainer>
    );
};

export default LiveTrackingMap;
