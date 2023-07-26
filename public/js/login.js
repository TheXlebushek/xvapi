document.getElementById('loginButton').onclick = async () => {
  document.getElementById('loginButton').disabled = true;
  localStorage.removeItem('uuid');

  const response = await fetch(`/xvapi/user/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      login: document.querySelector('#loginInput').value,
      password: document.querySelector('#passwordInput').value,
    }),
  });
  if (response.ok) {
    localStorage.setItem('uuid', await response.text());
    document.location.reload();
    return;
  }
  document.getElementById('loginInput').style.backgroundColor = '#ff014980';
  document.getElementById('passwordInput').style.backgroundColor = '#ff014980';
  document.getElementById('loginButton').disabled = true;
};

document.addEventListener('keypress', (e) => {
  if (e.key == 'Enter' && !document.getElementById('loginButton').disabled)
    document.getElementById('loginButton').click();
});

if (localStorage.getItem('uuid')) {
  document.location = '/store';
}
