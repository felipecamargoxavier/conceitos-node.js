const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryID(request, response, next) {
  const { id } = request.params;

  if(!isUuid(id)) {
    return response.status(400).json({ erro: "ID nao valido."});
  }

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", validateRepositoryID, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => (repository.id == id));
  
  if(repositoryIndex < 0) {
    return response.status(400).json({ erro: "Repositorio nao encontrado."});
  }
  
  const newRepository = {
    id,
    title, 
    url, 
    techs, 
    likes: repositories[repositoryIndex].likes
  };

  repositories[repositoryIndex] = newRepository;

  return response.json(newRepository);
});

app.delete("/repositories/:id", validateRepositoryID, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => (repository.id == id));
  
  if(repositoryIndex < 0) {
    return response.status(400).json({ erro: "Repositorio nao encontrado."});
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateRepositoryID, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => (repository.id == id));
  
  if(repositoryIndex < 0) {
    return response.status(400).json({ erro: "Repositorio nao encontrado."});
  }

  repositories[repositoryIndex].likes++;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
