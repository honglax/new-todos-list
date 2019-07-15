import React from 'react';
import './css/Loading.css';
import classNames from 'classnames';

export default function Loading(props) {
    let loadingClass = classNames({
        'loading-screen': true,
        'is-display': props.isLoading
    });
    return <div className={loadingClass} />;
}
