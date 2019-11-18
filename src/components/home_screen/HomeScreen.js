import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { NavLink, Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import TodoListLinks from './TodoListLinks'
import { getFirestore } from 'redux-firestore';

class HomeScreen extends Component {
state = {
    
}

registerRecent = (id) => {
    const fireStore = getFirestore();
    const collection = fireStore.collection('todoLists').doc(id);
    const x = new Date();

    collection.update({
        time: x.getTime()
    })
}

handleNewList = () => {
    const fireStore = getFirestore();
    const collection = fireStore.collection('todoLists');
    const x = new Date();
    collection.add({
        name: "Unnamed",
        owner: "No owner",
        time: x.getTime(),
        items: [],
    });
}
    render() {
        if (!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }

        return (
            <div className="dashboard container">
                <div className="row">
                    <div className="col s12 m4">
                        <TodoListLinks handleRegister={this.registerRecent}/>
                    </div>

                    <div className="col s8">
                        <div className="banner">
                            @todo<br />
                            List Maker
                        </div>
                        
                        <div className="center-align home_new_list_container">
                                <button className="home_new_list_button" onClick={this.handleNewList}>
                                    Create a New To Do List
                                </button>
                        </div>
                    </div>
                </div>
                
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        todoLists: state.firestore.ordered.todoLists,
        auth: state.firebase.auth
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
      { collection : 'todoLists' , orderBy: ['time', 'desc'] },
    ]),
)(HomeScreen);

// collection : 'todoLists' , orderBy: ['time', 'desc']  