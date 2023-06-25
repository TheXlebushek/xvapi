const logoutButton = document.getElementById('logout');
logoutButton.onclick = () => {
  sessionStorage.removeItem('uuid');
  document.location.reload();
};

const dropdowns = document.getElementsByClassName('dropdown');

for (let i = 0; i < dropdowns.length; ++i) {
  dropdowns[i].addEventListener('click', () => {
    for (let j = 0; j < dropdowns.length; ++j) {
      if (i == j) continue;
      dropdowns[j].classList.remove('active');
      dropdowns[j].nextElementSibling.style.display = 'none';
    }
    dropdowns[i].classList.toggle('active');
    let dropdownContent = dropdowns[i].nextElementSibling;
    if (dropdownContent.style.display == 'block')
      dropdownContent.style.display = 'none';
    else dropdownContent.style.display = 'block';
  });
}
