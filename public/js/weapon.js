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
const titleBox = document.getElementById('title-box');
titleBox.style.backgroundColor = `#${weaponData.highlightColor}`;
const rarityIcon = document.createElement('img');
rarityIcon.classList.add('icon');
rarityIcon.src = weaponData.rarityIcon;
titleBox.appendChild(rarityIcon);

const weaponContainer = document.getElementById('weapon-container');
if (weaponData.wallpaper) {
  weaponContainer.style.background = `url(${weaponData.wallpaper})`;
  weaponContainer.style.backgroundSize = 'cover';
}
const chromasBox = document.getElementById('chromas');
const levels = document.getElementById('levels');

weaponData.chromas.forEach((chroma) => {
  const chromaVideoBox = document.createElement('div');
  const chromaVideo = document.createElement('video');
  if (chroma.streamedVideo) {
    chromaVideoBox.classList.add('chroma-video-box');
    levels.appendChild(chromaVideoBox);

    chromaVideo.classList.add('chroma-video');
    chromaVideo.src = chroma.streamedVideo;
    chromaVideo.loop = true;
    chromaVideo.muted = true;
    chromaVideoBox.appendChild(chromaVideo);
  }

  const chromaContainer = document.createElement('div');
  chromaContainer.classList.add('chroma-box');
  chromasBox.appendChild(chromaContainer);

  const imageBox = document.createElement('div');
  imageBox.classList.add('image-box');
  chromaContainer.appendChild(imageBox);

  const displayIcon = document.createElement('img');
  displayIcon.classList.add('shadow');
  displayIcon.classList.add('chroma-image');
  if (chroma.streamedVideo) {
    displayIcon.onmouseover = () => {
      const levelBoxes = document.getElementsByClassName('level-box');
      for (let i = 0; i < levelBoxes.length; ++i)
        levelBoxes[i].style.opacity = '0';
      document.getElementById('title-box').style.opacity = '0';
      chromaVideoBox.style.display = 'block';
      chromaVideo.play();
    };
    displayIcon.onmouseleave = () => {
      const levelBoxes = document.getElementsByClassName('level-box');
      for (let i = 0; i < levelBoxes.length; ++i)
        levelBoxes[i].style.opacity = '1';
      document.getElementById('title-box').style.opacity = '1';
      chromaVideoBox.style.display = 'none';
      chromaVideo.pause();
      chromaVideo.currentTime = 0;
    };
  }
  if (!chroma.displayIcon) displayIcon.src = chroma.fullRender;
  else displayIcon.src = chroma.displayIcon;
  imageBox.appendChild(displayIcon);

  const textBox = document.createElement('div');
  textBox.classList.add('chroma-text-box');
  chromaContainer.appendChild(textBox);

  const displayName = document.createElement('h2');
  displayName.classList.add('text');
  displayName.classList.add('chroma-text');
  displayName.classList.add('slide-up');
  if (chroma.displayName.length > 40) {
    displayName.style.fontSize = '18px';
    displayName.style.marginBottom = '0';
  }
  displayName.innerText = chroma.displayName;
  textBox.appendChild(displayName);
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
  video.currentTime = 0.1;

  video.onkeyup = (e) => {
    if (e.key == 'm') video.muted = !video.muted;
    if (e.key == 'f') video.requestFullscreen();
    if (e.key == 'r') video.currentTime = 0;
  };
  video.onclick = () => {
    video.controls = false;
    video.muted = !video.muted;
  };
  video.oncontextmenu = () => {
    video.controls = true;
    return false;
  };
  video.onmouseover = () => {
    video.play();
  };
  video.onmouseleave = () => {
    video.pause();
    video.currentTime = 0.1;
    video.muted = true;
    video.controls = false;
  };
  levelBox.appendChild(video);

  const displayName = document.createElement('h3');
  displayName.classList.add('text');
  displayName.classList.add('slide-up');
  displayName.classList.add('level-text');
  displayName.innerText = level.displayName;
  levelBox.appendChild(displayName);
});
