import React, { useContext } from 'react';
import '../App.css';
import './css/Footer.css';
import classNames from 'classnames';
import { ItemContext } from '../contexts/Items.context';

function Footer() {
    const {
        state,
        handleClearCompleted,
        countItemsLeft,
        handleShowAll,
        handleShowActive,
        handleShowCompleted
    } = useContext(ItemContext);

    let { todoItems, currentFilter } = state;

    let countTodo = countItemsLeft(todoItems);
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
                        onClick={handleShowAll}
                        className={currentFilter === 'all' ? 'selected' : ''}
                    >
                        All
                    </a>
                </li>
                <li>
                    <a
                        href="#/active"
                        onClick={handleShowActive}
                        className={currentFilter === 'active' ? 'selected' : ''}
                    >
                        Active
                    </a>
                </li>
                <li>
                    <a
                        href="#/completed"
                        onClick={handleShowCompleted}
                        className={
                            currentFilter === 'completed' ? 'selected' : ''
                        }
                    >
                        Completed
                    </a>
                </li>
            </ul>
            <div className={clearDeletedClass}>
                <button onClick={handleClearCompleted}>Clear completed</button>
            </div>
        </footer>
    );
}

export default Footer;
