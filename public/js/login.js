document.getElementById('loginButton').onclick = async () => {
  document.getElementById('loginButton').disabled = true;
  sessionStorage.removeItem('uuid');
  let remember = false;
  if (document.getElementById('rememberInput').checked) remember = true;

  const query = '?' + (remember ? 'remember=true' : '');
  const response = await fetch(`/xvapi/user/auth${query}`, {
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
  document.getElementById('loginButton').disabled = true;
};

document.addEventListener('keypress', (e) => {
  if (e.key == 'Enter' && !document.getElementById('loginButton').disabled)
    document.getElementById('loginButton').click();
});

if (sessionStorage.getItem('uuid')) {
  document.location = '/store';
}
