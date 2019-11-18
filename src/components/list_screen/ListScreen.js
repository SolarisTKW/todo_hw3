import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import ItemsList from './ItemsList.js'
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';
import { FormInput, Button } from "shards-react";
import { Link } from 'react-router-dom';

class ListScreen extends Component {
    state = {
        name: '',
        owner: '',
        criteria: "",
    }
    //
    handleChange = (e) => {
        const fireStore  = getFirestore();

        const { target } = e;
        this.setState(state => ({
            ...state,
            [target.id]: target.value,
        }));

        console.log(target.id);
        if(target.id === "name"){
            this.props.todoList.name = target.value;
            fireStore.collection('todoLists').doc(this.props.todoList.id).set({
                name: target.value,
                owner: this.props.todoList.owner,
                time: this.props.todoList.time,
                items: this.props.todoList.items
            });
        }
        else{
            this.props.todoList.owner = target.value;
            fireStore.collection('todoLists').doc(this.props.todoList.id).set({
                name: this.props.todoList.name,
                owner: target.value,
                time: this.props.todoList.time,
                items: this.props.todoList.items
            });
        }

    }
    //
    handleClick = (e) => {
        const fireStore  = getFirestore();

        this.props.todoList.items.push(
            {
                key: this.props.todoList.items.length,
                description: "None",
                due_date: "2019-1-1",
                assigned_to: "No one",
                completed: false
            }
        );

        fireStore.collection('todoLists').doc(this.props.todoList.id).set({
            name: this.props.todoList.name,
            owner: this.props.todoList.owner,
            time: this.props.todoList.time,
            items: this.props.todoList.items,
        });
    }

    handleDeleteList = (e) => {
        const fireStore = getFirestore();
        fireStore.collection('todoLists').doc(this.props.todoList.id).delete();
    }

    handleSortTask = () => {
        if(this.state.criteria === "task increasing")
            this.setState({criteria: "task decreasing"});
        else
            this.setState({criteria: "task increasing"});

        this.handleSort();
    }

    handleSortDueDate = () => {
        if(this.state.criteria === "date increasing")
            this.setState({criteria: "date decreasing"});
        else
            this.setState({criteria: "date increasing"});

        this.handleSort();
    }

    handleSortCompleted = () => {
        if(this.state.criteria === "completed increasing")
            this.setState({criteria: "completed decreasing"});
        else
            this.setState({criteria: "completed increasing"});

        this.handleSort();
    }

    handleSort(){
        const criteria = this.state.criteria;
        const list = this.props.todoList;
        const newItems = list.items.sort(this.compare);
        for(let i = 0; i<newItems.length; i++)
        {
            newItems[i].id = i;
            newItems[i].key = i;
        }

        const fireStore = getFirestore();
        fireStore.collection('todoLists').doc(this.props.todoList.id).set({
            name: this.props.todoList.name,
            owner: this.props.todoList.owner,
            time: this.props.todoList.time,
            items: newItems
        });
    }

    compare = (item1, item2) => {
        const criteria = this.state.criteria;

        if (criteria === "task decreasing"
            || criteria === "date decreasing"
            || criteria === "completed decreasing") {
            let temp = item1;
            item1 = item2;
            item2 = temp;
        }
        // SORT BY ITEM DESCRIPTION
        if (criteria === "task decreasing"
            || criteria === "task increasing") {
            if (item1.description < item2.description)
                return -1;
            else if (item1.description > item2.description)
                return 1;
            else
                return 0;
        }
        // SORT BY DUE DATE
        else if (criteria === "date decreasing"
            || criteria === "date increasing") {
            let dueDate1 = item1.due_date;
            let dueDate2 = item2.due_date;
            let date1 = new Date(dueDate1);
            let date2 = new Date(dueDate2);
            if (date1 < date2)
                return -1;
            else if (date1 > date2)
                return 1;
            else
                return 0;
        }
        // SORT BY COMPLETED
        else {
            if (item1.completed < item2.completed)
                return -1;
            else if (item1.completed > item2.completed)
                return 1;
            else
                return 0;
        }
    }

