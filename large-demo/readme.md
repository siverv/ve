

## A rather large demo of Vé

This larger demonstration is meant to showcase the use of Vé throughout a 'real' application. The application in question is consists of a simple form to create items, a list of available items, and another form to edit and/or delete items. The 'database' is just a json file found at `db/items.json`. At the bottom of each page, you will find a link which states `show source`, which allows you to view the most central part of the source for the current page.

This demo was used to ensure that there are no sudden problems with the `koa-ve`-package as published on npm. Only fault found so far was a lack of support for `ctx.redirect`

`npm i && npm start` starts the server at `localhost:3000`

