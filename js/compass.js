const needle = document.getElementById('needle');
const degreesDisplay = document.getElementById('degrees');
const directionDisplay = document.getElementById('direction');
const coordsDisplay = document.getElementById('coords');

// Degree ranges based on 16-point compass — kept to 8 for cleaner UX
function getDirection(degrees) {
    if (degrees >= 337.5 || degrees < 22.5) return 'North';
    if (degrees >= 22.5 && degrees < 67.5) return 'North East';
    if (degrees >= 67.5 && degrees < 112.5) return 'East';
    if (degrees >= 112.5 && degrees < 157.5) return 'South East';
    if (degrees >= 157.5 && degrees < 202.5) return 'South';
    if (degrees >= 202.5 && degrees < 247.5) return 'South West';
    if (degrees >= 247.5 && degrees < 292.5) return 'West';
    if (degrees >= 292.5 && degrees < 337.5) return 'North West';
}

function handleOrientation(event) {
    let degrees = event.alpha;

    // alpha is null when sensor is unavailable or not calibrate
    if (degrees === null) {
        degreesDisplay.textContent = 'Not supported';
        return;
    }

    needle.style.transform = `translate(-50%, -50%) rotate(${degrees}deg)`;
    degreesDisplay.textContent = `${Math.round(degrees)}°`;
    directionDisplay.textContent = getDirection(degrees);
}

// iOS 13+ requires permission request for motion sensors
// Android grants access automatically
function startCompass() {
    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(response => {
                if (response === 'granted') {
                    window.addEventListener('deviceorientationabsolute', handleOrientation);
                }
            })
            .catch(console.error);
    } else {
        window.addEventListener('deviceorientationabsolute', handleOrientation);
    }
}

window.addEventListener('load', startCompass);

// watchPosition keeps updating as user moves
navigator.geolocation.watchPosition((position) => {
    const lat = position.coords.latitude.toFixed(5);
    const lng = position.coords.longitude.toFixed(5);
    coordsDisplay.textContent = `${lat}, ${lng}`;
}, () => {
    coordsDisplay.textContent = 'Location unavailable';
});