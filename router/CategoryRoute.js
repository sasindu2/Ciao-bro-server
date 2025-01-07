const express = require('express');

const { getAllCategory,createCategory,updatecategory,deletecategory } = require("../controller/CategoryController");

const router = express.Router();

// Routes
router.get('/', getAllCategory);
router.post('/', createCategory);
router.patch('/:id', updatecategory);
router.delete('/:id', deletecategory);


module.exports = router;
