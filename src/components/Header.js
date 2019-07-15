import React, { useContext } from 'react';
import '../App.css';
import './css/Header.css';

import classNames from 'classnames';
import { ItemContext } from '../contexts/Items.context';

import tickedIcon from '../img/ticked.svg';

function Header(props) {
    const { state, addNewItem, itemCheckAll } = useContext(ItemContext);
    let handleSubmit = event => {
        event.preventDefault();
        let text = event.target.querySelector('input').value.trim();
        if (!text || text === '') {
            return;
        }
        event.target.querySelector('input').value = '';
        let newItem = {
            title: text,
            isCompleted: false,
            readOnly: true,
            createdAt: new Date()
        };
        addNewItem(newItem);
    };

    let { todoItems, checkAll } = state;

    let headerCheckAll = classNames({
        'check-mark': true,
        'check-all': checkAll,
        'is-hidden': todoItems.length === 0
    });

    return (
        <div className="Header">
            <div className={headerCheckAll}>
                <img src={tickedIcon} alt="" onClick={itemCheckAll} />
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="What need to be done?" />
            </form>
        </div>
    );
}

export default Header;
