const canvas = document.getElementById('tickCanvas');
const ctx = canvas.getContext('2d');

function drawTicks() {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = 118;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 360; i += 5) {
        const angle = (i - 90) * (Math.PI / 180);
        const isMajor = i % 45 === 0;
        const isMid = i % 15 === 0;

        const innerRadius = isMajor ? radius - 14 : isMid ? radius - 8 : radius - 5;

        const x1 = cx + radius * Math.cos(angle);
        const y1 = cy + radius * Math.sin(angle);
        const x2 = cx + innerRadius * Math.cos(angle);
        const y2 = cy + innerRadius * Math.sin(angle);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        // north tick red, major ticks a litle brighter
        ctx.strokeStyle = i === 0 ? '#ff3333' : isMajor ? '#555' : '#2a2a2a';
        ctx.lineWidth = isMajor ? 1.5 : 0.8;
        ctx.stroke();
    }
}

const needle = document.getElementById('needle');
const degreesDisplay = document.getElementById('degrees');
const directionDisplay = document.getElementById('direction');
const coordsDisplay = document.getElementById('coords');

// based on 16-point compass - 8 for cleaner ui
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
        degreesDisplay.textContent = 'Compass functionality requires a mobile device with a magnetometer';
        return;
    }


    document.querySelector('.compass-ring').style.transform = `rotate(${-degrees}deg)`;
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

window.addEventListener('load', () => {
    drawTicks();
    startCompass();
});

// watchPosition keeps updating as user moves
navigator.geolocation.watchPosition((position) => {
    const lat = position.coords.latitude.toFixed(5);
    const lng = position.coords.longitude.toFixed(5);
    coordsDisplay.textContent = `${lat}, ${lng}`;
}, () => {
    coordsDisplay.textContent = 'Location unavailable';
});