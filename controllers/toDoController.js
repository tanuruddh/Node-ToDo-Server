import ToDo from "../models/toDoModel.js";
import catchAsync from "../utils/catchAsnyc.js";

const getList = catchAsync(async (req, res, next) => {
    const list = await ToDo.find({ user: req.user.id });
    res.status(200).send({
        success: true,
        data: list
    })
})

const setToDo = catchAsync(async (req, res, next) => {
    const data = await ToDo.create({
        heading: req.body.heading,
        description: req.body.description,
        user: req.user.id,
    });
    res.status(200).send({
        success: true,
        data
    })
})

const deleteToDo = catchAsync(async (req, res, next) => {
    await ToDo.findByIdAndDelete(req.params.id);
    res.status(200).send({
        success: true,
        message: "ToDo deleted successfully"
    })
})

const updateToDo = catchAsync(async (req, res, next) => {
    const updateFields = {};

    if (req.body.heading) {
        updateFields.heading = req.body.heading;
    }

    if (req.body.description) {
        updateFields.description = req.body.description;
    }

    const data = await ToDo.findByIdAndUpdate(req.params.id, updateFields, { new: true });

    res.status(200).send({
        success: true,
        data
    })
})

export default {
    getList,
    setToDo,
    deleteToDo,
    updateToDo,
}