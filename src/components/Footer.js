import React, { useContext } from 'react';
import '../App.css';
import './css/Footer.css';
import classNames from 'classnames';
import { ItemContext } from '../contexts/Items.context';

function Footer() {
    const { state } = useContext(ItemContext);
    let counter = items => {
        let countTodo = 0;
        items.forEach(item => {
            if (!item.isCompleted) {
                countTodo++;
            }
        });
        return countTodo;
    };

    let {
        todoItems,
        // clearCompleted,
        // showAll,
        // showActive,
        // showCompleted,
        currentFilter
    } = state;

    let countTodo = counter(todoItems);
    let isFooterHidden = classNames({
        'is-hidden': todoItems.length === 0
    });
    let clearDeletedClass = classNames({
        'clear-completed': true,
        'is-hidden':
            countTodo === todoItems.length || currentFilter === 'active'
    });

    return (
        <footer className={isFooterHidden}>
            <span className="todo-count">
                {countTodo} {countTodo > 1 ? 'items' : 'item'} left
            </span>
            <ul className="filters">
                <li>
                    <a
                        href="/#/"
                        className={currentFilter === 'all' ? 'selected' : ''}
                    >
                        All
                    </a>
                </li>
                <li>
                    <a
                        href="#/active"
                        className={currentFilter === 'active' ? 'selected' : ''}
                    >
                        Active
                    </a>
                </li>
                <li>
                    <a
                        href="#/completed"
                        className={
                            currentFilter === 'completed' ? 'selected' : ''
                        }
                    >
                        Completed
                    </a>
                </li>
            </ul>
            <div className={clearDeletedClass}>
                <button>Clear completed</button>
            </div>
        </footer>
    );
}

export default Footer;