    swap(key, upOrDown)
    {
        const item = this.props.todoList.items[key];
        let otherId = 0;
        if(upOrDown){
            otherId = parseInt(item.key) - 1;
            if(parseInt(item.key) === 0)
                return;
        }
        else{
            console.log(item.key);
            console.log(this.props.todoList.items.length-1);
            otherId = parseInt(item.key) + 1;
            if(parseInt(item.key) === this.props.todoList.items.length-1)
                return;
        }

        const fireStore = getFirestore();
        const list = this.props.todoList;
        const temp = item;
        const second = list.items[otherId];
        const tempKey = temp.key;
        const secondKey = second.key;

        //Swap
        //First Item = Second Item
        list.items[item.key] = list.items[otherId];
        //Second Item = copy of First Item
        list.items[otherId] = temp;

        //Swap Keys
        list.items[item.key].key = tempKey;
        list.items[otherId].key = secondKey;
    
        fireStore.collection('todoLists').doc(this.props.todoList.id).set({
            name: this.props.todoList.name,
            owner: this.props.todoList.owner,
            time: this.props.todoList.time,
            items: list.items
        });
    }

    //List item's moving
    handleMoveUp = (key) => {
        this.swap(key, true);
    }

    handleMoveDown = (key) => {
        this.swap(key, false);
    }

    handleDeleteItem = (key) => {
        const list = this.props.todoList;
        const newItems = list.items.filter(testItem =>
            testItem.key !== key
          );

        for(let i = 0; i<newItems.length; i++)
        {
            newItems[i].key = i;
            newItems[i].id = i;
        }

        const fireStore = getFirestore();
        fireStore.collection('todoLists').doc(this.props.todoList.id).set({
            name: this.props.todoList.name,
            owner: this.props.todoList.owner,
            time: this.props.todoList.time,
            items: newItems,
        });
    }

    render() {
        const auth = this.props.auth;
        const todoList = this.props.todoList;
        if (!auth.uid) {
            return <Redirect to="/" />;
        }

        if(!todoList)
	        return <React.Fragment />;

        return (
            <div className="container">

                <div className="row white">
                    
                    <div className="card-panel">
                        <h4 className="center-align grey-text text-darken-3">Todo List</h4>
                        <Link to="/">
                            <Button onClick={this.handleDeleteList} theme="danger">Delete List</Button>
                        </Link>
                    </div>
                    
                    <div className="card-panel">

                        <label htmlFor="name">Name</label>
                        <FormInput className="validate" type="text" name="name" id="name" onChange={this.handleChange} placeholder={todoList.name}/>

                        <label htmlFor="owner">Owner</label>
                        <FormInput className="validate" type="text" name="owner" id="owner" onChange={this.handleChange} placeholder={todoList.owner} />

                    </div>

                    <div className="card-panel col s10">
                        
                        <ItemsList todoList={todoList} 
                        handleMoveUp = {this.handleMoveUp} 
                        handleMoveDown = {this.handleMoveDown} 
                        handleDeleteItem = {this.handleDeleteItem}
                        handleSortTask = {this.handleSortTask}
                        handleSortDueDate = {this.handleSortDueDate}
                        handleSortCompleted = {this.handleSortCompleted}
                        />
                        <a className="right valign-wrapper btn-floating btn-large waves-effect waves-light red" onClick={this.handleClick} ><i className="material-icons">add</i></a>
                        
                    </div>
                    

                </div>
        
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.match.params;
  const { todoLists } = state.firestore.data;
  const todoList = todoLists ? todoLists[id] : null;
  if(todoList)
	todoList.id = id;

  return {
    todoList,
    auth: state.firebase.auth,
  };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
      { collection: 'todoLists' },
    ]),
)(ListScreen);