import React, { Component } from "react";
import { ListGroup, ListGroupItem, Button, Container } from "reactstrap";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { connect } from "react-redux";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Input,
} from "reactstrap";
import PropTypes from "prop-types";

import { getItems, deleteItem, editItem } from "../actions/itemActions";

class ShoppingList extends Component {
  state = {
    modal: false,
    _id: null,
    name: "",
  };

  componentDidMount() {
    this.props.getItems();
  }

  onDelete = id => this.props.deleteItem(id);
  toggle = () => this.setState({modal: !this.state.modal, editValue: ""});
  onChange = e => this.setState({ [e.target.name]: e.target.value });

  onSubmit = e => {
    e.preventDefault();
    const newItem = {
      _id: this.state._id,
      name: this.state.name,
    };

    this.props.editItem(newItem);

    //Reset back State
    this.setState({
      modal: !this.state.modal,
      _id: null,
      name: "",
    });

    //Recall GET request to refresh all items
    this.props.getItems();
  };

  onClick = ({ _id, name }) => {
    this.setState({
      modal: !this.state.modal,
      _id: _id,
      name: name,
    });
  };

  render() {
    const { items } = this.props.item;
    return (
      <div>
        <Container>
          <Modal isOpen={this.state.modal} toggle={this.toggle}>
            <ModalHeader toggle={this.toggle}> Edit Item </ModalHeader>
            <ModalBody>
              <Form onSubmit={this.onSubmit}>
                <FormGroup>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    placeholder={this.state.name}
                    onChange={this.onChange}
                  />
                </FormGroup>
                <Button color="dark" style={{ marginBottom: "2rem" }} block>
                  Edit Item
                </Button>
              </Form>
            </ModalBody>
          </Modal>

          {/* SHOPPING LIST SECTION */}
          <ListGroup>
            <TransitionGroup className="shopping-list">
              {items.map(({ _id, name }) => (
                <CSSTransition key={_id} timeout={500} classNames="fade">
                  <ListGroupItem>
                    {name}
                    <Button
                      className="remove-btn float-right"
                      size="sm"
                      color="info"
                      onClick={this.onClick.bind(this, { _id, name })}
                      title='Edit Item'
                    >
                      &#x2630;
                    </Button>
                    <Button
                      className="remove-btn float-right mr-2"
                      size="sm"
                      color="danger"
                      onClick={this.onDelete.bind(this, _id)}
                      title='Delete Item'
                    >
                      &times;
                    </Button>
                  </ListGroupItem>
                </CSSTransition>
              ))}
            </TransitionGroup>
          </ListGroup>
        </Container>
      </div>
    );
  }
}

ShoppingList.propTypes = {
  getItems: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
  editItem: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  item: state.item,
});

export default connect(mapStateToProps, { getItems, deleteItem, editItem })(ShoppingList);