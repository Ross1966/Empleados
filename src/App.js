import './App.css';
import { useState } from 'react';
import axios from 'axios'; // This is correct
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import { useEffect } from 'react';





function App() {

  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState();
  const [id_pais, setPais] = useState(0);
  const [cargo, setCargo] = useState("");
  const [anios, setAnios] = useState();
  const [id, setId] = useState();

  const [editar, setEditar] = useState(false);

  const [empleadosList, setEmpleados] = useState([]);
  //const [setPaises] = useState([]);
 const [paises, setPaises] = useState([]);
 


  

  const add = () => {
 
    
      let data = {
       nombre,
       edad,
       id_pais, // 👈 Usa la clave que espera tu base de datos
       cargo,
       anios,
};

  
    if (!nombre || !edad || !id_pais || !cargo || !anios) {

      // window.alert("Añade todos los datos");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Tienes que añadir todos los Datos"
        });
    } else {
     
      axios.post("http://localhost:3001/create", data).then(() => {
        getEmpleados();
        limpiarCampos();
  
        Swal.fire({
          title: "¡Registro Exitoso!",
          html: "<li> El empleado <strong> "+nombre+" </strong> fue registrado exitosamente!!! </li>",
          icon: "success",
          timer: 3000
        });
      });
    }
  };
  



  const update = ()=>{

    if (!nombre || !edad || !id_pais || !cargo || !anios) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Tienes que añadir todos los Datos"
        });
      }else{

        axios.put("http://localhost:3001/update",{
        Id: id,
        nombre: nombre,
        edad: edad,
        id_pais: id_pais,
        cargo: cargo,
        anios: anios
        }).then(()=>{

      getEmpleados();
      limpiarCampos();
      Swal.fire({
        title: "¡Empleado Modificado!",
        html: "<li> El empleado <strong> "+nombre+" </strong> fue modificado exitosamente!!! </li>",
        icon: "success",
        timer: 3000
      });
      
       
    });
      };
  };


  const deleteEmple = (val)=>{

    Swal.fire({
      title: "ELIMINAR",
      html: "<l>Realmente quieres eliminar a <strong> "+val.nombre+" </strong>?</l>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si eliminarlo!"
    }).then((result) => {
      if (result.isConfirmed) {
          axios.delete(`http://localhost:3001/delete/${val.Id}`).then(()=>{
     
          getEmpleados();
          limpiarCampos();
                     
        });

        Swal.fire({
          
          text: val.nombre + ' Fué Eliminado!!',
          icon:'success'
        });
      }
    });

    
  };



  const editarEmpleado = (val)=>{
    setEditar(true);

    setId(val.Id);
    setNombre(val.nombre);
    setEdad(val.edad);
    setPais(val.id_pais);
    setCargo(val.cargo);
    setAnios(val.anios);
    }


  const getEmpleados = ()=>{
   
    axios.get("http://localhost:3001/empleados").then((response)=>{
     setEmpleados(response.data);
      });
  }

  //getEmpleados()
  useEffect(() => {
    getEmpleados();
    getPaises();
  }, []);
  
 
  const limpiarCampos = ()=>{
    setId("");
    setNombre("");
    setEdad("");
    setPais("");
    setCargo("");
    setAnios("");
    setEditar(false);

  };



/// Get Pais
const getPaises = () => {
  axios.get("http://localhost:3001/paises")
    .then((response) => {
      setPaises(response.data);
      
    })
    .catch((error) => {
      console.error("Error al cargar países", error);
    });
};


 return (
    <div className="container">
    
<div className="card text-center">
      <div className="card-header">
        GESTIÓN DE EMPLEADOS
      </div>
<div className="card-body">
      <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">Nombre:</span>
          <input type="text" 
            onChange={(event)=>{setNombre(event.target.value)}} className="form-control" value={nombre} placeholder="Ingresa un Nombre" aria-label="Username" aria-describedby="basic-addon1"></input>
      </div>

        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">Edad:</span>
           <input type="number" 
           onChange={(event)=>{setEdad(event.target.value)}} className="form-control" value={edad}placeholder="Ingresa la Edad" aria-label="Username" aria-describedby="basic-addon1"></input>
        </div>

    <div className="input-group mb-3">
  <span className="input-group-text" id="basic-addon1">País:</span>

  <select
    className="form-control"
    value={id_pais}
    onChange={(e) => setPais(e.target.value)}
  >
    <option value="">
      {editar
        ? (paises.find(p => String(p.id_pais) === String(id_pais))?.pais || "Selecciona un país")
        : "Seleccione un país"}
    </option>

    {paises.map((pais) => (
      <option key={pais.id_pais} value={pais.id_pais}>
        {pais.pais}
      </option>
    ))}
  </select>
</div>


     
            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">Cargo:</span>
              <input type="text" 
              onChange={(event)=>{setCargo(event.target.value)}} className="form-control" value={cargo}placeholder="Ingresa el Cargo" aria-label="Username" aria-describedby="basic-addon1"></input>
            </div>
       
       
            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">Exp.(Años):</span>
              <input type="number" 
              onChange={(event)=>{setAnios(event.target.value)}} className="form-control" value={anios}placeholder="Ingresa los Años de Experiencia" aria-label="Username" aria-describedby="basic-addon1"></input>
            </div>
       
        
     </div>
        <div className="card-footer text-muted">
          {
            editar?
            <div>
                <button className='btn btn-warning m-2' onClick={update}>Actualizar</button>
                <button className='btn btn-info m-2' onClick={limpiarCampos}>Cancelar</button>
            </div>
                :<button className='btn btn-success' onClick={add}>Registrar</button>
          }
           
        </div>
</div>


<table className="table table-success table-striped m-12 p-5" >
<thead>
    <tr>
      <th scope="col">Id</th>
      <th scope="col">Nombre</th>
      <th scope="col">Edad</th>
      <th scope="col">País</th>
      <th scope="col">Cargo</th>
      <th scope="col">Exp.(Años)</th>
      <th scope="col">Acciones</th>
    </tr>
  </thead>
  <tbody>

  {
          empleadosList.map((val,key)=>{
            console.log("Lista de empleados:", empleadosList);

            return <tr key={val.Id}>
                <td>{val.Id}</td>
                <td>{val.nombre}</td>
                <td>{val.edad}</td>
                <td>{val.pais}</td>
                <td>{val.cargo}</td>
                <td>{val.anios}</td>
                <td>
                <div className="btn-group" role="group" aria-label="Basic example">
                  <button type="button" 
                  onClick={()=>{
                    editarEmpleado(val);
                  }}
                  className="btn btn-info">Editar</button>
                  <button type="button" onClick={()=>{deleteEmple(val);}} className="btn btn-danger">Eliminar</button>
                </div>
                </td>
              </tr>
            
             
            
            
          })
        }

 
    
  </tbody>
</table>



</div>
  );
}

export default App;