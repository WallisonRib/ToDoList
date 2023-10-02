import './App.css';
import { useState, useEffect } from 'react';
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill} from 'react-icons/bs';


const API = "http://localhost:5000";


function App() {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() =>{
    const loadData = async() =>{
      setLoading(true);

      const  res = await fetch(API + "/todo")
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => console.log(err)) ;

      setLoading(false);
      setTodos(res);
    }
    loadData();

  }, [])


  const handleSubmit = async (e) => {
    e.preventDefault();
    const todo = {
      id: Math.random(),
      title,
      time,
      done: false,
    };

    await fetch(API + "/todo",{
      method: "POST",
      body: JSON.stringify(todo),
      headers:{
        "Content-Type" : "application/json",  
      },
    });

    setTodos((prevState) =>[...prevState, todo]);
 
    setTitle("");
    setTime("");

  };

  const handleDelete = async (id) =>{
    await fetch(API + "/todo/" + id,{
      method: "DELETE",
    });

    setTodos((prevState) => prevState.filter((todo) => todo.id !== id));
  }
  
  const handleEdit = async (todo) =>{
    todo.done = !todo.done;

    const data = await fetch(API + "/todo/" + todo.id,{
      method: "PUT",
      body: JSON.stringify(todo),
      headers:{
        "Content-Type" : "application/json",  
      },
    });

    setTodos((prevState) => prevState.map((t) => (t.id === data.id ? (t = data) :t)));
  }

  if(loading){
    <p>CARREGANDO!!!</p>
  }



  return (
    <div className="App">
      <div className="header">
        <h1>Todo List</h1>
      </div>

      <div className="forms">
        <h2>Insira a sua próxima tarefa</h2>
        <form onSubmit={handleSubmit}>
          <div className="control">
            <label htmlFor="title"> Qual a tarefa?</label>
            <input type="text"
              name="title"
              className="text"
              placeholder="Titulo da tarefa"
              onChange={(e) => setTitle(e.target.value)}
              value={title || ""}
              required
            />
          </div>
          <div className="control">
            <label htmlFor="title"> Duração</label>
            <input type="text"
              name="time"
              className="text"
              placeholder="Tempo (em horas)"
              onChange={(e) => setTime(e.target.value)}
              value={time || ""}
              required
            />
          </div>
          <input type="submit" value="Enviar tarefa" />
        </form>

      </div>

      <div className="list">
        <h2>Lista de Tarefas:</h2>
        {todos.length === 0 && <p>Não há tarefas.</p>}
        {todos.map((todo) =>(
          <div className="todo" key={todo.id}>
            <h3 className={todo.done ? "todo-done" :""}>{todo.title}</h3>
            <p>Duração : {todo.time}h</p>
            <div className="actions">
              <span onClick={()=>handleEdit(todo)}>
                {!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill/>}
              </span>
              <BsTrash onClick={ () =>handleDelete(todo.id) }/>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;
