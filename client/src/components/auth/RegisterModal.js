import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  NavLink,
  Alert
} from "reactstrap";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import {register} from '../../actions/authActions';
import {clearError} from '../../actions/errorActions';


class RegisterModal extends Component {
  state = {
    modal: false,
    name: "",
    email: '',
    password: '',
    msg: null
  };

  static propTypes = {
      isAuthenticated: PropTypes.bool,
      error: PropTypes.object.isRequired,
      register: PropTypes.func.isRequired,
      clearError: PropTypes.func.isRequired
  }

  componentDidUpdate(prevProps) {
    const {error, isAuthenticated} = this.props;
    if(error !== prevProps.error){
      //Check for register error
      if(error.id === 'REGISTER_FAIL'){
        this.setState({msg: error.msg.msg})
      }
      else {
        this.setState({ msg: null })
      }
    }

    if(this.state.modal){
      if(isAuthenticated){
        this.toggle();
      }
    }
  }

  toggle = () => {
    this.props.clearError();
    this.setState({modal: !this.state.modal})
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value })

  onSubmit = (e) => {
    e.preventDefault();
    const {name, email, password} = this.state;

    //Create an User object
    const newUser = {
      name, email, password
    };
    this.props.register(newUser)
  };

  render() {
    return (
      <div>
        <NavLink onClick={this.toggle} href='#'>
            Register
        </NavLink>

        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Create an Account</ModalHeader>
          <ModalBody>
            { this.state.msg ? <Alert color='danger'>{ this.state.msg }</Alert> : null }
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <Label for='name'><strong>Name</strong></Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  className='mb-2'
                  onChange={this.onChange}
                />
                <Label for='email'><strong>Email</strong></Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  className='mb-2'
                  onChange={this.onChange}
                />
                <Label for='password'><strong>Password</strong></Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  className='mb-2'
                  onChange={this.onChange}
                />
              </FormGroup>
              <Button color="dark" style={{ marginBottom: "2rem" }} block>
                Register
              </Button>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error
});

export default connect(mapStateToProps, {register, clearError})(RegisterModal);
