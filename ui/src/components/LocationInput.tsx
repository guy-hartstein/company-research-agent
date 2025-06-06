import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin } from 'lucide-react';

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

declare global {
  interface Window {
    google: any;
    initGoogleMapsCallback: () => void;
  }
}

// Global state to track script loading
let isScriptLoaded = false;
let isScriptLoading = false;
let scriptLoadPromise: Promise<void> | null = null;

const loadGoogleMapsScript = (): Promise<void> => {
  // If already loaded, return resolved promise
  if (isScriptLoaded && window.google?.maps?.places) {
    return Promise.resolve();
  }

  // If already loading, return existing promise
  if (isScriptLoading && scriptLoadPromise) {
    return scriptLoadPromise;
  }

  // Check if script is already in the document
  const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
  if (existingScript && window.google?.maps?.places) {
    isScriptLoaded = true;
    return Promise.resolve();
  }

  isScriptLoading = true;
  scriptLoadPromise = new Promise<void>((resolve, reject) => {
  // If API is already available, resolve immediately
    if (window.google?.maps?.places) {
      isScriptLoaded = true;
      isScriptLoading = false;
      resolve();
      return;
    }

    // Define the callback function
    window.initGoogleMapsCallback = () => {
      isScriptLoaded = true;
      isScriptLoading = false;
      resolve();
    };

    // Create script element only if it doesn't exist
    if (!existingScript) {
      const script = document.createElement('script');
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

      if (!apiKey) {
        console.error('Google Maps API key is not defined. Please set VITE_GOOGLE_MAPS_API_KEY in your environment variables.');
        isScriptLoading = false;
        reject(new Error('Google Maps API key is not defined'));
        return;
      }

      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async&callback=initGoogleMapsCallback`;
      script.async = true;
      script.defer = true;

      // Handle errors
      script.onerror = (error) => {
        console.error('Error loading Google Maps script:', error);
        isScriptLoading = false;
        scriptLoadPromise = null;
        reject(error);
      };

      // Append to document
      document.head.appendChild(script);
    } else {
      // Script exists but API might not be ready yet
      const checkInterval = setInterval(() => {
        if (window.google?.maps?.places) {
          isScriptLoaded = true;
          isScriptLoading = false;
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);

      // Clear interval after 10 seconds to prevent infinite checking
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!isScriptLoaded) {
          isScriptLoading = false;
          reject(new Error('Google Maps API failed to load within timeout'));
        }
      }, 10000);
    }
  });

  return scriptLoadPromise;
};

const LocationInput: React.FC<LocationInputProps> = ({ value, onChange, className }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteElementRef = useRef<any>(null);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const onChangeRef = useRef(onChange);
  const isInitializedRef = useRef(false);

  // Update the ref when onChange changes
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Load the Google Maps API
  useEffect(() => {
    const loadApi = async () => {
      try {
        await loadGoogleMapsScript();
        setIsApiLoaded(true);
      } catch (error) {
        console.error('Failed to load Google Maps API:', error);
      }
    };

    loadApi();
  }, []);

  // Initialize autocomplete when API is loaded and input is available
  useEffect(() => {
    if (!isApiLoaded || !inputRef.current || !window.google?.maps?.places || isInitializedRef.current) {
      return;
    }

    try {
      // Use the modern PlaceAutocompleteElement if available, fallback to legacy Autocomplete
      if (window.google.maps.places.PlaceAutocompleteElement) {
        // Create and configure the new PlaceAutocompleteElement
        const autocompleteElement = document.createElement('gmp-place-autocomplete');
        autocompleteElement.setAttribute('type', 'cities');

        // Replace the input with the autocomplete element
        const parentElement = inputRef.current.parentElement;
        if (parentElement) {
          parentElement.insertBefore(autocompleteElement, inputRef.current);
          inputRef.current.style.display = 'none';

          // Style the autocomplete element to match the input
          autocompleteElement.style.width = '100%';
          autocompleteElement.style.height = '100%';

          // Listen for place selection
          autocompleteElement.addEventListener('gmp-placeselect', (event: any) => {
            const place = event.place;
            if (place?.formattedAddress) {
              onChangeRef.current(place.formattedAddress);
            }
          });

          autocompleteElementRef.current = autocompleteElement;
        }
      } else {
        // Fallback to legacy Autocomplete API
        console.warn('Using deprecated Google Maps Autocomplete API. Consider upgrading to PlaceAutocompleteElement.');

        autocompleteElementRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
          types: ['(cities)'],
        });

        // Add place_changed listener
        const autocomplete = autocompleteElementRef.current;
        if (autocomplete) {
          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place?.formatted_address) {
              onChangeRef.current(place.formatted_address);
            }
          });
        }
      }

      // Style the autocomplete dropdown
      const style = document.createElement('style');
      style.textContent = `
        .pac-container {
          background-color: white !important;
          border: 1px solid rgba(70, 139, 255, 0.1) !important;
          border-radius: 0.75rem !important;
          margin-top: 0.5rem !important;
          font-family: "Noto Sans", sans-serif !important;
          overflow: hidden !important;
          box-shadow: none !important;
        }
        .pac-item {
          padding: 0.875rem 1.25rem !important;
          cursor: pointer !important;
          transition: all 0.2s ease-in-out !important;
          border-bottom: 1px solid rgba(70, 139, 255, 0.05) !important;
        }
        .pac-item:last-child {
          border-bottom: none !important;
        }
        .pac-item:hover {
          background-color: rgba(70, 139, 255, 0.03) !important;
        }
        .pac-item-selected {
          background-color: rgba(70, 139, 255, 0.05) !important;
        }
        .pac-item-query {
          color: #1a365d !important;
          font-size: 0.9375rem !important;
          font-weight: 500 !important;
        }
        .pac-matched {
          font-weight: 600 !important;
        }
        .pac-item span:not(.pac-item-query) {
          color: #64748b !important;
          font-size: 0.8125rem !important;
          margin-left: 0.5rem !important;
        }
        /* Hide the location icon */
        .pac-icon {
          display: none !important;
        }
        /* Style for the new PlaceAutocompleteElement */
        gmp-place-autocomplete {
          width: 100% !important;
          --gmp-place-autocomplete-font-family: "DM Sans", sans-serif !important;
        }
      `;
      document.head.appendChild(style);

      isInitializedRef.current = true;
    } catch (error) {
      console.error('Error initializing Google Maps Autocomplete:', error);
    }

    // Cleanup
    return () => {
      if (autocompleteElementRef.current) {
        if (window.google?.maps?.event && typeof autocompleteElementRef.current.addListener === 'function') {
          // Legacy Autocomplete cleanup
          window.google.maps.event.clearInstanceListeners(autocompleteElementRef.current);
        } else if (autocompleteElementRef.current.remove) {
          // Modern PlaceAutocompleteElement cleanup
          autocompleteElementRef.current.remove();
          if (inputRef.current) {
            inputRef.current.style.display = '';
          }
        }
        autocompleteElementRef.current = null;
        isInitializedRef.current = false;
      }
    };
  }, [isApiLoaded]); // Removed onChange from dependencies

  // Handle manual input changes
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-50/0 via-gray-100/50 to-gray-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 stroke-[#468BFF] transition-all duration-200 group-hover:stroke-[#8FBCFA] z-10" strokeWidth={1.5} />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
          }
        }}
        className={`${className} !font-['DM_Sans']`}
        placeholder="City, Country"
      />
    </div>
  );
};

export default LocationInput;
