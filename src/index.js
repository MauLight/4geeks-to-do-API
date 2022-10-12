import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const DATA = [
  {id: 'todo-1', label: 'Write first act of outline', done: true},
  {id: 'todo-2', label: 'Write first part of second act of outline', done: false},
  {id: 'todo-3', label: 'Write second part of second act of outline', done: false},
  {id: 'todo-4', label: 'Write third act of outline', done: false},
];

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <App tasks= {DATA} />

);
