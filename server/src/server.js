require('dotenv').config();

const app = require('./app');
const projectStore = require('./data/projectStore');

const port = process.env.PORT || 5000;

async function startServer() {
  await projectStore.initializeStore();
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error('Unable to initialize PostgreSQL storage', error);
  process.exitCode = 1;
});
