//importar useState y useEffect herramientas que nos brinda react
//useState sirve para guardar los datos en memoria
//useEffect permite ejecutar las funciones cuando se cargue la pagina
import { useState, useEffect } from 'react';
import './App.css';

function App() {

//estados para guardar lo que el usuario escribe en el formulario
const [nombre, setNombre] = useState("");
const [edad, setEdad] = useState(0);
const [pais, setPais] = useState("");
const [cargo, setCargo] = useState("");
const [anios, setAnios] = useState(0);

//lista que contenga todos los empleados que se registren
const [registros, setRegistros] = useState([]);

//este estado se usa para saber si estamos editando un empleado existente
//si es null es un nuevo registro, y si tiene un valor es el índice del empleado
const [editIndex, setEditIndex] = useState(null); // índice del registro que se esta editando

//cuando se carga la pagina, obtenemos los empleados desde el backend(nodejs y mysql)
useEffect(() => {
    //definimos una función asincrona para cargar los empleados
    const cargarEmpleados = async () => {
        try {
            const response = await fetch('http://localhost:3001/empleados');
            const data = await response.json(); //la respuesta la da en formato json
            setRegistros(data);
        } catch (error) {
          alert('Error al cargar los datos de los empleados');
        }
    }

    cargarEmpleados();
}, [])

//esta funcion se ejecuta al presionar el boton de registrar o actualizar
const registrarDatos = async (e) => {
    e.preventDefault(); //evitamos que se recargue la pagina al enviar el formulario

    if (editIndex !== null) {
        //estaremos editando un empleado existente
        try {
            const empleado = registros[editIndex];

            const response = await fetch(`http://localhost:3001/empleados/${empleado.id}`, {
                method: 'PUT', //metodo HTTP para actualizar
                headers: {'Content-Type': 'application/json'}, //indicamos que enviamos en formato JSON
                body: JSON.stringify({ nombre, edad, pais, cargo, anios })
            });

            if(response.ok){
                const nuevosRegistros = [...registros]; //copiamos el array actual de registros
                //reemplazamos el objeto en la posicion editada con los nuevos valores
                nuevosRegistros[editIndex] = { ...empleado, nombre, edad, pais, cargo, anios };
                setRegistros(nuevosRegistros); // Actualiza el estado
                setEditIndex(null); //salimos del modo edicion
                alert('Empleado actualizado correctamente');
                } else {
                    alert('Error al actualizar el empleado');
                }
                
        } catch (error) {
          alert('Error de conexion al actualizar');
        }
    } else {
      //si es un nuevo empleado(no estamos editando)
      try {
          const response = await fetch('http://localhost:3001/empleados', {
              method: 'POST', //metodo HTTP para agregar
              headers: { 'Content-Type': 'application/json' }, //indicamos que enviamos en formato JSON
              body: JSON.stringify({ nombre, edad, pais, cargo, anios })
          });
          const data = await response.json();
          if (response.ok) {
              setRegistros([...registros, data]);
              alert('Empleado registrado correctamente');
          } else {
              alert('Error al registrar el empleado');
          }
      } catch (error) {
            alert('Error de conexion al registrar');
      }
    }

    setAnios(0);
    setCargo('');
    setEdad(0);
    setNombre('');
    setPais('');
}

const eliminarRegistro = async (idx) => {
    const empleado = registros[idx];

    try {
        const response = await fetch(`http://localhost:3001/empleados/${empleado.id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            setRegistros(registros.filter((_, i) => i !== idx));
            if (editIndex == idx) {
                setEditIndex(null);
                setNombre("");
                setEdad(0);
                setPais("");
                setCargo("");
                setAnios(0);
            }
            alert('Empleado eliminado correctamente');
        } else {
            alert('Error al eliminar el empleado');
        }
    } catch (error) {
        alert('Error de conexion al eliminar');
    }
}

const editarRegistro = (idx) => {
    const reg = registros[idx];
    setNombre(reg.nombre);
    setEdad(reg.edad);
    setPais(reg.pais);
    setCargo(reg.cargo);
    setAnios(reg.anios);
    setEditIndex(idx);
};

const cancelarEdicion = () => {
    setEditIndex(null);
    setNombre("");
    setEdad(0);
    setPais("");
    setCargo("");
    setAnios(0);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Sistema de Gestión de Empleados</h1>
      </header>

      <div className="main-container">
        {/* Formulario */}
        <div className="form-container">
          <h2 style={{color: '#ff0000', marginBottom: '1.5rem', textAlign: 'center'}}>
            {editIndex !== null ? 'Editar Empleado' : 'Registrar Nuevo Empleado'}
          </h2>
          <form onSubmit={registrarDatos}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre Completo</label>
              <input
                type="text"
                id="nombre"
                className="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="edad">Edad</label>
              <input
                type="number"
                id="edad"
                className="form-control"
                value={edad}
                onChange={(e) => setEdad(parseInt(e.target.value))}
                required
                min="18"
                max="65"
              />
            </div>

            <div className="form-group">
              <label htmlFor="pais">País</label>
              <input
                type="text"
                id="pais"
                className="form-control"
                value={pais}
                onChange={(e) => setPais(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cargo">Cargo</label>
              <input
                type="text"
                id="cargo"
                className="form-control"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="anios">Años de Experiencia</label>
              <input
                type="number"
                id="anios"
                className="form-control"
                value={anios}
                onChange={(e) => setAnios(parseInt(e.target.value))}
                required
                min="0"
                max="50"
              />
            </div>

            <div className="btn-group">
              <button type="submit" className="btn btn-primary">
                {editIndex !== null ? 'Actualizar' : 'Registrar'}
              </button>
              {editIndex !== null && (
                <button type="button" className="btn btn-secondary" onClick={cancelarEdicion}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tabla de empleados */}
        <div className="table-container">
          <h2 style={{color: '#ff0000', marginBottom: '1rem', textAlign: 'center', padding: '1rem'}}>
            Lista de Empleados
          </h2>
          {registros.length === 0 ? (
            <div className="empty-state">
              <h3>No hay empleados registrados</h3>
              <p>Comienza agregando el primer empleado usando el formulario</p>
            </div>
          ) : (
            <table className="employees-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Edad</th>
                  <th>País</th>
                  <th>Cargo</th>
                  <th>Experiencia</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {registros.map((registro, idx) => (
                  <tr key={idx}>
                    <td>{registro.nombre}</td>
                    <td>{registro.edad} años</td>
                    <td>{registro.pais}</td>
                    <td>{registro.cargo}</td>
                    <td>{registro.anios} años</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          type="button" 
                          className="btn-sm btn-edit"
                          onClick={() => editarRegistro(idx)}
                        >
                          Editar
                        </button>
                        <button 
                          type="button" 
                          className="btn-sm btn-delete"
                          onClick={() => eliminarRegistro(idx)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );

}

export default App;