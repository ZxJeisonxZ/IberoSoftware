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

}