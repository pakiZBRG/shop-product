import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import ShoppingList from './components/ShoppingList';
import ItemModal from './components/ItemModal';
import {Container} from 'reactstrap';

import {Provider} from 'react-redux';
import store from './store';
import {loadUser} from './actions/authActions';


class App extends React.Component {
  componentDidMount(){
    store.dispatch(loadUser());
  }

  render(){
    return (
      <Provider store={store}>
        <div className="App">
          <Navbar />
          <Container>
            <ItemModal />
            <ShoppingList />
          </Container>
        </div>
      </Provider>
    );
  }
}

export default App;