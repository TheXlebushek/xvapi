if (!sessionStorage.getItem('uuid')) {
  document.location = '/';
}

const uuid = sessionStorage.getItem('uuid');

let storefront = await fetch(`xvapi/storefront/nightMarket/${uuid}`, {
  method: 'POST',
});

if (!storefront.ok) {
  sessionStorage.removeItem('uuid');
  document.location = '/';
}

storefront = await storefront.json();
console.log(storefront);

const balancePanel = document.querySelector('#balance-panel');

const vp = document.createElement('img');
vp.src = storefront.currencies.find((e) => e.displayName == 'VP').displayIcon;
vp.style.height = '24px';
vp.style.width = '24px';
vp.style.marginLeft = '15px';
balancePanel.append(vp);

const vpBalance = document.createElement('h2');
vpBalance.innerText = storefront.currencies.find(
  (e) => e.displayName == 'VP',
).amount;
vpBalance.style.marginLeft = '5px';
vpBalance.classList.add('text');
balancePanel.append(vpBalance);

const rp = document.createElement('img');
rp.src = storefront.currencies.find(
  (e) => e.displayName == 'Radianite Points',
).displayIcon;
rp.style.marginLeft = '15px';
rp.style.height = '24px';
rp.style.width = '24px';
balancePanel.append(rp);

const rpBalance = document.createElement('h2');
rpBalance.innerText = storefront.currencies.find(
  (e) => e.displayName == 'Radianite Points',
).amount;
rpBalance.style.marginLeft = '5px';
rpBalance.classList.add('text');
balancePanel.append(rpBalance);

if (!storefront.timeLeft) {
  document.getElementById('title').innerText =
    'Night market is not available at the moment';

  const timeLeft = document.createElement('h2');
  timeLeft.classList.add('text');
  timeLeft.style.marginLeft = '5px';
  timeLeft.innerText = '0';
  document.getElementById('time-panel').append(timeLeft);

  throw new Error('Night market is not available');
}

[...document.getElementsByClassName('offer')].forEach((e) =>
  e.classList.remove('gradient'),
);

let storeOffersDiv = document.querySelectorAll('.offer');
storeOffersDiv.forEach((offerDiv, i) => {
  const offer = storefront.offers[i];

  offerDiv.innerHTML = '';

  offerDiv.style.backgroundColor = `#${offer.highlightColor}`;

  let imageBox = document.createElement('div');
  imageBox.classList.add('offer-image-box');
  offerDiv.appendChild(imageBox);

  let image = document.createElement('img');
  image.src = offer.displayIcon;
  image.onclick = () => {
    window.location.href = `/weapon/${offer.uuid}`;
  };
  image.classList.add('offer-image');
  image.classList.add('shadow');
  imageBox.append(image);

  let textBox = document.createElement('div');
  textBox.classList.add('offer-text-box');
  textBox.classList.add('slide-up');
  offerDiv.append(textBox);

  let text = document.createElement('h2');
  text.textContent = offer.displayName;
  text.classList.add('text');
  text.classList.add('offer-name');
  textBox.append(text);

  let priceBox = document.createElement('div');
  priceBox.classList.add('price-box');
  textBox.append(priceBox);

  let miniBox = document.createElement('div');
  miniBox.classList.add('offer-price-box');
  priceBox.append(miniBox);

  let oldPrice = document.createElement('strike');
  oldPrice.innerText = offer.cost;
  oldPrice.classList.add('text');
  oldPrice.style.marginRight = '5px';
  miniBox.append(oldPrice);

  let discount = document.createElement('h4');
  discount.innerText = `-${offer.discount}%`;
  discount.classList.add('text');
  discount.style.marginRight = 'auto';
  miniBox.append(discount);

  let vp = document.createElement('img');
  vp.src = storefront.currencies.find((e) => e.displayName == 'VP').displayIcon;
  vp.classList.add('icon');
  miniBox.append(vp);

  let price = document.createElement('h3');
  price.textContent = offer.discountCost;
  price.classList.add('text');
  price.style.margin = '0 5px';
  miniBox.append(price);

  let logo = document.createElement('img');
  logo.src = offer.rarityIcon;
  logo.classList.add('icon');
  miniBox.appendChild(logo);
});

let time = storefront.timeLeft;
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
