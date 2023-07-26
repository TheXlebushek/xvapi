if (!localStorage.getItem('uuid')) {
  document.location = '/';
}

const uuid = localStorage.getItem('uuid');

let accessoryStore = await fetch(`xvapi/storefront/accessoryStore/${uuid}`, {
  method: 'POST',
});

if (!accessoryStore.ok) {
  localStorage.removeItem('uuid');
  document.location = '/';
}

accessoryStore = await accessoryStore.json();
console.log(accessoryStore);

const storeOffersDiv = document.querySelectorAll('.offer');
storeOffersDiv.forEach((offerDiv, i) => {
  const offer = accessoryStore.offers[i];
  offerDiv.innerHTML = '';

  const imageBox = document.createElement('div');
  imageBox.classList.add('offer-image-box');
  offerDiv.appendChild(imageBox);

  const largeImageBox = document.getElementById('large-image-box');
  const largeImage = document.createElement('img');
  if (offer.largeImage) {
    largeImage.classList.add('large-image');
    largeImage.classList.add('slide-down-small');
    largeImage.style.display = 'none';
    if (offer.typeId == '3f296c07-64c3-494c-923b-fe692a4fa1bd')
      largeImage.classList.add('card');
    largeImage.src = offer.largeImage;
    largeImageBox.append(largeImage);
  }

  const image = document.createElement('img');
  image.classList.add('offer-image');
  image.classList.add('shadow');
  if (offer.typeId != 'de7caa6b-adf7-4588-bbd1-143831e786c6')
    image.src = offer.displayIcon;
  else image.src = '/images/playerTitle.png';
  imageBox.append(image);
  if (offer.largeImage) {
    const title = document.getElementById('title');
    image.onmouseover = () => {
      largeImage.style.display = 'block';
      title.style.opacity = '0';
    };
    image.onmouseleave = () => {
      largeImage.style.display = 'none';
      title.style.opacity = '1';
    };
  }

  const textBox = document.createElement('div');
  textBox.classList.add('offer-text-box');
  textBox.classList.add('slide-up');
  offerDiv.append(textBox);

  const text = document.createElement('h2');
  text.classList.add('text');
  text.classList.add('offer-name');
  if (offer.displayName.length > 20) text.style.fontSize = '18px';
  text.textContent = offer.displayName;
  textBox.append(text);

  const priceBox = document.createElement('div');
  priceBox.classList.add('price-box');
  textBox.append(priceBox);

  const vp = document.createElement('img');
  vp.classList.add('icon');
  vp.src = accessoryStore.currencies.find(
    (e) => e.displayName == 'Kingdom Credits',
  ).displayIcon;
  vp.style.marginBottom = '5px';
  priceBox.append(vp);

  const price = document.createElement('h2');
  price.classList.add('text');
  price.textContent = offer.cost;
  price.style.margin = '0 5px';
  price.style.marginBottom = '5px';
  priceBox.append(price);
});

const balancePanel = document.querySelector('#balance-panel');

const kc = document.createElement('img');
kc.classList.add('icon');
kc.src = accessoryStore.currencies.find(
  (e) => e.displayName == 'Kingdom Credits',
).displayIcon;
kc.style.marginLeft = '15px';
balancePanel.append(kc);

const kcBalance = document.createElement('h2');
kcBalance.classList.add('text');
kcBalance.innerText = accessoryStore.currencies.find(
  (e) => e.displayName == 'Kingdom Credits',
).amount;
kcBalance.style.marginLeft = '5px';
balancePanel.append(kcBalance);

let time = accessoryStore.timeLeft;
const timeLeft = document.createElement('h2');
timeLeft.classList.add('text');
timeLeft.style.marginLeft = '5px';
{
  let days = Math.floor(time / (3600 * 24));
  if (days < 10) days = `0${days}`;
  let hours = Math.floor((time % (3600 * 24)) / 3600);
  if (hours < 10) hours = `0${hours}`;
  let minutes = Math.floor((time % 3600) / 60);
  if (minutes < 10) minutes = `0${minutes}`;
  let seconds = Math.floor(time % 60);
  if (seconds < 10) seconds = `0${seconds}`;
  timeLeft.innerText = `${days}:${hours}:${minutes}:${seconds}`;
}
document.getElementById('time-panel').append(timeLeft);

setInterval(() => {
  --time;
  let days = Math.floor(time / (3600 * 24));
  if (days < 10) days = `0${days}`;
  let hours = Math.floor((time % (3600 * 24)) / 3600);
  if (hours < 10) hours = `0${hours}`;
  let minutes = Math.floor((time % 3600) / 60);
  if (minutes < 10) minutes = `0${minutes}`;
  let seconds = Math.floor(time % 60);
  if (seconds < 10) seconds = `0${seconds}`;
  timeLeft.innerText = `${days}:${hours}:${minutes}:${seconds}`;
}, 1000);
