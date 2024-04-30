import express from 'express';
import authController from '../controllers/authController.js';
import toDoController from '../controllers/toDoController.js';

const { protect } = authController;
const router = express.Router();


//for these routes, you have to login
router.use(protect)
// route for getting result of login user by id
router.get('/', toDoController.getList);
router.post('/', toDoController.setToDo);
router.delete('/:id', toDoController.deleteToDo);
router.patch('/:id', toDoController.updateToDo);


export default router;