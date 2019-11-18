import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { NavLink, Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';
import {FormInput} from 'shards-react';
import {DatePicker} from 'shards-react';

class ItemScreen extends Component {

state = {
    description: "",
    assigned_to: "",
    due_date: "",
    completed: false,
}

handleChange = (e) => {
    const { target } = e;
    this.setState(state => ({
        ...state,
        [target.id]: target.value,
    }));
}

handleChecked = (e) => {
    const { target } = e;
    this.setState(state => ({
        ...state,
        [target.id]: target.checked,
    }));
}

handleSubmit = (e) => {
    e.preventDefault();

    const todoItem = this.props.todoItem;
    todoItem.key = this.props.todoItem.key;
    todoItem.id = todoItem.key;

    if(this.state.description !== "")
        todoItem.description = this.state.description;
    if(this.state.assigned_to !== "")
        todoItem.assigned_to = this.state.assigned_to;
    if(this.state.due_date !== "")
        todoItem.due_date = this.state.due_date;
    todoItem.completed = this.state.completed;
    
    this.props.todoList.items[this.props.todoItem.key] = todoItem;

    const fireStore  = getFirestore();
    const collection = fireStore.collection('todoLists');
    const todoList = collection.doc(this.props.todoList.id)
    todoList.set({
        name: this.props.todoList.name,
        owner: this.props.todoList.owner,
        items: this.props.todoList.items,
    });

    this.props.history.push('/todoList/' + this.props.todoList.id);
}


    render() {
        const auth = this.props.auth;
        const todoItem = this.props.todoItem;
        
        if(!todoItem)
	        return <React.Fragment />;

        if (!auth.uid) {
            return <Redirect to="/login" />;
        }

        return (
            <form className="col s12 white" onSubmit={this.handleSubmit}>
                <h2 className="grey-text text-darken-3">Todo Item</h2>
                <div className="divider"></div>
                
                <div className="card">
                    <div className="card-content">
                        <div className="row white">
                            <label htmlFor="description">Description</label>
                            <FormInput className="active" type="text" name="description" id="description" placeholder={todoItem.description} onChange={this.handleChange} />
                        </div>

                        <div className="row white">
                            <label htmlFor="due_date">Due Date</label>
                            <FormInput type="date" className="validate" name="duedate" id="duedate" defaultValue={todoItem.due_date} onChange={this.handleChange}/>
                        </div>

                        <div className="row white">
                            <label htmlFor="assigned_to">Assigned To</label>
                            <FormInput className="active" type="text" name="assigned_to" id="assigned_to" placeholder={todoItem.assigned_to} onChange={this.handleChange} />
                        </div>

                        <div className="row white">
                            <div className="input-field">
                                <p>
                                <label>
                                    <input className="active" type="checkbox" name="completed" id="completed" defaultChecked={todoItem.completed} onChange={this.handleChecked}/>
                                    <span>Completed</span>
                                </label>
                                </p>
                            </div>
                        </div>

                        <div className="row white">
                            <button className="btn waves-effect waves-light" type="submit" name="action" >Submit
                                <i className="material-icons right">send</i>
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const id = ownProps.match.params.id;
    const key = ownProps.match.params.key
    const { todoLists } = state.firestore.data;
    const todoList = todoLists ? todoLists[id] : null;
    const todoItem = todoList ? todoList.items[key] : null;

    if(todoList)
	    todoList.id = id;
    if(todoItem)
        todoItem.key = key;

    return {
      todoList,
      todoItem,
      auth: state.firebase.auth,
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
      { collection: 'todoLists' },
    ]),
)(ItemScreen);