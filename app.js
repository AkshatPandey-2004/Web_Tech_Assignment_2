const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express();
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: true }));
// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
const userSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    username: String,
    password: String
    
}, { collection: 'registration' });

const User = mongoose.model('User', userSchema);
mongoose.connect('mongodb+srv://test:test1234@cluster0.wnlpm9j.mongodb.net/web_tech?retryWrites=true&w=majority&appName=Cluster0', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
}).then(() => {
  console.log('Connected to database');
}).catch((err) => {
  console.error('Error connecting to MongoDB Atlas:', err.message);
});

app.post('/register', async (req, res) => {
    const { fullname, email, username, password } = req.body;
    try {
      const newUser = new User({ fullname, email, username, password });
      await newUser.save();
      res.redirect('/');
      
    } catch (err) {
      console.error('Error saving user:', err.message);
      res.redirect('/');
    }
  });

app.get("/", (req, res) => {
    res.render('index');
});

app.get("/Homepage", (req, res) => {
    res.render('Homepage');
});

app.get("/Login", (req, res) => {
    res.render('Login');
}); 

app.get("/register", (req, res) => {
    res.render('register');
});

app.get("/index2", (req, res) => {
    res.render('register');
});



// Handle POST request for registration
app.post("/register", (req, res) => {
    console.log(req.body);
    const { name, email, password, country } = req.body;

    const newUser = new User({
        name,
        email,
        password,
        country
    });

    newUser.save()
        .then(() => {
            res.send("User registered successfully");
        })
        .catch((err) => {
            console.error("Error registering user:", err);
            res.status(500).send("Error registering user");
        });
});

// Handle POST request for login
app.post("/login", (req, res) => {
    const { name, password } = req.body;

    // Find user in the database based on username and password
    User.findOne({ name, password })
        .then((user) => {
            if (user) {
                // User found, authentication successful
                req.session.user = user;
                res.render("profile", { user: user });
            } else {
                // User not found or invalid credentials
                res.status(401).send("Invalid username or password");
            }
        })
        .catch((err) => {
            console.error("Error logging in:", err);
            res.status(500).send("Error logging in");
        });
});
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});