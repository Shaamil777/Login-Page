const express = require('express');
const session = require('express-session');
const nocache=require('nocache')
const app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname))
app.use(express.urlencoded({ extended: true }));
app.use(nocache())
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
}));



// Predefined username and password
const predefinedUser = { username: 'shamil', password: '6282' };

// Render the login page
app.get('/login', (req, res) => {
  if (req.session.user) {
    res.redirect('/home');
  } else {
    res.render('login', { error: null });
  }
  //res.render('login', { error: null });
});

// Handle login post request
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === predefinedUser.username && password === predefinedUser.password) {
    req.session.user = username;
    return res.redirect('/home');
  }

  // If login fails, re-render login page with error message
  res.render('login', { error: 'Incorrect username or password' });
});

// Render the home page if the user is logged in
app.get('/home', (req, res) => {
  if (req.session.user) {
    res.render('home');
  } else {
    res.redirect('/login');
  }
});

// Handle logout and destroy session
app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// Prevent caching for the home page to block back button after logout
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
