import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import ItemCard from './ItemCard';
import { firestoreConnect } from 'react-redux-firebase';

class ItemsList extends React.Component {
    render() {
        const todoList = this.props.todoList;
        const items = todoList.items;
        // console.log("ItemsList: todoList.id " + todoList.id);
        return (
            <div className="todo-lists section">
                <div className="section">
                    <div className="row">
                        <a className="center-align waves-effect waves-teal btn-flat col s3" onClick={this.props.handleSortTask}>Task</a>
                        <a className="center-align waves-effect waves-teal btn-flat col s3" onClick={this.props.handleSortDueDate}>Due Date</a>
                        <a className="center-align waves-effect waves-teal btn-flat col s3" onClick={this.props.handleSortCompleted}>Completed</a>
                        <div className="col s2"></div>
                        </div>
                    <div className="divider"></div>
                </div>
                {items && items.map(item => {
                    item.id = item.key;
                    return(
                        <Link to={'/todoList/' + todoList.id + '/' + item.id} id = { todoList.id } key={item.id}>
                            <ItemCard 
                                todoList={todoList}
                                item={item} 
                                handleMoveUp = {this.props.handleMoveUp} 
                                handleMoveDown = {this.props.handleMoveDown} 
                                handleDeleteItem = {this.props.handleDeleteItem}
                            />
                        </Link>    
                        );
                    })
                }
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const todoList = ownProps.todoList;
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
)(ItemsList);