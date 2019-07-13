import React, { Component } from 'react';
import axios from 'axios';

export const ItemContext = React.createContext();

export class ItemProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentFilter: 'all', // all, active, completed
            todoItems: [],
            filteredItems: [],
            checkAll: false //true or false
        };
    }

    async addNewItem(item) {
        await this.setState({
            todoItems: this.state.todoItems.concat(item)
        });
    }

    getAllItems() {
        return axios
            .get('https://todo-items-api.herokuapp.com/items')
            .then(res => res.data)
            .catch(err => console.log(err));
    }

    componentDidMount() {
        const todosApp = this;
        this.getAllItems().then(items => {
            todosApp.setState({
                todoItems: items,
                filteredItems: items
            });
        });
    }

    render() {
        return (
            <ItemContext.Provider
                value={{
                    state: this.state,
                    addNewItem: this.addNewItem.bind(this)
                }}
            >
                {this.props.children}
            </ItemContext.Provider>
        );
    }
}
