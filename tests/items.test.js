process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");

let items = require("../fakeDb");

let gum = { name: "Gum", price: 1.75 };

beforeEach(function () {
    items.push(gum);
});

afterEach(function () {
    items.length = 0;
});

/*--------------------------------------------------
/  GET: all items from /cats route
/  Returns: `{items: [name:...,price:...]}` 
/--------------------------------------------------*/
describe("GET /items", function () {
    test("Gets the list of shopping items", async function () {
        const resp = await request(app).get(`/items`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({ items: [gum] });
    });
});

/*--------------------------------------------------
/  GET: specific item from /items/[name] route
/  Returns: `{foundItem: [name:...,price:...]}` 
/--------------------------------------------------*/
describe("GET /items/:name", function () {
    test("Gets specific item from shopping list", async function () {
        const resp = await request(app).get(`/items/${gum.name}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({ foundItem: gum });
    });

    test("Responds with 404 if app can't find item", async function () {
        const resp = await request(app).get(`/items/lollipop`);
        expect(resp.statusCode).toBe(404);
    });
});

/*--------------------------------------------------
/  POST: adds new item with name and price to items
/  Returns: `{ added: [name:...,price:...]}`
/--------------------------------------------------*/
describe("POST /items", function () {
    test("Creates a new item in shopping items", async function () {
        const resp = await request(app)
            .post(`/items`)
            .send({
                name: "lollipop",
                price: 1.50
            });
        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual({
            added: { item: { name: "lollipop", price: 1.50 } }
        });
    });
});

/*--------------------------------------------------
/  PATCH: updates specific item with name and price to items
/  Returns: `{ updated: [name:...,price:...]}`
/--------------------------------------------------*/
describe("PATCH /items/:name", function () {
    test("Updates specific item", async function () {
        const resp = await request(app)
            .patch(`/items/${gum.name}`)
            .send({
                name: "chewing gum"
            });
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            updated: { item: { name: "chewing gum", price: 1.75 } }
        });
    });

    test("Responds with 404 if item invalid", async function () {
        const resp = await request(app).patch(`/items/lollipop`);
        expect(resp.statusCode).toBe(404);
    });
});

/*--------------------------------------------------
/  DELETE: deletes specific item from shopping list
/  Returns: `{ message: Deleted}`
/--------------------------------------------------*/
describe("DELETE /items/:name", function () {
    test("Deletes a single a item", async function () {
        const resp = await request(app).delete(`/items/${gum.name}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({ message: "Deleted" });
    });
});