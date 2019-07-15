import React, { useContext } from 'react';
import propTypes from 'prop-types';
import classNames from 'classnames';
import { ItemContext } from '../contexts/Items.context';

import './css/TodoItem.css';
import checkmark from '../img/checked.svg';
import uncheckmark from '../img/uncheck.svg';
import delIcon from '../img/close.svg';

function Item(props) {
    let { item } = props;
    let { deleteItem, updateItem, itemClicked, itemDoubleClicked } = useContext(
        ItemContext
    );
    let itemClass = classNames({
        TodoItem: true,
        'TodoItem-completed': item.isCompleted
    });
    let url = item.isCompleted ? checkmark : uncheckmark;

    let handleUpdateItem = input => {
        let text = input.value.trim();
        if (!text || text === '') {
            return;
        }
        let itemId = input.dataset.id;
        let updatedItem = {
            title: text,
            readOnly: true,
            updatedAt: new Date()
        };
        updateItem(itemId, updatedItem, true);
    };

    let handleOnBlur = event => {
        let input = event.target;
        if (input.readOnly) {
            return;
        }
        handleUpdateItem(input);
    };

    let handleOnChange = event => {
        let input = event.target;
        let dataId = input.dataset.id;
        let changedItem = {
            title: event.target.value
        };
        updateItem(dataId, changedItem);
    };

    let handleKeyDown = event => {
        let ESCAPE_KEY = 27;
        let ENTER_KEY = 13;
        let input = event.target;
        if (event.keyCode === ESCAPE_KEY || event.keyCode === ENTER_KEY) {
            handleUpdateItem(input);
        }
    };

    return (
        <div className={itemClass}>
            <div className="check-mark">
                <img src={url} alt="" onClick={() => itemClicked(item._id)} />
            </div>
            <input
                data-id={item._id}
                type="text"
                value={item.title}
                readOnly={item.readOnly}
                onDoubleClick={() => itemDoubleClicked(item._id)}
                onBlur={handleOnBlur}
                onChange={handleOnChange}
                onKeyDown={handleKeyDown}
            />
            <img
                src={delIcon}
                alt=""
                className="close-btn"
                onClick={() => deleteItem(item._id)}
            />
        </div>
    );
}

Item.propTypes = {
    item: propTypes.shape({
        id: propTypes.string,
        title: propTypes.string.isRequired,
        isComplete: propTypes.bool,
        readOnly: propTypes.bool,
        isNew: propTypes.bool,
        createdAt: propTypes.any,
        updatedAt: propTypes.any
    })
};

export default Item;
