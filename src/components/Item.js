import React from 'react';
import propTypes from 'prop-types';
import classNames from 'classnames';

import './css/TodoItem.css';
import checkmark from '../img/checked.svg';
import uncheckmark from '../img/uncheck.svg';
import delIcon from '../img/close.svg';

export default function Item(props) {
    let { item } = props;
    let itemClass = classNames({
        TodoItem: true,
        'TodoItem-completed': item.isCompleted
    });
    let url = item.isCompleted ? checkmark : uncheckmark;
    return (
        <div className={itemClass}>
            <div className="check-mark">
                <img src={url} alt="" />
            </div>
            <input data-id={item.id} type="text" value={item.title} />
            <img src={delIcon} alt="" className="close-btn" />
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
