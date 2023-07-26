if (!localStorage.getItem('uuid')) {
  document.location = '/';
}

const uuid = localStorage.getItem('uuid');

let storeFront = await fetch(`xvapi/storefront/store/${uuid}`, {
  method: 'POST',
});

if (!storeFront.ok) {
  localStorage.removeItem('uuid');
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
  offer.highlightColor = `${offer.highlightColor.slice(0, 6)}33`;
  offerDiv.style.backgroundColor = `#${offer.highlightColor}`;

  const imageBox = document.createElement('div');
  imageBox.classList.add('offer-image-box');
  offerDiv.appendChild(imageBox);

  const weaponLink = document.createElement('a');
  weaponLink.href = `/weapon/${offer.uuid}`;
  weaponLink.classList.add('weapon-link');
  weaponLink.classList.add('select-animation');
  imageBox.appendChild(weaponLink);

  const image = document.createElement('img');
  image.classList.add('offer-image');
  image.classList.add('shadow');
  image.src = offer.displayIcon;
  weaponLink.append(image);

  const textBox = document.createElement('div');
  textBox.classList.add('offer-text-box');
  textBox.classList.add('slide-up');
  offerDiv.append(textBox);

  const text = document.createElement('h2');
  text.classList.add('text');
  text.classList.add('offer-name');
  if (offer.displayName.length >= 19) text.style.fontSize = '20px';
  else if (offer.displayName.length >= 25) text.style.fontSize = '18px';
  else if (offer.displayName.length >= 30) text.style.fontSize = '16px';
  text.textContent = offer.displayName;
  textBox.append(text);

  const priceBox = document.createElement('div');
  priceBox.classList.add('price-box');
  textBox.append(priceBox);

  const vp = document.createElement('img');
  vp.classList.add('icon');
  vp.src = storeFront.currencies.find((e) => e.displayName == 'VP').displayIcon;
  vp.style.marginBottom = '5px';
  priceBox.append(vp);

  const price = document.createElement('h2');
  price.classList.add('text');
  price.textContent = offer.cost;
  price.style.margin = '0 5px';
  price.style.marginBottom = '5px';
  priceBox.append(price);

  const logo = document.createElement('img');
  logo.classList.add('icon');
  logo.src = offer.rarityIcon;
  logo.style.marginBottom = '5px';
  priceBox.appendChild(logo);
});

const balancePanel = document.querySelector('#balance-panel');

const vp = document.createElement('img');
vp.classList.add('icon');
vp.src = storeFront.currencies.find((e) => e.displayName == 'VP').displayIcon;
vp.style.marginLeft = '15px';
balancePanel.append(vp);

const vpBalance = document.createElement('h2');
vpBalance.classList.add('text');
vpBalance.innerText = storeFront.currencies.find(
  (e) => e.displayName == 'VP',
).amount;
vpBalance.style.marginLeft = '5px';
balancePanel.append(vpBalance);

const rp = document.createElement('img');
rp.classList.add('icon');
rp.src = storeFront.currencies.find(
  (e) => e.displayName == 'Radianite Points',
).displayIcon;
rp.style.marginLeft = '15px';
balancePanel.append(rp);

const rpBalance = document.createElement('h2');
rpBalance.classList.add('text');
rpBalance.innerText = storeFront.currencies.find(
  (e) => e.displayName == 'Radianite Points',
).amount;
rpBalance.style.marginLeft = '5px';
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
