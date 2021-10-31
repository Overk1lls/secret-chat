import Form from './pages/form/form';
import Chat from './pages/chat/chat';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const chatId = localStorage.getItem('chatId');

  if (!chatId) {
    return <Form />;
  }

  return (
    <div>
      <Router>
        <Switch>
          <Route path='/:chatId'>
            <Chat />
          </Route>
          <Redirect to={'/' + chatId} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
