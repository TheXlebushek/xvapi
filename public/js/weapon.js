function parseURL() {
  let href = window.location.href;
  let uuid = href.slice(href.indexOf('/weapon/') + 8);
  if (uuid.endsWith('/')) return uuid.substring(0, uuid.length - 1);
  return uuid;
}

const weaponData = await fetch(`/xvapi/storefront/weapon/${parseURL()}`).then(
  (r) => r.json(),
);
console.log(weaponData);

document.title = weaponData.displayName;
document.getElementById('title').innerText = weaponData.displayName;
const weaponContainer = document.getElementById('weapon-container');
if (weaponData.wallpaper) {
  weaponContainer.style.background = `url(${weaponData.wallpaper})`;
  weaponContainer.style.backgroundSize = 'cover';
}
const chromasBox = document.getElementById('chromas');

weaponData.chromas.forEach((chroma) => {
  const chromaContainer = document.createElement('div');
  chromaContainer.classList.add('chroma-box');
  chromasBox.appendChild(chromaContainer);

  const imageBox = document.createElement('div');
  imageBox.classList.add('image-box');
  chromaContainer.appendChild(imageBox);

  const displayIcon = document.createElement('img');
  displayIcon.classList.add('shadow');
  displayIcon.classList.add('chroma-image');
  if (!chroma.displayIcon) displayIcon.src = chroma.fullRender;
  else displayIcon.src = chroma.displayIcon;
  imageBox.appendChild(displayIcon);

  const displayName = document.createElement('h3');
  displayName.classList.add('text');
  displayName.classList.add('chroma-text');
  displayName.classList.add('slide-up');
  displayName.innerText = chroma.displayName;
  chromaContainer.appendChild(displayName);
});

const levelsContainer = document.getElementById('levels-box');
weaponData.levels.forEach((level) => {
  if (!level.streamedVideo) return;
  const levelBox = document.createElement('div');
  levelBox.classList.add('level-box');
  levelsContainer.appendChild(levelBox);

  const video = document.createElement('video');
  video.classList.add('level-video');
  video.src = level.streamedVideo;
  video.loop = true;
  video.muted = true;
  video.preload = 'auto';
  video.onclick = () => {
    video.controls = !video.controls;
    video.muted = !video.controls;
  };
  video.onmouseover = () => {
    video.play();
  };
  video.onmouseleave = () => {
    video.pause();
    video.currentTime = 0;
  };
  levelBox.appendChild(video);

  const displayName = document.createElement('h3');
  displayName.classList.add('text');
  displayName.classList.add('slide-up');
  displayName.classList.add('level-text');
  displayName.innerText = level.displayName;
  levelBox.appendChild(displayName);
});
