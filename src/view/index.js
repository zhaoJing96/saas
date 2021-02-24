import React, { Fragment } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
// import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
//全局顶层模块
import { PageNoFind } from '@/view/exception/404';
import { Error } from '@/view/exception/error';
import Main from '@/view/main/index.jsx';
import HomeRouterWapper from '@/view/home';

export default function View() {
    return <Fragment>
        <Router>
            <Switch>
                <Route exact path="/" component={Main} />
                <Route path="/home">
                    <HomeRouterWapper>
                        {/* 首页默认加载成员管理 */}
                        <Switch>
                            {/* 默认页面 */}
                            {/* <Route exact path="/home" component={user.currentModule} render={() => {
                                return <Redirect to={user.currentPath} />;
                            }}></Route> */}
                            {/* home页面 */}
                            <Route component={PageNoFind} />
                        </Switch>
                    </HomeRouterWapper>
                </Route>
                <Route path="/error" component={Error} />
                <Route component={PageNoFind} />
            </Switch>
        </Router>
    </Fragment>;
}
