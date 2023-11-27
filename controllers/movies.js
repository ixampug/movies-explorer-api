/* eslint-disable no-underscore-dangle */
const Movie = require('../models/movie');
const {
  NotFoundError, BadRequestError, ForbiddenError, DefaultError,
} = require('../errors/errors');

const createMovie = (req, res, next) => {
  const {
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,

  })
    .then((movie) => {
      res.status(201).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка валидации'));
      } else {
        next(new DefaultError('Ошибка сервера'));
      }
    });
};

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movie) => {
      res.status(200).send(movie);
    })
    .catch(() => {
      next(new DefaultError('Ошибка сервера'));
    });
};

async function deleteMovie(req, res, next) {
  try {
    const { movieId } = req.params;
    const userId = req.user._id;
    const movie = await Movie.findById(movieId);
    if (!movie) {
      throw new NotFoundError('Фильма не существует');
    }
    if (movie.owner.toString() !== userId) {
      throw new ForbiddenError('Вам нельзя удалить этот фильм');
    }
    const deletedMovie = await Movie.deleteOne(movie);
    if (!deletedMovie) {
      throw new NotFoundError('Фильма не существует');
    }
    res.status(200).send({ data: deletedMovie });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createMovie,
  getMovies,
  deleteMovie,
};
