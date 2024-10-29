const express = require('express');
const { getAllShows, getShowById, addShow } = require('./helper');
const { title } = require('process');
const app = express();
app.use(express.json());

//Exercise 1: Get All Shows
//API Call: http://localhost:3000/shows

app.get('/shows', async (req, res) => {
  const shows = await getAllShows();

  res.json({ shows });
});

//Exercise 2: Get Show by ID
//API Call: http://localhost:3000/shows/1

app.get('/shows/:id', async (req, res) => {
  const show = await getShowById(parseInt(req.params.id));

  if (!show) {
    return res.status(404).json({ message: 'No show found.' });
  }

  res.json({ show });
});

//Exercise 3: Add a New Show
//API Call: http://localhost:3000/shows

function validateShows(show) {
  if (!show.title && typeof show.title !== 'string') {
    return 'title is required and should be string';
  }
  if (!show.theatreId && typeof show.theatreId !== 'number') {
    return 'theatreId is required and should be number';
  }
  if (!show.time && typeof show.time !== 'string') {
    return 'time is required and should be string';
  }
  return null;
}

app.post('/shows', async (req, res) => {
  let newShow = req.body;
  const error = validateShows(newShow);

  if (error) {
    return res.status(400).send(error);
  }
  const addedShow = await addShow(newShow);

  res.status(201).json(addedShow);
});

module.exports = { app };
