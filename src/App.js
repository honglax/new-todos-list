import React from 'react';
import './App.css';

import Header from './components/Header';
import ItemList from './components/ItemList';
import Footer from './components/Footer';

import { ItemProvider } from './contexts/Items.context';

function App() {
    return (
        <ItemProvider>
                <div className="App">
                    <h1>todos</h1>
                    <Header />
                    <ItemList />
                    <Footer />
                </div>
        </ItemProvider>
    );
}

export default App;
