// AddressPicker.jsx (Fixed Version)
import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";

const libraries = ["places"];
const mapContainerStyle = {
  height: "300px",
  width: "100%",
  borderRadius: "12px",
  marginBottom: "1rem",
  boxShadow: "0 4px 24px rgba(59,130,246,0.12)",
  border: "1.5px solid #334155",
  overflow: "hidden",
};
const center = { lat: 25.276987, lng: 55.296249 }; // Dubai

// Simplified dark theme
const darkMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [{ "color": "#242f3e" }]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#746855" }]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#242f3e" }]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{ "color": "#17263c" }]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#515c6d" }]
  }
];

const AddressPicker = ({ label = "Select address on map", onAddressSelect }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
    libraries,
  });

  const [marker, setMarker] = useState(center);
  const [autocomplete, setAutocomplete] = useState(null);
  const [mapType, setMapType] = useState("roadmap");
  const [mapLoadError, setMapLoadError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const mapRef = useRef(null);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    
    // Check if tiles loaded after a short delay
    setTimeout(() => {
      const tiles = document.querySelectorAll('img[src*="googleapis.com/maps/vt"]');
      if (tiles.length === 0) {
        setMapLoadError("Map tiles failed to load. Please check your API key and billing settings.");
      }
    }, 2000);
  }, []);

  const retryLoadMap = () => {
    setIsRetrying(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const onMapClick = useCallback(
    (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setMarker({ lat, lng });

      if (window.google && window.google.maps) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === "OK" && results[0]) {
            onAddressSelect &&
              onAddressSelect({
                formatted_address: results[0].formatted_address,
                lat,
                lng,
                place: results[0],
              });
          } else {
            onAddressSelect &&
              onAddressSelect({
                formatted_address: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
                lat,
                lng,
              });
          }
        });
      } else {
        onAddressSelect &&
          onAddressSelect({
            formatted_address: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
            lat,
            lng,
          });
      }
    },
    [onAddressSelect]
  );

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place && place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setMarker({ lat, lng });
        mapRef.current?.panTo({ lat, lng });
        onAddressSelect &&
          onAddressSelect({
            formatted_address: place.formatted_address,
            lat,
            lng,
            place,
          });
      }
    }
  };

  if (loadError || mapLoadError) {
    return (
      <div style={{ 
        color: "#ef4444", 
        background: "#23262F", 
        padding: 16, 
        borderRadius: 8,
        marginBottom: "1.5rem"
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Error loading maps</div>
        <div>{loadError?.message || mapLoadError}</div>
        <div style={{ marginTop: '12px', fontSize: '0.9rem' }}>
          <b>Troubleshooting tips:</b>
          <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
            <li>Check that your Google Maps API key is valid</li>
            <li>Ensure the Maps JavaScript API is enabled in Google Cloud Console</li>
            <li>Verify billing is set up for your Google Cloud project</li>
            <li>Check that your API key restrictions allow your domain</li>
            <li>Try disabling any ad blockers or privacy extensions</li>
          </ul>
        </div>
        <button 
          onClick={retryLoadMap}
          disabled={isRetrying}
          style={{
            marginTop: '12px',
            padding: '8px 16px',
            background: '#4F8CFF',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {isRetrying ? 'Retrying...' : 'Retry Loading Map'}
        </button>
      </div>
    );
  }

  if (!isLoaded) return (
    <div style={{ 
      color: "#bae6fd", 
      background: "#23262F", 
      padding: "16px", 
      borderRadius: "8px",
      marginBottom: "1.5rem",
      textAlign: "center"
    }}>
      Loading maps...
    </div>
  );

  const MapTypeToggle = () => (
    <div style={{ display: "flex", gap: 8, position: "relative", marginBottom: 8 }}>
      <button
        type="button"
        onClick={() => {
          setMapType("roadmap");
          if (mapRef.current) mapRef.current.setMapTypeId("roadmap");
        }}
        style={{
          background: mapType === "roadmap" ? "#0f1724" : "transparent",
          color: "#bae6fd",
          border: "1px solid #334155",
          padding: "6px 10px",
          borderRadius: 6,
          cursor: "pointer",
          boxShadow: mapType === "roadmap" ? "0 4px 12px rgba(59,130,246,0.08)" : "none",
        }}
      >
        Map
      </button>
      <button
        type="button"
        onClick={() => {
          setMapType("satellite");
          if (mapRef.current) mapRef.current.setMapTypeId("satellite");
        }}
        style={{
          background: mapType === "satellite" ? "#0f1724" : "transparent",
          color: "#bae6fd",
          border: "1px solid #334155",
          padding: "6px 10px",
          borderRadius: 6,
          cursor: "pointer",
          boxShadow: mapType === "satellite" ? "0 4px 12px rgba(59,130,246,0.08)" : "none",
        }}
      >
        Satellite
      </button>
    </div>
  );

  return (
    <div
      className="address-picker"
      style={{
        marginBottom: "1.5rem",
        background: "#23262F",
        borderRadius: "12px",
        padding: "1rem",
        boxShadow: "0 4px 24px rgba(59,130,246,0.10)",
        border: "1.5px solid #334155",
      }}
    >
      <label style={{ color: "#bae6fd", fontWeight: "600", marginBottom: 8, display: "block" }}>
        {label}
      </label>

      <Autocomplete onLoad={setAutocomplete} onPlaceChanged={onPlaceChanged}>
        <input
          type="text"
          placeholder="Search address"
          style={{
            width: "100%",
            padding: "0.6rem",
            borderRadius: "10px",
            marginBottom: "0.5rem",
            border: "1px solid #4F8CFF",
            background: "#0f1724",
            color: "#bae6fd",
            fontSize: "1rem",
            fontWeight: 500,
            outline: "none",
          }}
        />
      </Autocomplete>

      <MapTypeToggle />

      <div style={{ position: 'relative' }}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={12}
          center={marker}
          onClick={onMapClick}
          onLoad={onMapLoad}
          options={{
            styles: darkMapStyle,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            backgroundColor: "#0f1724",
          }}
        >
          <Marker
            position={marker}
            draggable={true}
            onDragEnd={(e) => {
              const fakeEvent = { latLng: e.latLng };
              onMapClick(fakeEvent);
            }}
            icon={{
              url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNiIgaGVpZ2h0PSIzNiIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjMGVhNWU5IiBkPSJNMTIgMkM4LjEzIDIgNSA1LjEzIDUgOWMwIDUuMjUgNyAxMyA3IDEzczctNy43NSA3LTEzYzAtMy44Ny0zLjEzLTctNy03eiIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iOSIgcj0iMi41IiBmaWxsPSIjMDYyYzNhIi8+PC9zdmc+",
              scaledSize: new window.google.maps.Size(36, 36),
              anchor: new window.google.maps.Point(18, 36),
            }}
          />
        </GoogleMap>
        
        {/* Fallback message that appears if map doesn't load properly */}
        <div 
          id="map-fallback-message" 
          style={{
            display: 'none',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: '#bae6fd',
            background: 'rgba(15, 23, 36, 0.9)',
            padding: '16px',
            borderRadius: '8px',
            zIndex: 1000
          }}
        >
          <p>Map failed to load. Please check your API key and try again.</p>
          <button 
            onClick={retryLoadMap}
            style={{
              padding: '8px 16px',
              background: '#4F8CFF',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '8px'
            }}
          >
            Retry
          </button>
        </div>
      </div>

      <div style={{ color: "#bae6fd", marginTop: 8, fontSize: "0.95rem", borderTop: "1px solid #334155", paddingTop: "0.5rem" }}>
        <b>Selected Coordinates:</b>{" "}
        {marker && marker.lat && marker.lng ? (
          <span>
            {marker.lat.toFixed(5)}, {marker.lng.toFixed(5)}
          </span>
        ) : (
          <span>None</span>
        )}
      </div>
    </div>
  );
};

export default AddressPicker;