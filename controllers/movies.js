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
  Movie.find()
    .then((movie) => {
      res.status(200).send(movie);
    })
    .catch(() => {
      next(new DefaultError('Ошибка сервера'));
    });
};

// function likeCard(req, res, next) {
//   Card.findByIdAndUpdate(
//     req.params.cardId,
//     { $addToSet: { likes: req.user._id } },
//     { new: true },
//   )
//     .then((card) => {
//       if (!card) {
//         next(new NotFoundError('Card not found'));
//       } else {
//         res.status(200).send(card);
//       }
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new BadRequestError('неправильный запрос'));
//       } else {
//         next(new DefaultError('Ошибка сервера'));
//       }
//     });
// }

// function dislikeCard(req, res, next) {
//   Card.findByIdAndUpdate(
//     req.params.cardId,
//     { $pull: { likes: req.user._id } },
//     { new: true },
//   )
//     .then((card) => {
//       if (!card) {
//         next(new NotFoundError('Card not found'));
//       } else {
//         res.status(200).send(card);
//       }
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new BadRequestError('неправильный запрос'));
//       } else {
//         next(new DefaultError('Ошибка сервера'));
//       }
//     });
// }

async function deleteMovie(req, res, next) {
  try {
    const { cardId } = req.params;
    const userId = req.user._id;
    const movie = await Movie.findById(cardId);
    if (!movie) {
      throw new NotFoundError('Карточки не существует');
    }
    if (movie.owner.toString() !== userId) {
      throw new ForbiddenError('Вам нельзя удалить эту карточку');
    }
    const deletedMovie = await Movie.deleteOne(movie);
    if (!deletedMovie) {
      throw new NotFoundError('Карточки не существует');
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
