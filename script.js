// Smooth scroll to section
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// Typing animation with professional wording
const textArray = [
  "Web Developer",
  "Graphic Designer",
  "Video Editor",
  "SEO Specialist",
  "UI/UX Designer",
  "Freelancer"
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedText = document.getElementById("typed-text");

function type() {
  const currentText = textArray[textIndex];
  typedText.textContent = currentText.substring(0, charIndex);

  if (!isDeleting && charIndex < currentText.length) {
    charIndex++;
  } else if (isDeleting && charIndex > 0) {
    charIndex--;
  } else if (!isDeleting && charIndex === currentText.length) {
    isDeleting = true;
    setTimeout(type, 1000);
    return;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    textIndex = (textIndex + 1) % textArray.length;
  }

  setTimeout(type, isDeleting ? 50 : 120);
}
type();

// Projects data
const projects = [
  {
    title: "Responsive Web Design",
    desc: "Modern responsive website built with HTML, CSS, JS.",
    url: "https://example.com/responsive-web-design"
  },
  {
    title: "Brand Logo Design",
    desc: "Created a full branding kit with logo, colors, and type.",
    url: "https://example.com/brand-logo-design"
  },
  {
    title: "Video Editing for Clients",
    desc: "Edited cinematic and promotional videos.",
    url: "https://example.com/video-editing"
  },
  {
    title: "SEO Campaign",
    desc: "Improved ranking and traffic for eCommerce business.",
    url: "https://example.com/seo-campaign"
  },
  {
    title: "Mobile App UI/UX",
    desc: "Food delivery app prototype designed in Figma.",
    url: "https://example.com/mobile-app-ui-ux"
  }
];

const projectCards = document.getElementById("projectCards");

projects.forEach(project => {
  const div = document.createElement("div");
  div.className = "project-card";
  div.innerHTML = `<a href="${project.url}" target="_blank" rel="noopener noreferrer" style="text-decoration:none; color:inherit; display:block;"><h3>${project.title}</h3><p>${project.desc}</p></a>`;
  projectCards.appendChild(div);
});

// Three.js 3D scene setup
const canvas = document.getElementById('three-canvas');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setClearColor(0x000000, 0); // transparent background

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const MAX_DISTANCE = 1.5;

const points = [];
const velocities = [];

const screenWidth = window.innerWidth;
let POINT_COUNT = 100;
if (screenWidth < 480) {
  POINT_COUNT = 40;
} else if (screenWidth < 768) {
  POINT_COUNT = 70;
}

for (let i = 0; i < POINT_COUNT; i++) {
  points.push(new THREE.Vector3(
    (Math.random() - 0.5) * 6,
    (Math.random() - 0.5) * 6,
    (Math.random() - 0.5) * 6
  ));
  velocities.push(new THREE.Vector3(
    (Math.random() - 0.5) * 0.008,
    (Math.random() - 0.5) * 0.008,
    (Math.random() - 0.5) * 0.008
  ));
}

const pointsGeometry = new THREE.BufferGeometry().setFromPoints(points);
const pointsMaterial = new THREE.PointsMaterial({ color: 0x00ffe7, size: 0.05 });
const pointsMesh = new THREE.Points(pointsGeometry, pointsMaterial);
scene.add(pointsMesh);

const linePositions = new Float32Array(POINT_COUNT * POINT_COUNT * 3 * 2);
const lineGeometry = new THREE.BufferGeometry();
lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ffe7, transparent: true, opacity: 0.3 });
const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
scene.add(lineSegments);

function animate() {
  requestAnimationFrame(animate);

  // Update points positions
  for (let i = 0; i < POINT_COUNT; i++) {
    points[i].add(velocities[i]);

    // Bounce back from bounds
    ['x', 'y', 'z'].forEach(axis => {
      if (points[i][axis] > 3 || points[i][axis] < -3) {
        velocities[i][axis] = -velocities[i][axis];
      }
    });
  }

  pointsGeometry.setFromPoints(points);
  pointsGeometry.attributes.position.needsUpdate = true;

  // Update lines between points within MAX_DISTANCE
  let vertexpos = 0;
  let numConnected = 0;
  for (let i = 0; i < POINT_COUNT; i++) {
    for (let j = i + 1; j < POINT_COUNT; j++) {
      const dist = points[i].distanceTo(points[j]);
      if (dist < MAX_DISTANCE) {
        linePositions[vertexpos++] = points[i].x;
        linePositions[vertexpos++] = points[i].y;
        linePositions[vertexpos++] = points[i].z;

        linePositions[vertexpos++] = points[j].x;
        linePositions[vertexpos++] = points[j].y;
        linePositions[vertexpos++] = points[j].z;

        numConnected++;
      }
    }
  }
  lineGeometry.setDrawRange(0, numConnected * 2);
  lineGeometry.attributes.position.needsUpdate = true;

  renderer.render(scene, camera);
}
animate();

function throttle(fn, wait) {
  let time = Date.now();
  return function() {
    if ((time + wait - Date.now()) < 0) {
      fn();
      time = Date.now();
    }
  }
}

// Responsive resize handling with throttle
window.addEventListener('resize', throttle(() => {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}, 200));
