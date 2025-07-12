import React, { useState, useRef, useCallback, useEffect } from "react";
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
  borderRadius: "1rem",
};
const defaultCenter = {
  lat: 39.8283,
  lng: -98.5795,
};

const LocationPicker = ({ onLocationSelect, initialData }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [markerPosition, setMarkerPosition] = useState(null);
  const [address, setAddress] = useState("");
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      if (initialData.address) {
        setAddress(initialData.address);
      }
      if (initialData.latitude && initialData.longitude) {
        setMarkerPosition({ lat: initialData.latitude, lng: initialData.longitude });
      }
    }
  }, [initialData]);

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const newPosition = { lat, lng };
        setMarkerPosition(newPosition);
        setAddress(place.formatted_address);
        if (onLocationSelect) {
          onLocationSelect({
            address: place.formatted_address,
            latitude: lat,
            longitude: lng,
          });
        }
      }
    }
  };

  const reverseGeocode = useCallback((lat, lng) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        setAddress(results[0].formatted_address);
        if (onLocationSelect) {
          onLocationSelect({
            address: results[0].formatted_address,
            latitude: lat,
            longitude: lng,
          });
        }
      } else {
        setAddress("");
        if (onLocationSelect) {
          onLocationSelect({ address: "", latitude: lat, longitude: lng });
        }
      }
    });
  }, [onLocationSelect]);

  const handleMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarkerPosition({ lat, lng });
    reverseGeocode(lat, lng);
  }, [reverseGeocode]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMarkerPosition({ lat: latitude, lng: longitude });
          reverseGeocode(latitude, longitude);
        },
        (error) => {
          console.error("Error getting current location:", error);
          alert("Could not get your location. Please enable location services.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps...";

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
        <Autocomplete
          onLoad={(ref) => (autocompleteRef.current = ref)}
          onPlaceChanged={onPlaceChanged}
          className="w-full"
        >
          <input
            type="text"
            placeholder="Enter a location"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              if (onLocationSelect) {
                onLocationSelect({ address: e.target.value });
              }
            }}
            className="w-full px-4 py-2 text-dark-olive bg-white border border-golden-yellow rounded-2xl"
          />
        </Autocomplete>
        <button
          type="button"
          onClick={getCurrentLocation}
          className="px-4 py-2 bg-olive-green text-white rounded-2xl hover:bg-dark-olive whitespace-nowrap"
        >
          Use Current Location
        </button>
      </div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={markerPosition ? 15 : 4}
        center={markerPosition || defaultCenter}
        onClick={handleMapClick}
      >
        {markerPosition && <Marker position={markerPosition} />}
      </GoogleMap>
    </div>
  );
};

export default LocationPicker;