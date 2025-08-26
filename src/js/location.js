// Location services with Google Maps integration
class LocationService {
  constructor() {
    this.currentLocation = null;
    this.map = null;
    this.geocoder = null;
    this.directionsService = null;
    this.directionsRenderer = null;
  }

  // Initialize Google Maps
  async initializeGoogleMaps() {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        this.geocoder = new google.maps.Geocoder();
        this.directionsService = new google.maps.DirectionsService();
        this.directionsRenderer = new google.maps.DirectionsRenderer();
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places,geometry`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        this.geocoder = new google.maps.Geocoder();
        this.directionsService = new google.maps.DirectionsService();
        this.directionsRenderer = new google.maps.DirectionsRenderer();
        resolve();
      };
      
      script.onerror = () => reject(new Error('Failed to load Google Maps'));
      document.head.appendChild(script);
    });
  }

  // Get current location
  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          resolve(this.currentLocation);
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    });
  }

  // Reverse geocoding - get address from coordinates
  async getAddressFromCoordinates(lat, lng) {
    return new Promise((resolve, reject) => {
      if (!this.geocoder) {
        reject(new Error('Geocoder not initialized'));
        return;
      }

      this.geocoder.geocode(
        { location: { lat, lng } },
        (results, status) => {
          if (status === 'OK' && results[0]) {
            resolve(results[0].formatted_address);
          } else {
            reject(new Error('Geocoding failed'));
          }
        }
      );
    });
  }

  // Forward geocoding - get coordinates from address
  async getCoordinatesFromAddress(address) {
    return new Promise((resolve, reject) => {
      if (!this.geocoder) {
        reject(new Error('Geocoder not initialized'));
        return;
      }

      this.geocoder.geocode(
        { address },
        (results, status) => {
          if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;
            resolve({
              lat: location.lat(),
              lng: location.lng(),
              formatted_address: results[0].formatted_address
            });
          } else {
            reject(new Error('Address not found'));
          }
        }
      );
    });
  }

  // Create map instance
  createMap(elementId, center, zoom = 15) {
    const mapOptions = {
      center: center || { lat: 3.139, lng: 101.6869 }, // Default to KL
      zoom,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    };

    this.map = new google.maps.Map(document.getElementById(elementId), mapOptions);
    this.directionsRenderer.setMap(this.map);
    return this.map;
  }

  // Add marker to map
  addMarker(position, title, icon = null) {
    const marker = new google.maps.Marker({
      position,
      map: this.map,
      title,
      icon: icon || {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="12" fill="#0A5E2A"/>
            <circle cx="16" cy="16" r="6" fill="white"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(32, 32)
      }
    });

    return marker;
  }

  // Calculate distance between two points
  calculateDistance(point1, point2) {
    if (!window.google || !window.google.maps) return null;
    
    const distance = google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(point1.lat, point1.lng),
      new google.maps.LatLng(point2.lat, point2.lng)
    );
    
    return Math.round(distance / 1000 * 10) / 10; // Return in km, rounded to 1 decimal
  }

  // Get directions between two points
  async getDirections(origin, destination) {
    return new Promise((resolve, reject) => {
      this.directionsService.route(
        {
          origin,
          destination,
          travelMode: google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === 'OK') {
            this.directionsRenderer.setDirections(result);
            resolve(result);
          } else {
            reject(new Error('Directions request failed'));
          }
        }
      );
    });
  }

  // Initialize autocomplete for address input
  initializeAutocomplete(inputElement, callback) {
    const autocomplete = new google.maps.places.Autocomplete(inputElement, {
      componentRestrictions: { country: 'my' }, // Restrict to Malaysia
      fields: ['place_id', 'geometry', 'name', 'formatted_address']
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          address: place.formatted_address || place.name
        };
        callback(location);
      }
    });

    return autocomplete;
  }
}

export default new LocationService();