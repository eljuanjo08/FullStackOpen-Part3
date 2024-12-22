const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('dist'))

morgan.token("body", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});

const customFormat = ":method :url :status :response-time ms - :body";

app.use(morgan(customFormat));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const date = Date.now();
const today = new Date(date);

app.get("/", (request, response) => {
  response.send("<h1>Hola mundo</h1>");
});

app.get("/api/persons/", (request, response) => {
  response.send(persons);
});

app.get("/info", (request, response) => {
  console.log(date);
  response.send(
    `<p>
      Phonebook has info for ${persons.length} people<br/>
      ${today}
    </p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((p) => p.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

const generateId = () => {
  return Math.floor(Math.random() * 1000000);
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name && !body.number) {
    response.status(400).json({
      error: "content missingg"
    });
  } else if (persons.find((p) => p.name === body.name)) {
    response.status(400).json({
      error: 'name must be unique'
    });
  } else {
    const person = {
      id: generateId(),
      name: body.name,
      number: body.number,
    };

    persons = persons.concat(person);

    response.json(person);
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  console.log(id);
  persons = persons.filter((person) => person.id !== id);
  console.log(persons);

  response.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server running in port ${PORT}`);
});
