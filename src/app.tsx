import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Pie } from 'react-chartjs-2';

  ChartJS.register(ArcElement, Tooltip, Legend);


  const App = () => {
    const [generationMix, setGenerationMix] = useState([]);
    const [Time, setTime] = useState({ from: '', to: '' });
    const [error, setError] = useState(null);
  
    useEffect(() => {
  
      const fetchGenerationMix = async () => {
        try {
  
          let apiUrl="https://api.carbonintensity.org.uk/generation"
  
          const response = await fetch(apiUrl);
          if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
          }
          const data = await response.json();
  
   
          setGenerationMix(data.data.generationmix);
          setTime({
            from: data.data.from,
            to: data.data.to,
          });
        } catch (err) {
          setError(err.message);
        }
      };
  
      fetchGenerationMix();
    }, []); 
  
    return (
      <div>
        <h1>Datos de Generación de Energía Realizado Alfredo Salazar</h1>
        {error ? (
          <p style={{ color: "red" }}>Error al cargar los datos: {error}</p>
        ) : (
          <>
            {generationMix.length > 0 ? (
              <>
                <p>
                  <strong>Rango de tiempo:</strong> Desde {new Date(Time.from).toLocaleString()} hasta{' '}
                  {new Date(Time.to).toLocaleString()}
                </p>
                <TablaAburrida generationMix={generationMix} />
                <GraficoInteractivo generationMix={generationMix} />
              </>
            ) : (
              <p>Cargando datos...</p>
            )}
          </>
        )}
      </div>
    );
  };

  export {
    App
} ;


const TablaAburrida = ({ generationMix }) => {
  return (
    <div>
      <h2>Vista de lista</h2>
      <table border="1" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Porcentaje</th>
          </tr>
        </thead>
        <tbody>
          {generationMix.map((item, index) => (
            <tr key={index}>
              <td>{item.fuel}</td>
              <td>{item.perc}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const GraficoInteractivo = ({ generationMix }) => {
  const chartData = {
    labels: generationMix.map((item) => item.fuel), // Nombres de las fuentes
    datasets: [
      {
        data: generationMix.map((item) => item.perc), // Porcentajes
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#D6E9C6', '#F4A460', '#708090',
        ],
        hoverBackgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#D6E9C6', '#F4A460', '#708090',
        ],
      },
    ],
  };

  return (
    <div>
      <h2>Grafico interactivo de distribucion</h2>
      <Pie data={chartData} />
    </div>
  );
};




