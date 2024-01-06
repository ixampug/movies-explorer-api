const router = require('express').Router();

const { validateMoviePost, validateMovieId } = require('../middlewares/validate');

const {
  getMovie,
  saveMovie,
  deleteMovie,
} = require('../controllers/movie');

router.get('/', getMovie);
router.post('/', validateMoviePost, saveMovie);
router.delete('/:movieId', validateMovieId, deleteMovie);

module.exports = router;
