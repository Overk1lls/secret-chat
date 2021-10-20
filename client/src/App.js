import Form from './pages/form/form';
import Chat from './pages/chat/chat';
// import useToken from './hooks/useToken';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  // const { token, setToken } = useToken();

  // if (!token) {
  //   return <Form setToken={setToken} />
  // }

  return (
    <div className="container">
      <Router>
        <Switch>
          <Route path='/:chatId' component={Chat} />
          <Route exact path='/' component={Form} />
          {/* <Redirect to={'/' + token} /> */}
        </Switch>
      </Router>
    </div>
  );
}

export default App;
