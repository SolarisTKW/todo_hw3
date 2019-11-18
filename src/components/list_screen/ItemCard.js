import React from 'react';
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
  } from "shards-react";

import{ Button, Icon } from 'react-materialize';

class ItemCard extends React.Component {
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleOver = this.handleOver.bind(this);
        this.handleLeave = this.handleLeave.bind(this);

        this.state = {dropdownOpen: false};
    }

    handleCompleted = () =>
    {   
        const {item} = this.props;
        if(item.completed)
            return "Completed";
        else
            return "Pending";
    }

    handleCompletedColor = () =>
    {
        const str = "card-content col s4";
        const {item} = this.props;
        if(item.completed)
            return "green-text " + str;
        else
            return "red-text " + str;
    }

    toggle = (e) => {
        e.preventDefault();
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
          }));
    }

    handleOver = () => {
        this.setState({dropdownOpen: true});
    }

    handleLeave = () => {
        this.setState({dropdownOpen: false});
    }

    handleUp = (e) => {
        e.preventDefault();
        this.props.handleMoveUp(this.props.item.key);
    }

    handleDown = (e) => {
        e.preventDefault();
        this.props.handleMoveDown(this.props.item.key);
    }

    handleDelete = (e) => {
        e.preventDefault();
        this.props.handleDeleteItem(this.props.item.key);
    }

    handleTest = (e) => {
        e.preventDefault();
        console.log(this.props.item.id + "\n" + this.props.item.key);
    }

    render() {
        const item  = this.props.item;  
        return (
            <div className="card z-depth-0 todo-list-link pink-lighten-3">

                <div className="card-content grey-text text-darken-3">
                    <span className="card-title black-text">{item.description}</span>
                    <div className="row">
                        <div className="card-content col s4">{"Assigned To: " + item.assigned_to}</div>

                        <div className="card-content col s4">{"Due Date: " + item.due_date}</div>

                        <div className={this.handleCompletedColor()}>{this.handleCompleted()}</div>

                        <Button
                          floating
                          fab={{direction: 'right'}}
                          className="blue"
                          large
                          style={{left: '23px'}}
                        >
                        <Button floating icon={<Icon>clear</Icon>} className="red" onClick={this.handleDelete}/>
                        <Button floating icon={<Icon>arrow_downward</Icon>} className="purple" onClick={this.handleDown}/>
                        <Button floating icon={<Icon>arrow_upward</Icon>} className="green" onClick={this.handleUp}/>
                        </Button>

                    </div>
                    <div className="divider"></div>
                </div>

            </div>
        );
    }
}
export default ItemCard;