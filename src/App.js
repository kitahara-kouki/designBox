import React, { Fragment } from 'react';
import { Route, Switch, useLocation } from "react-router-dom";
import Top from './components/pages/Top';
import DesignIndex from './components/pages/designs/Index';
import DesignShow from './components/pages/designs/Show';
import DesignRegister from './components/pages/designs/Register';
import Auth from './components/pages/auth/Auth';
import User from './components/pages/auth/User';
import UserShow from './components/pages/users/Show';
import GenericTemplate from './components/templates/GenericTemplate';
// import * as H from 'history';

export default function App() {
    const location = useLocation();
    const background = location.state?.background;

    return (
        <Switch>
            <Route path="/designs/show/:id" component={DesignShow} exact />
            <GenericTemplate>
                <Switch location={background || location}>
                    <Route path="/" component={Top} exact />
                    <Route path="/designs/category/:category_id" render={(props) => (<DesignIndex key={props.match.params.category_id} {...props} />)} exact />
                    <Route path="/users/show/:id" render={(props) => (<UserShow key={props.match.params.id} {...props} />)} exact />
                    <Route path="/designs/register" component={DesignRegister} exact />
                </Switch>
                <Route path="/login" component={Auth} exact />
            </GenericTemplate>
        </Switch>
    );
}
