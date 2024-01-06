const Movie = require('../models/movie');

const ErrorBadRequest = require('../errors/errorBadRequest');
const ErrorForbidden = require('../errors/errorForbidden');
const ErrorNotFound = require('../errors/errorNotFound');

const getMovie = (req, res, next) => {
  const { _id } = req.user;

  Movie.find({ owner: _id })
    .then((movie) => res.send(movie))
    .catch(next);
};

const saveMovie = (req, res, next) => {
  const {
    country,
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
    country,
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
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new ErrorBadRequest(
            `неверный запрос: ${err}`,
          ),
        );
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .orFail(() => new ErrorNotFound('фильм не найден'))
    .then((movie) => {
      if (movie.owner.toString() === req.user._id) {
        movie
          .deleteOne(movie)
          .then(() => res.send(movie))
          .catch(next);
      } else {
        throw new ErrorForbidden('вы не можете удалить этот филь');
      }
    })
    .catch(next);
};

module.exports = {
  getMovie,
  saveMovie,
  deleteMovie,
};
