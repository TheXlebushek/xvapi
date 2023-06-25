document.getElementById('loginButton').onclick = async () => {
  sessionStorage.removeItem('uuid');
  const response = await fetch('/xvapi/user/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      login: document.querySelector('#loginInput').value,
      password: document.querySelector('#passwordInput').value,
    }),
  });
  if (response.ok) {
    sessionStorage.setItem('uuid', await response.text());
    document.location.reload();
    return;
  }
  document.getElementById('loginInput').style.backgroundColor = '#ff014980';
  document.getElementById('passwordInput').style.backgroundColor = '#ff014980';
};

document.addEventListener('keypress', (e) => {
  if (e.key == 'Enter') document.getElementById('loginButton').click();
});

if (sessionStorage.getItem('uuid')) {
  document.location = '/store';
}
