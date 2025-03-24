document.getElementById('saveLocation').addEventListener('click', () => {
	navigator.geolocation.getCurrentPosition(
		(position) => {
			const { latitude, longitude } = position.coords;
			localStorage.setItem(
				'carLocation',
				JSON.stringify({ latitude, longitude })
			);
			alert('Location saved!');
		},
		(error) => {
			alert('Error getting location: ' + error.message);
		}
	);
});

// Initialize the map
var map = L.map('map').setView([51.505, -0.09], 13); // Default: London

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution:
		'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// Get saved location from local storage
const savedLocation = localStorage.getItem('carLocation');

if (savedLocation) {
	const { latitude, longitude } = JSON.parse(savedLocation);
	map.setView([latitude, longitude], 13);
	L.marker([latitude, longitude]).addTo(map).bindPopup('Your Car');
} else {
	// Default location
	L.marker([51.505, -0.09]).addTo(map).bindPopup('Default Location');
}

document.getElementById('status').innerText = 'Ready';

// Compass functionality
if (window.DeviceOrientationEvent) {
	window.addEventListener(
		'deviceorientation',
		function (event) {
			var heading = event.alpha; // alpha: compass heading (0-360)

			// Check for iOS devices (webkitCompassHeading)
			if (event.webkitCompassHeading) {
				heading = event.webkitCompassHeading;
			}

			if (heading) {
				document.getElementById('compass').innerText =
					'Heading: ' + heading.toFixed(2);
			} else {
				document.getElementById('compass').innerText = 'Compass not available';
			}
		},
		false
	);
} else {
	document.getElementById('compass').innerText = 'Not supported';
}

if ('serviceWorker' in navigator) {
	navigator.serviceWorker
		.register('/sw.js')
		.then((registration) => {
			console.log('Service Worker registered with scope:', registration.scope);
		})
		.catch((error) => {
			console.error('Service Worker registration failed:', error);
		});
}
