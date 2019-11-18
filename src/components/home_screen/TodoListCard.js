import React from 'react';

class TodoListCard extends React.Component {
    handleRegister = () => {
        const {todoList} = this.props;
        this.props.handleRegister(todoList.id);
    }

    //
    
    render() {
        const { todoList } = this.props;
        // console.log("TodoListCard, todoList.id: " + todoList.id);
        return (
            <div className="card z-depth-0 todo-list-link">
                <div className="card-content grey-text text-darken-3">
                    <span className="card-title" onClick = {this.handleRegister}>{todoList.name}</span>
                </div>
            </div>
        );
    }
}
export default TodoListCard;