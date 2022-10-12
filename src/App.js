import Todo from './components/Todo';
import Form from './components/Form';
import FilterButton from './components/FilterButton';
import React, {useState, useRef, useEffect} from 'react';
import {nanoid} from 'nanoid';

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.done,
  Completed: (task) => task.done
};



const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {
  const [tasks, setTasks] = useState(props.tasks);

  const addTask = (label) => {
    const newTask = {id: `todo-${nanoid()}`, label, done: false};
    setTasks([...tasks, newTask]);
    console.log(tasks)
  };

  const [filter, setFilter] = useState('All');
  console.log(FILTER_MAP[filter]);

  const filterList = FILTER_NAMES.map((label) => {
    return <FilterButton key= {label} name= {label} isPressed= {label=== filter} setFilter= {setFilter} />
  })

  function toggleTaskCompleted(id) {
    const updatedTask = tasks.map((task) => {
      if(id === task.id) {
        return {...task, completed: !task.done};
      }
      return task;
    })
    setTasks(updatedTask)
    console.log(tasks)
  };

  const deleteTask = (id) => {
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
  };

  const editTask = (id, newName) => {
    const editedTasksList = tasks.map((task) => {
      if(id === task.id) {
        return {...task, label: newName}
      }
      return task;
    });
    setTasks(editedTasksList);
  };

  const taskList = tasks
  .filter(FILTER_MAP[filter])
  .map((task) => (
    <Todo
      id={task.id}
      name={task.label}
      completed={task.done}
      key={task.id}
      toggleTaskCompleted={toggleTaskCompleted}
      deleteTask={deleteTask}
      editTask={editTask}
    />
  ));
  
  const taskNoun = taskList.length !== 1 ? 'tasks' : 'task';
  const taskLength = `${taskList.length} ${taskNoun} remaining.`;

  const listHeadingRef= useRef(null);
  const prevTaskLength = usePrevious(tasks.length);

  useEffect(() => {
    if (tasks.length - prevTaskLength === -1) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);

  useEffect(() => {

  postTodoAsync();    
  }, [tasks])

  const postTodoAsync = () => {
    fetch('https://assets.breatheco.de/apis/fake/todos/user/mau_light', {
      method: "PUT",
      body: JSON.stringify(tasks),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(resp => {
        console.log(resp.ok); // will be true if the response is successfull
        console.log(resp.status); // the status code = 200 or code = 400 etc.
        console.log(resp.text()); // will try return the exact result as string
        return resp.json(); // (returns promise) will try to parse the result as json as return a promise that you can .then for results
    })
    .then(data => {
        //here is were your code should start after the fetch finishes
        console.log(data); //this will print on the console the exact object received from the server
    })
    .catch(error => {
        //error handling
        console.log(error);
    });
  }

  return (
    <div className="todoapp stack-large">
      <h1>To-Do List</h1>
      <Form addTask= {addTask}/>
      <div className="filters btn-group stack-exception">
      {filterList}
      </div>

      <h2 id="list-heading" tabIndex= '-1' ref= {listHeadingRef}>
        {taskLength}
      </h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
    </div>
  );
}

export default App;