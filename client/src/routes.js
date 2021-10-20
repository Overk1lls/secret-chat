import React from 'react';
import { Switch, Route } from 'react-router-dom';

const useRoutes = isAuth => {
    if (isAuth) {
        return (
            <Switch>
                <Route></Route>
            </Switch>
        );
    }
};