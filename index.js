const express = require('express');
const db = require('./db');

const app = express();
app.use(express.json());

const cors = require('cors')
const { Router} = require("express")
const router = Router();

router.use(cors());

// === Paises ===
app.get('/paises', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Pais');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// === Estados ===
app.get('/estados', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Estado');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/estados/:idPais', async (req, res) => {
    const { idPais } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM Estado WHERE ID_Pais = ?', [idPais]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// === Municipios ===
app.get('/municipios', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Municipio');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/municipios/:idEstado', async (req, res) => {
    const { idEstado } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM Municipio WHERE ID_Estado = ?', [idEstado]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// === Codigos Postales ===
app.get('/codigos_postales', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Codigo_Postal');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/codigos_postales/:idMunicipio', async (req, res) => {
    const { idMunicipio } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM Codigo_Postal WHERE ID_Municipio = ?', [idMunicipio]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// === Direcciones ===
app.get('/direcciones', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Direccion');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint: Películas con detalles completos
app.get('/peliculas/detalles', async (req, res) => {
    try {
        const [peliculas] = await db.query(`
            SELECT 
                p.ID_Pelicula,
                p.Titulo,
                p.Año,
                p.Duracion,
                p.Clasificacion,
                p.Sinopsis,
                p.Precio,
                p.Portada_URL,
                GROUP_CONCAT(DISTINCT g.Nombre) AS Generos,
                GROUP_CONCAT(DISTINCT i.Nombre) AS Idiomas
            FROM Pelicula p
            LEFT JOIN Pelicula_Genero pg ON p.ID_Pelicula = pg.ID_Pelicula
            LEFT JOIN Genero g ON pg.ID_Genero = g.ID_Genero
            LEFT JOIN Pelicula_Idioma pi ON p.ID_Pelicula = pi.ID_Pelicula
            LEFT JOIN Idioma i ON pi.ID_Idioma = i.ID_Idioma
            GROUP BY p.ID_Pelicula limit 100
        `);
        res.json(peliculas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint: Buscar películas
app.get('/peliculas/buscar', async (req, res) => {
    const { query } = req.query;
    try {
        const [peliculas] = await db.query(`
            SELECT 
                p.ID_Pelicula,
                p.Titulo,
                p.Año,
                p.Duracion,
                p.Clasificacion,
                p.Sinopsis,
                p.Precio,
                p.Portada_URL,
                GROUP_CONCAT(DISTINCT g.Nombre) AS Generos,
                GROUP_CONCAT(DISTINCT i.Nombre) AS Idiomas
            FROM Pelicula p
            LEFT JOIN Pelicula_Genero pg ON p.ID_Pelicula = pg.ID_Pelicula
            LEFT JOIN Genero g ON pg.ID_Genero = g.ID_Genero
            LEFT JOIN Pelicula_Idioma pi ON p.ID_Pelicula = pi.ID_Pelicula
            LEFT JOIN Idioma i ON pi.ID_Idioma = i.ID_Idioma
            WHERE p.Titulo LIKE ? OR g.Nombre LIKE ?
            GROUP BY p.ID_Pelicula limit 100
        `, [`%${query}%`, `%${query}%`]);
        res.json(peliculas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// === Películas ===
app.get('/peliculas', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Pelicula');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// === Géneros por Película ===
app.get('/peliculas/:id/generos', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT g.* 
            FROM Pelicula_Genero pg 
            JOIN Genero g ON pg.ID_Genero = g.ID_Genero 
            WHERE pg.ID_Pelicula = ?`, [id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// === Idiomas por Película ===
app.get('/peliculas/:id/idiomas', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT i.* 
            FROM Pelicula_Idioma pi 
            JOIN Idioma i ON pi.ID_Idioma = i.ID_Idioma 
            WHERE pi.ID_Pelicula = ?`, [id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// === Calificaciones ===
app.get('/calificaciones', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Calificacion');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/* === Usuarios ===
app.get('/usuarios', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Usuario');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});*/

// === Ventas ===
/*
app.get('/ventas', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Venta');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});*/



// === Vistas Especiales ===
app.get('/vistas/total_descuentos', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Vista_Total_Descuentos');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/vistas/total_recaudado', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Vista_Total_Recaudado');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/vistas/ventas_municipio', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Vista_Ventas_Municipio');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
const bcrypt = require('bcrypt');

// Registro de usuario
app.post('/registro', async (req, res) => {
    const { Nombre, Apellido_Paterno, Apellido_Materno, Email, Contraseña, Fecha_Nacimiento, Sexo, Rol, ID_Direccion } = req.body;

    try {
        // Validar campos obligatorios
        if (!Nombre || !Email || !Contraseña) {
            return res.status(400).json({ error: 'Nombre, Email y Contraseña son obligatorios.' });
        }

        // Verificar si el email ya existe
        const [existingUser] = await db.query('SELECT * FROM Usuario WHERE Email = ?', [Email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
        }

        // Insertar el nuevo usuario en la base de datos
        await db.query(
            `INSERT INTO Usuario (Nombre, Apellido_Paterno, Apellido_Materno, Email, Contraseña, Fecha_Nacimiento, Sexo, Rol, ID_Direccion) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [Nombre, Apellido_Paterno, Apellido_Materno, Email, Contraseña, Fecha_Nacimiento, Sexo, Rol || 'Cliente', ID_Direccion]
        );

        res.status(201).json({ message: 'Usuario registrado exitosamente.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});





const jwt = require('jsonwebtoken');
const SECRET_KEY = 'tu_clave_secreta'; // Cambia por una clave segura

app.post('/login', async (req, res) => {
    const { Email, Contraseña } = req.body;

    try {
        // Validar campos obligatorios
        if (!Email || !Contraseña) {
            return res.status(400).json({ error: 'Email y Contraseña son obligatorios.' });
        }

        // Verificar si el usuario existe
        const [users] = await db.query('SELECT * FROM Usuario WHERE Email = ?', [Email]);
        if (users.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        const usuario = users[0];

        // Comparar contraseñas directamente (solo para texto plano, no seguro)
        if (Contraseña !== usuario.Contraseña) {
            return res.status(401).json({ error: 'Contraseña incorrecta.' });
        }

        // Generar el token JWT
        const token = jwt.sign(
            {
                id: usuario.ID_Usuario,
                nombre: usuario.Nombre,
                rol: usuario.Rol
            },
            SECRET_KEY,
            { expiresIn: '1h' }
        );


        // Incluir el nombre, email y rol del usuario en la respuesta
        res.json({
            message: 'Inicio de sesión exitoso.',
            token,
            user: {
              id: usuario.ID_Usuario,
                nombre: usuario.Nombre,
                email: usuario.Email,
                rol: usuario.Rol
            }
        });

     //   res.json({ message: 'Inicio de sesión exitoso.', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Token no proporcionado.' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token no válido.' });

        req.user = user;
        next();
    });
};

// Obtener todos los métodos de pago
app.get('/metodos-pago', async (req, res) => {
    try {
      const metodosPago = await db.query('SELECT * FROM Metodo_Pago');
      res.json(metodosPago);
    } catch (error) {
      res.status(500).send('Error al obtener métodos de pago');
    }
  });
  
  app.post('/ventas', async (req, res) => {
    const { fecha, monto_total, id_usuario, id_metodo_pago, id_cupon, detalles } = req.body;
  
    // Validación de entrada
    if (!id_usuario || !id_metodo_pago || !monto_total || !detalles || detalles.length === 0) {
      return res.status(400).send('Datos faltantes');
    }
  
    // Iniciar una transacción para garantizar la consistencia
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      
      // Insertar la venta
      const resultVenta = await connection.query(
        `INSERT INTO Venta (Fecha, Monto_Total, ID_Usuario, ID_Metodo_Pago, ID_Cupon)
         VALUES (?, ?, ?, ?, ?)`,
        [fecha, monto_total, id_usuario, id_metodo_pago, id_cupon || null]
      );
      
      console.log('Resultado de la inserción de la venta:', resultVenta); // Verifica lo que se devuelve
      
      const id_venta = resultVenta[0].insertId; // Acceder correctamente al insertId del primer objeto en el arreglo
  
      if (!id_venta) {
        return res.status(500).send('Error al obtener el ID de la venta');
      }
  
      // Insertar detalles de la venta
      for (let detalle of detalles) {
        // Verifica que el id_venta no sea null
        if (!id_venta) {
          return res.status(500).send('ID de venta no válido');
        }
  
        // Inserción del detalle de la venta
        await connection.query(
          `INSERT INTO Detalle_Venta (Cantidad, Precio_Unitario, ID_Venta, ID_Pelicula)
           VALUES (?, ?, ?, ?)`,
          [detalle.cantidad, detalle.precio_unitario, id_venta, detalle.id_pelicula]
        );
      }
  
      // Confirmar la transacción
      await connection.commit();
      res.json({ id_venta, message: 'Venta creada con éxito' });
    } catch (error) {
      await connection.rollback(); // Deshacer cambios si algo falla
      console.error('Error al crear la venta o agregar detalles:', error);
      res.status(500).send('Error al crear la venta o agregar detalles');
    } finally {
      connection.release();
    }
  });
  
  
  
  // Obtener detalles de una venta por ID
  app.get('/ventas/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const venta = await db.query('SELECT * FROM Venta WHERE ID_Venta = ?', [id]);
      res.json(venta[0]);
    } catch (error) {
      res.status(500).send('Error al obtener la venta');
    }
  });
  
  // Obtener todos los cupones activos
app.get('/cupones', async (req, res) => {
    try {
      const cupones = await db.query(
        `SELECT * FROM Cupon WHERE Estado = 'Activo' AND Fecha_Expiracion > NOW()`
      );
      res.json(cupones);
    } catch (error) {
      res.status(500).send('Error al obtener los cupones');
    }
  });
  
  app.get('/cupones/validar/:codigo', async (req, res) => {
    const { codigo } = req.params;
    console.log('Validando código:', codigo);
    try {
      const [cupon] = await db.query(
        `SELECT * 
         FROM Cupon 
         WHERE Codigo = ? AND Estado = 'Activo' AND Fecha_Expiracion > NOW()`,
        [codigo]
      );
  
      if (cupon.length > 0) {
        const cuponData = cupon[0];
  
        // Validar restricciones específicas (ejemplo: uso único)
        if (cuponData.Usado) {
          return res.status(400).json({ valido: false, mensaje: 'El cupón ya ha sido utilizado' });
        }
  
        res.json({
          valido: true,
          id: cuponData.ID_Cupon,
          codigo: cuponData.Codigo,
          descuento: cuponData.Descuento,
          tipo: cuponData.Tipo, // 'porcentaje' o 'monto fijo'
        });
      } else {
        res.status(404).json({ valido: false, mensaje: 'Cupón no válido o expirado' });
      }
    } catch (error) {
      console.error('Error al validar el cupón:', error);
      res.status(500).json({ valido: false, mensaje: 'Error al validar el cupón' });
    }
  });
  
  
  

  // Agregar detalles de una venta
app.post('/detalle-venta', async (req, res) => {
    const { cantidad, precio_unitario, id_venta, id_pelicula } = req.body;
    try {
      const result = await db.query(
        `INSERT INTO Detalle_Venta (Cantidad, Precio_Unitario, ID_Venta, ID_Pelicula)
         VALUES (?, ?, ?, ?)`,
        [cantidad, precio_unitario, id_venta, id_pelicula]
      );
      res.json({ id_detalle: result.insertId, message: 'Detalle de venta agregado con éxito' });
    } catch (error) {
      res.status(500).send('Error al agregar el detalle de venta');
    }
  });
  
  // Obtener detalles de una venta
  app.get('/detalle-venta/:id_venta', async (req, res) => {
    const { id_venta } = req.params;
    try {
      const detalles = await db.query(
        `SELECT dv.*, p.Titulo 
         FROM Detalle_Venta dv 
         JOIN Pelicula p ON dv.ID_Pelicula = p.ID_Pelicula
         WHERE dv.ID_Venta = ?`,
        [id_venta]
      );
      res.json(detalles);
    } catch (error) {
      res.status(500).send('Error al obtener detalles de venta');
    }
  });
  

///Administrador
// Obtener todos los usuarios
app.get('/usuarios', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Usuario WHERE Estado = "Activo" LIMIT 100');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un usuario
app.put('/usuarios/:id', async (req, res) => {
  const id = req.params.id;
  const { Nombre, Apellido_Paterno, Apellido_Materno, Email, Rol } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE Usuario SET Nombre = ?, Apellido_Paterno = ?, Apellido_Materno = ?, Email = ?, Rol = ? WHERE ID_Usuario = ?',
      [Nombre, Apellido_Paterno, Apellido_Materno, Email, Rol, id]
    );

    // Verificar si se afectó alguna fila
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado o no actualizado.' });
    }

    res.json({ message: 'Usuario actualizado correctamente.' });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ error: 'Error al actualizar el usuario.' });
  }
});



app.delete('/usuarios/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const [result] = await db.query('UPDATE Usuario SET Estado = "Inactivo" WHERE ID_Usuario = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    res.sendStatus(200); // Usuario marcado como inactivo
  } catch (error) {
    console.error('Error al eliminar (marcar inactivo) el usuario:', error);
    res.status(500).json({ error: 'No se pudo eliminar el usuario.' });
  }
});



///Ventas
app.get('/ventas', async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM Venta limit 200');
      res.json(rows);
    } catch (error) {
      console.error('Error al obtener las ventas:', error);
      res.status(500).json({ error: 'Error al obtener las ventas.' });
    }
  });
  app.put('/ventas/:id', async (req, res) => {
    const { id } = req.params;
    const { Fecha, Monto_Total, ID_Usuario, ID_Metodo_Pago, ID_Cupon } = req.body;
  
    try {
      const [result] = await db.query(
        `UPDATE Venta 
         SET Fecha = ?, Monto_Total = ?, ID_Usuario = ?, ID_Metodo_Pago = ?, ID_Cupon = ? 
         WHERE ID_Venta = ?`,
        [Fecha, Monto_Total, ID_Usuario, ID_Metodo_Pago, ID_Cupon, id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Venta no encontrada.' });
      }
  
      res.json({ message: 'Venta actualizada con éxito.' });
    } catch (error) {
      console.error('Error al actualizar la venta:', error);
      res.status(500).json({ error: 'Error al actualizar la venta.' });
    }
  });
    
  app.delete('/ventas/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const [result] = await db.query('DELETE FROM Venta WHERE ID_Venta = ?', [id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Venta no encontrada.' });
      }
  
      res.json({ message: 'Venta eliminada con éxito.' });
    } catch (error) {
      console.error('Error al eliminar la venta:', error);
      res.status(500).json({ error: 'Error al eliminar la venta.' });
    }
  });
   

  ///Consultas (reportes)
  app.get('/recaudacion-pelicula', async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT p.Titulo AS Pelicula, SUM(dv.Cantidad * dv.Precio_Unitario) AS Total_Recaudado
        FROM Pelicula p
        JOIN Detalle_Venta dv ON p.ID_Pelicula = dv.ID_Pelicula
        GROUP BY p.ID_Pelicula
        ORDER BY Total_Recaudado DESC limit 50;
      `);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.get('/promedio-duracion-genero', async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT g.Nombre AS Genero, AVG(p.Duracion) AS Promedio_Duracion
        FROM Pelicula p
        JOIN Pelicula_Genero pg ON p.ID_Pelicula = pg.ID_Pelicula
        JOIN Genero g ON pg.ID_Genero = g.ID_Genero
        GROUP BY g.ID_Genero limit 100;
      `);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/recaudacion-pais-productoras', async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT pa.Nombre AS Pais, SUM(dv.Cantidad * dv.Precio_Unitario) AS Total_Recaudado
        FROM Pelicula p
        JOIN Productora pr ON p.ID_Productora = pr.ID_Productora
        JOIN Pais pa ON pr.ID_Pais = pa.ID_Pais
        JOIN Detalle_Venta dv ON p.ID_Pelicula = dv.ID_Pelicula
        GROUP BY pa.ID_Pais
        ORDER BY Total_Recaudado DESC limit 100;
      `);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app.get('/ingresos-metodo-pago', async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT mp.Nombre AS Metodo_Pago, SUM(v.Monto_Total) AS Ingresos_Totales
        FROM Venta v
        JOIN Metodo_Pago mp ON v.ID_Metodo_Pago = mp.ID_Metodo_Pago
        GROUP BY mp.ID_Metodo_Pago;
      `);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/peliculas-vendidas-municipio', async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT m.Nombre AS Municipio, COUNT(dv.ID_Detalle) AS Peliculas_Vendidas
        FROM Venta v
        JOIN Usuario u ON v.ID_Usuario = u.ID_Usuario
        JOIN Direccion d ON u.ID_Direccion = d.ID_Direccion
        JOIN Codigo_Postal cp ON d.ID_Codigo_Postal = cp.ID_Codigo_Postal
        JOIN Municipio m ON cp.ID_Municipio = m.ID_Municipio
        JOIN Detalle_Venta dv ON v.ID_Venta = dv.ID_Venta
        GROUP BY m.ID_Municipio
        ORDER BY Peliculas_Vendidas DESC limit 100;
      `);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app.get('/promedio-ventas-usuarios', async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT u.ID_Usuario, AVG(v.Monto_Total) AS Promedio_Ventas
        FROM Venta v
        JOIN Usuario u ON v.ID_Usuario = u.ID_Usuario
        GROUP BY u.ID_Usuario
        HAVING COUNT(v.ID_Venta) > 3 limit 100;
      `);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app.get('/descuento-cupones', async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT c.Codigo AS Cupon, SUM(c.Descuento) AS Total_Descuento
        FROM Cupon c
        JOIN Venta v ON c.ID_Cupon = v.ID_Cupon
        GROUP BY c.ID_Cupon limit 100;
      `);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app.get('/ingresos-clasificacion', async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT p.Clasificacion, SUM(dv.Cantidad * dv.Precio_Unitario) AS Ingresos
        FROM Pelicula p
        JOIN Detalle_Venta dv ON p.ID_Pelicula = dv.ID_Pelicula
        GROUP BY p.Clasificacion limit 100;
      `);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app.get('/total-recaudado-por-pais', async (req, res) => {
    const query = `
        SELECT 
            pa.Nombre AS Pais, 
            SUM(dv.Cantidad * dv.Precio_Unitario) AS Total_Recaudado
        FROM 
            Pelicula p
        JOIN 
            Productora pr ON p.ID_Productora = pr.ID_Productora
        JOIN 
            Pais pa ON pr.ID_Pais = pa.ID_Pais
        JOIN 
            Detalle_Venta dv ON p.ID_Pelicula = dv.ID_Pelicula
        GROUP BY 
            pa.ID_Pais
        ORDER BY 
            Total_Recaudado DESC;
    `;
    try {
        const [results] = await db.query(query);
        res.json(results);
    } catch (error) {
        res.status(500).send(error);
    }
});

  

  app.get('/peliculas-populares/:protagonista', async (req, res) => {
    const protagonista = req.params.protagonista;
    const query = `
        SELECT 
            p.Titulo AS Pelicula,
            COUNT(dv.ID_Detalle) AS Popularidad
        FROM 
            Pelicula p
        JOIN 
            Pelicula_Protagonista pp ON p.ID_Pelicula = pp.ID_Pelicula
        JOIN 
            Protagonista pro ON pp.ID_Protagonista = pro.ID_Protagonista
        JOIN 
            Detalle_Venta dv ON p.ID_Pelicula = dv.ID_Pelicula
        WHERE 
            pro.Nombre = ?
        GROUP BY 
            p.ID_Pelicula
        ORDER BY 
            Popularidad DESC
        LIMIT 100;
    `;
    
    try {
        const [results] = await db.query(query, [protagonista]);
        res.json(results);
    } catch (error) {
        console.error("Error ejecutando la consulta:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});


app.get('/recomendaciones/:usuarioId', async (req, res) => {
  const usuarioId = req.params.usuarioId; // ID del usuario específico
  const query = `
    SELECT 
      p.Titulo AS Recomendacion
    FROM 
      Calificacion c
    JOIN 
      Pelicula p ON c.ID_Pelicula = p.ID_Pelicula
    JOIN 
      Pelicula_Genero pg ON p.ID_Pelicula = pg.ID_Pelicula
    JOIN 
      Genero g ON pg.ID_Genero = g.ID_Genero
    WHERE 
      c.ID_Usuario = ? 
      AND c.Puntuacion >= 8
    GROUP BY 
      p.ID_Pelicula
    ORDER BY 
      COUNT(p.ID_Pelicula) DESC
    LIMIT 10;
  `;

  try {
    const [rows] = await db.query(query, [usuarioId]);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener recomendaciones:', error);
    res.status(500).send('Error al obtener recomendaciones');
  }
});

      
      

      //preuba
      app.get('/peliculas-por-municipio', async (req, res) => {
        try {
          const [rows] = await db.query(`
            SELECT m.Nombre AS Municipio, COUNT(dv.ID_Detalle) AS Peliculas_Vendidas
            FROM Venta v
            JOIN Usuario u ON v.ID_Usuario = u.ID_Usuario
            JOIN Direccion d ON u.ID_Direccion = d.ID_Direccion
            JOIN Codigo_Postal cp ON d.ID_Codigo_Postal = cp.ID_Codigo_Postal
            JOIN Municipio m ON cp.ID_Municipio = m.ID_Municipio
            JOIN Detalle_Venta dv ON v.ID_Venta = dv.ID_Venta
            GROUP BY m.ID_Municipio
            ORDER BY Peliculas_Vendidas DESC limit 50;
          `);
          res.json(rows);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      });
      
// Obtener todas las películas
app.get('/peliculas', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Pelicula limit 100');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar una película
app.put('/peliculas/:id', async (req, res) => {
  const id = req.params.id;
  const { Titulo, Año, Duracion, Clasificacion, Precio, Cantidad_Disponible } = req.body;

  try {
    await db.query(
      'UPDATE Pelicula SET Titulo = ?, Año = ?, Duracion = ?, Clasificacion = ?, Precio = ?, Cantidad_Disponible = ? WHERE ID_Pelicula = ?',
      [Titulo, Año, Duracion, Clasificacion, Precio, Cantidad_Disponible, id]
    );
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar una película
app.delete('/peliculas/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await db.query('DELETE FROM Pelicula WHERE ID_Pelicula = ?', [id]);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todos los cupones
app.get('/cupones', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Cupon limit 100');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un cupón
app.put('/cupones/:id', async (req, res) => {
  const id = req.params.id;
  const { Codigo, Tipo, Descuento, Estado, Fecha_Expiracion } = req.body;

  try {
    await db.query(
      'UPDATE Cupon SET Codigo = ?, Tipo = ?, Descuento = ?, Estado = ?, Fecha_Expiracion = ? WHERE ID_Cupon = ?',
      [Codigo, Tipo, Descuento, Estado, Fecha_Expiracion, id]
    );
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un cupón
app.delete('/cupones/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await db.query('DELETE FROM Cupon WHERE ID_Cupon = ?', [id]);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Obtener todos los actores
app.get('/actores', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Protagonista limit 100');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un actor
app.put('/actores/:id', async (req, res) => {
  const id = req.params.id;
  const { Nombre, Apellido_Paterno, Apellido_Materno } = req.body;

  try {
    await db.query(
      'UPDATE Protagonista SET Nombre = ?, Apellido_Paterno = ?, Apellido_Materno = ? WHERE ID_Protagonista = ?',
      [Nombre, Apellido_Paterno, Apellido_Materno, id]
    );
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un actor
app.delete('/actores/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await db.query('DELETE FROM Protagonista WHERE ID_Protagonista = ?', [id]);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// === Iniciar Servidor ===
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
