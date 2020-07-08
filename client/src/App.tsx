import { hot } from 'react-hot-loader';
import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { setCSRF } from './actions/utils/config';

import Sidebar from './components/sidebar';
import { navigation } from './utils/navigation';

import retry from './utils/retry';

const Home = React.lazy(() => retry(() => import('./routes/home')));
const NotFound = React.lazy(() => retry(() => import('./routes/notFound')));
const Login = React.lazy(() => retry(() => import('./routes/login')));
const Settings = React.lazy(() => retry(() => import('./routes/settings')));
const Account = React.lazy(() => retry(() => import('./routes/account')));
const Messaging = React.lazy(() => retry(() => import('./routes/messaging')));
const Find = React.lazy(() => retry(() => import('./routes/find')));
const Verification = React.lazy(() =>
  retry(() => import('./routes/verification'))
);
const ResetPassword = React.lazy(() =>
  retry(() => import('./routes/resetPassword'))
);

const logo = JSON.stringify({
  bucket: 'playmayte-images',
  key: `resources/PLAYMAYTE_clear_background.png`,
  edits: {
    grayscale: true,
  },
});

const CloudFrontUrl = 'https://d296x3mmma60gj.cloudfront.net';

export const logoUrl = `${CloudFrontUrl}/${btoa(logo)}`;

class App extends React.Component<{}, {}> {
  async componentDidMount() {
    await setCSRF();
  }

  render() {
    return (
      <div>
        <BrowserRouter>
          <div className='App bg-darkShade min-h-screen assistant-font'>
            <React.Suspense
              fallback={
                <div
                  className='grid grid-cols-1 content-center'
                  style={{
                    minHeight: '100vh',
                    background: '#dedede',
                    backgroundImage:
                      'linear-gradient(90deg, #efd5ff 0%, #515ada 100%)',
                  }}>
                  <div className='container'>
                    <div className='container content-center'>
                      <div className='col-md-12 text-center assistant-font text-lg'>
                        <span>...Loading</span>
                        <div className='mx-auto'>
                          <div className='lds-roller'>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }>
              <Sidebar brand={navigation.brand} links={navigation.links} />
              {/* can add and error modal in here also */}
              <div className='body'>
                <Switch>
                  <Route exact path='/find' component={Find} />
                  <Route path='/messaging' component={Messaging} />
                  <Route exact path='/account' component={Account} />
                  <Route path='/settings' component={Settings} />
                  <Route exact path='/verification' component={Verification} />
                  <Route exact path='/reset' component={ResetPassword} />
                  <Route exact path='/login' component={Login} />
                  <Route exact path='/' component={Home} />
                  <Route path='*' component={NotFound} />
                </Switch>
              </div>
            </React.Suspense>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default hot(module)(App);
