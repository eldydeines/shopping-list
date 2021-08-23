/*-------------------------------------------
/
/       Shopping Items Routes
/
/-------------------------------------------*/


const express = require("express");
const router = new express.Router();
const { ExpressError } = require("../expressError");
const items = require("../fakeDb");


//Will render a list of all shopping items
router.get("/", function (req, res) {
    return res.json({ items })
})

//Will post a new item to the shopping items list
router.post("/", function (req, res) {
    try {
        if (!req.body.name || !req.body.price) {
            throw new ExpressError("Name and price are required", 400);
        }
        const newItem = { name: req.body.name, price: +req.body.price };
        items.push(newItem)
        return res.status(201).json({ added: { item: newItem } });
    } catch (e) {
        return next(e);
    };
});

router.get("/:name", function (req, res) {
    const foundItem = items.find(item => item.name === req.params.name);
    if (foundItem === undefined) {
        throw new ExpressError("Shopping item not found", 404);
    }
    res.json({ foundItem });
});

router.patch("/:name", function (req, res) {
    const foundItem = items.find(item => item.name === req.params.name);
    if (foundItem === undefined) {
        throw new ExpressError("Shopping item not found", 404);
    }
    if (req.body.name) {
        foundItem.name = req.body.name;
    }
    if (req.body.price) {
        foundItem.price = req.body.price;
    }
    res.json({ updated: { item: foundItem } });
})

router.delete("/:name", function (req, res) {
    const foundItem = items.findIndex(item => item.name === req.params.name)
    if (foundItem === -1) {
        throw new ExpressError("Shopping item not found", 404)
    }
    items.splice(foundItem, 1);
    res.json({ message: "Deleted" });
});


module.exports = router;