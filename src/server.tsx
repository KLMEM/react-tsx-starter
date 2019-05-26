﻿import * as express from 'express';
import * as errorHandler from 'errorhandler';
import * as http from 'http';
import * as path from 'path';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router';

import MainPage from './pages/MainPage';
import { RouteMap } from './app/routes';
import store from './app/store';

const app = express();

app.set('port', process.env.PORT || 3000);

const env = process.env.NODE_ENV || 'development';
let min = true;

if ('development' === env) {
    console.log('Running in development mode');
    app.use(errorHandler());
    min = false;
}

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    const content = ReactDOMServer.renderToString(
        <Provider store={store}>
            <StaticRouter location={req.url} context={{}}><RouteMap/></StaticRouter>
        </Provider>
    );

    const html = ReactDOMServer.renderToString(
        <MainPage content={content} min={min} preloadedState={store.getState()} />
    );

    res.send('<!DOCTYPE html>\r\n' + html);
});

http.createServer(app).listen(app.get('port'), () => {
    console.log('Express server listening on port ' + app.get('port'));
});
