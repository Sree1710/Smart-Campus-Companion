import { useState, useEffect } from "react";
import axios from "axios";
import { Bus, Clock } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon missing in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Fallback center (College Campus)
const defaultCenter = [28.6139, 77.2090]; // New Delhi example (Lat, Lng)

export default function BusTracking() {
    const [buses, setBuses] = useState([]);

    const fetchBusLocations = async () => {
        try {
            const res = await axios.get("http://localhost:5001/api/bus/live");
            setBuses(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchBusLocations();
        // Poll every 10 seconds for real-time updates
        const interval = setInterval(fetchBusLocations, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex h-[calc(100vh-8rem)] flex-col space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded shadow">
                <h1 className="text-xl font-bold flex items-center"><Bus className="mr-2" /> College Bus Tracker (OSM)</h1>
                <span className="text-xs text-gray-500">Live updates every 10s</span>
            </div>

            <div className="flex-1 rounded-lg overflow-hidden shadow-lg border relative z-0">
                <MapContainer center={defaultCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {buses.map((item) => {
                        if (!item.location) return null;
                        return (
                            <Marker
                                key={item.bus._id}
                                position={[item.location.lat, item.location.lng]}
                            >
                                <Popup>
                                    <div className="p-1 min-w-[150px]">
                                        <h3 className="font-bold text-gray-900">Bus {item.bus.busNumber}</h3>
                                        <p className="text-sm">Driver: {item.bus.driverName}</p>
                                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                                            <Clock className="w-3 h-3 mr-1" />
                                            Updated: {new Date(item.location.timestamp).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            </div>
        </div>
    );
}
