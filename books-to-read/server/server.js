<<<<<<< HEAD
import app from './app.js';

const PORT = process.env.PORT || 3000;

// app.listen(3000, () => console.log('Server is listening on port 3000'));
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
=======
import app from './app';

app.listen(3000, () => console.log('The server is listening on port 3000'))
>>>>>>> 933b70b (Add app.js functionality, add server.js functionality)
