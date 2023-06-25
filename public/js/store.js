if (!sessionStorage.getItem('uuid')) {
  document.location = '/';
}

const uuid = sessionStorage.getItem('uuid');

let storeFront = await fetch(`xvapi/storefront/store/${uuid}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
});

if (!storeFront.ok) {
  sessionStorage.removeItem('uuid');
  document.location = '/';
}

storeFront = await storeFront.json();
console.log(storeFront);

[...document.getElementsByClassName('offer')].forEach((e) => {
  e.classList.remove('gradient');
});

const storeOffersDiv = document.querySelectorAll('.offer');
storeOffersDiv.forEach((offerDiv, i) => {
  const offer = storeFront.offers[i];
  offerDiv.innerHTML = '';
  offerDiv.style.backgroundColor = `#${offer.highlightColor}`;

  const imageBox = document.createElement('div');
  imageBox.classList.add('offer-image-box');
  offerDiv.appendChild(imageBox);

  const image = document.createElement('img');
  image.src = offer.displayIcon;
  image.classList.add('offer-image');
  image.classList.add('shadow');
  imageBox.append(image);

  const textBox = document.createElement('div');
  textBox.classList.add('offer-text-box');
  textBox.classList.add('slide-up');
  offerDiv.append(textBox);

  const text = document.createElement('h2');
  text.textContent = offer.displayName;
  text.classList.add('text');
  text.classList.add('offer-name');
  textBox.append(text);

  const priceBox = document.createElement('div');
  priceBox.classList.add('price-box');
  textBox.append(priceBox);

  const vp = document.createElement('img');
  vp.src = storeFront.currencies.find((e) => e.displayName == 'VP').displayIcon;
  vp.classList.add('icon');
  vp.style.marginBottom = '5px';
  priceBox.append(vp);

  const price = document.createElement('h2');
  price.textContent = offer.cost;
  price.classList.add('text');
  price.style.margin = '0 5px';
  price.style.marginBottom = '5px';
  priceBox.append(price);

  const logo = document.createElement('img');
  logo.src = offer.rarityIcon;
  logo.classList.add('icon');
  logo.style.marginBottom = '5px';
  priceBox.appendChild(logo);
});

const balancePanel = document.querySelector('#balance-panel');

const vp = document.createElement('img');
vp.src = storeFront.currencies.find((e) => e.displayName == 'VP').displayIcon;
vp.classList.add('icon');
vp.style.marginLeft = '15px';
balancePanel.append(vp);

const vpBalance = document.createElement('h2');
vpBalance.innerText = storeFront.currencies.find(
  (e) => e.displayName == 'VP',
).amount;
vpBalance.style.marginLeft = '5px';
vpBalance.classList.add('text');
balancePanel.append(vpBalance);

const rp = document.createElement('img');
rp.src = storeFront.currencies.find(
  (e) => e.displayName == 'Radianite Points',
).displayIcon;
rp.style.marginLeft = '15px';
rp.classList.add('icon');
balancePanel.append(rp);

const rpBalance = document.createElement('h2');
rpBalance.innerText = storeFront.currencies.find(
  (e) => e.displayName == 'Radianite Points',
).amount;
rpBalance.style.marginLeft = '5px';
rpBalance.classList.add('text');
balancePanel.append(rpBalance);

let time = storeFront.timeLeft;
const timeLeft = document.createElement('h2');
timeLeft.classList.add('text');
timeLeft.style.marginLeft = '5px';
{
  let hours = Math.floor((time % (3600 * 24)) / 3600);
  if (hours < 10) hours = `0${hours}`;
  let minutes = Math.floor((time % 3600) / 60);
  if (minutes < 10) minutes = `0${minutes}`;
  let seconds = Math.floor(time % 60);
  if (seconds < 10) seconds = `0${seconds}`;
  timeLeft.innerText = `${hours}:${minutes}:${seconds}`;
}
document.getElementById('time-panel').append(timeLeft);
setInterval(() => {
  --time;
  let hours = Math.floor((time % (3600 * 24)) / 3600);
  if (hours < 10) hours = `0${hours}`;
  let minutes = Math.floor((time % 3600) / 60);
  if (minutes < 10) minutes = `0${minutes}`;
  let seconds = Math.floor(time % 60);
  if (seconds < 10) seconds = `0${seconds}`;
  timeLeft.innerText = `${hours}:${minutes}:${seconds}`;
}, 1000);
