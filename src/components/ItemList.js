import React, { useContext } from 'react';
import classNames from 'classnames';

import { ItemContext } from '../contexts/Items.context';
import Item from './Item';
import './css/TodoItem.css';

function ItemList(props) {
    const { state } = useContext(ItemContext);
    let { todoItems } = state;

    let isContentHidden = classNames({
        'is-hidden': todoItems.length === 0
    });

    return (
        <div id="container" className={isContentHidden}>
            {todoItems.length > 0 &&
                todoItems.map(item => <Item item={item} key={item._id} />)}
        </div>
    );
}

export default ItemList;
