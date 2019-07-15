import React, { Component } from 'react';
import axios from 'axios';
import axiosClient from '../components/axiosClient';

export const ItemContext = React.createContext();

export class ItemProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            todoItems: [],
            filteredItems: [],
            checkAll: false, //true or false
            currentFilter: 'all' // all, active, completed
        };
    }

    compareDate(a, b) {
        const dateA = a.createdAt.toLowerCase();
        const dateB = b.createdAt.toLowerCase();
        let comparison = dateA > dateB ? 1 : dateA < dateB ? -1 : 0;
        return comparison * -1;
    }

    isCheckAll(items) {
        for (let i in items) {
            if (!items[i].isCompleted) {
                return false;
            }
        }
        return true;
    }

    getAllItems() {
        return axiosClient
            .get('/')
            .then(res => {
                let fetchedItems = res.data.sort(this.compareDate);
                this.setState({
                    todoItems: fetchedItems,
                    checkAll: this.isCheckAll(fetchedItems)
                });
            })
            .catch(err => console.log(err));
    }

    handleSetTodoItems(newItems, checkAll = null, currentFilter = null) {
        this.setState({
            todoItems: newItems,
            filteredItems: this.itemsFilter(newItems, this.state.currentFilter),
            checkAll: checkAll !== null ? checkAll : this.state.checkAll,
            currentFilter: currentFilter
                ? currentFilter
                : this.state.currentFilter
        });
    }

    addNewItem(item) {
        axiosClient
            .post('/', item)
            .then(res => {
                let newItems = this.state.todoItems
                    .concat(res.data)
                    .sort(this.compareDate);
                this.handleSetTodoItems(
                    newItems,
                    null,
                    this.state.currentFilter === 'completed'
                        ? 'all'
                        : this.state.currentFilter
                );
            })
            .catch(err => console.log(err));
    }

    updateItem(id, updatedItem, isUpdated = false) {
        let newItems = this.state.todoItems.map(i =>
            i._id !== id ? { ...i } : { ...i, ...updatedItem }
        );
        this.handleSetTodoItems(newItems);
        if (isUpdated) {
            axiosClient
                .put(`/${id}`, { ...updatedItem })
                .then(res => res.data)
                .catch(err => console.log(err));
        }
    }

    deleteItem(id) {
        let newItems = this.state.todoItems.filter(item => item._id !== id);
        this.handleSetTodoItems(newItems);
        axiosClient
            .delete(`/${id}`)
            .then(res => {
                console.log(res.data);
            })
            .catch(err => console.log(err));
    }

    itemClicked(id) {
        let isItemCompleted = false;
        let newItems = this.state.todoItems.map(item => {
            if (item._id === id) {
                isItemCompleted = !item.isCompleted;
                return { ...item, isCompleted: isItemCompleted };
            }
            return { ...item };
        });
        this.handleSetTodoItems(newItems, this.countItemsLeft(newItems) === 0);
        axiosClient
            .put(`/${id}`, { isCompleted: isItemCompleted })
            .then(res => res.data)
            .catch(err => console.log(err));
    }

    itemDoubleClicked(id) {
        let doubleClickedItem = this.state.todoItems.find(
            item => item._id === id
        );
        if (!doubleClickedItem.readOnly || doubleClickedItem.isCompleted) {
            return;
        }
        let newItems = this.state.todoItems.map(i =>
            i !== doubleClickedItem ? { ...i } : { ...i, readOnly: false }
        );
        this.handleSetTodoItems(newItems);
    }

    itemCheckAll() {
        let itemsId = [];
        let checkedAllItems = this.state.todoItems.map(item => {
            itemsId.push(item._id);
            return { ...item, isCompleted: !this.state.checkAll };
        });
        this.handleSetTodoItems(checkedAllItems, !this.state.checkAll);
        axios
            .all(
                this.handleMultipleRequest(itemsId, 'update', {
                    isCompleted: !this.state.checkAll
                })
            )
            .then(resArr => [...resArr])
            .catch(err => console.log(err));
    }

    countItemsLeft(items) {
        let counter = 0;
        items.forEach(item => {
            if (!item.isCompleted) {
                counter++;
            }
        });
        return counter;
    }

    handleClearCompleted() {
        let completedIds = [];
        let unCompletedItems = this.state.todoItems.filter(item => {
            if (item.isCompleted) {
                completedIds.push(item._id);
                return null;
            } else return item;
        });

        this.setState({
            todoItems: unCompletedItems,
            filteredItems: this.itemsFilter(
                unCompletedItems,
                this.state.currentFilter
            )
        });

        axios
            .all(this.handleMultipleRequest(completedIds, 'delete'))
            .then(resArr => [...resArr])
            .catch(err => console.log(err));
    }

    handleMultipleRequest(itemsId, updateOrDelete, updatedValue = null) {
        let batchArr = [];
        itemsId.forEach(id => {
            switch (updateOrDelete) {
                case 'delete':
                    batchArr.push(axiosClient.delete(`/${id}`));
                    break;
                case 'update':
                    batchArr.push(axiosClient.put(`/${id}`, updatedValue));
                    break;
                default:
                    break;
            }
        });
        return batchArr;
    }

    handleShowAll() {
        this.setState({
            filteredItems: this.state.todoItems,
            currentFilter: 'all'
        });
    }

    handleShowActive() {
        this.setState({
            filteredItems: this.itemsFilter(this.state.todoItems, 'active'),
            currentFilter: 'active'
        });
    }

    handleShowCompleted() {
        this.setState({
            filteredItems: this.itemsFilter(this.state.todoItems, 'completed'),
            currentFilter: 'completed'
        });
    }

    itemsFilter(items, currentFilter = 'all') {
        return items.filter(item => {
            return currentFilter === 'active'
                ? item.isCompleted !== true
                : currentFilter === 'completed'
                ? item.isCompleted === true
                : item;
        });
    }

    componentDidMount() {
        this.getAllItems();
    }

    render() {
        return (
            <ItemContext.Provider
                value={{
                    state: this.state,
                    addNewItem: this.addNewItem.bind(this),
                    deleteItem: this.deleteItem.bind(this),
                    itemClicked: this.itemClicked.bind(this),
                    itemDoubleClicked: this.itemDoubleClicked.bind(this),
                    updateItem: this.updateItem.bind(this),
                    handleClearCompleted: this.handleClearCompleted.bind(this),
                    itemCheckAll: this.itemCheckAll.bind(this),
                    countItemsLeft: this.countItemsLeft.bind(this),
                    handleShowAll: this.handleShowAll.bind(this),
                    handleShowActive: this.handleShowActive.bind(this),
                    handleShowCompleted: this.handleShowCompleted.bind(this)
                }}
            >
                {this.props.children}
            </ItemContext.Provider>
        );
    }
}
