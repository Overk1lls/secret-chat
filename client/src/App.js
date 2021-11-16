import Form from './components/auth/auth';
import Chat from './components/chat/chat';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const chatId = localStorage.getItem('chatId');

  if (!chatId) {
    return <div className="container"><Form /></div>;
  }

  return (
    <div className="container">
      <Router>
        <Switch>
          <Route path='/chat/:chatId'>
            <Chat />
          </Route>
          <Redirect to={'/chat/' + chatId} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;