const express = require("express");
const conection = require("../conection");
const router = express.Router();

//Listar categorias
router.get("/listar", (req, res) => {
  conection.query("SELECT * FROM categoria", function (error, results, fields) {
    if (error) {
      console.error("Error al obtener las categorias:", error);
      res.status(500).send("Error interno del servidor");
      return;
    }
    res.json(results);
  });
});

//Crear categoria
router.post("/register", (req, res) => {
  const { descripcion, activo } = req.body;
  const query = `INSERT INTO categoria (descripcion, activo) 
    VALUES (?, ?)`;
  conection.query(query, [descripcion, activo], (error, results) => {
    if (error) {
      console.error("Error al crear categoria:", error);
      res.status(500).json({ mensaje: "Error al crear categoria" });
      return;
    }
    console.log("Categoria creado correctamente");
    res.status(201).json({ mensaje: "Categoria creado correctamente" });
  });
});

// Ruta para el borrado lógico de una categoria por su ID
router.delete("/desactivar/:id_categoria", (req, res) => {
  const categoriaid = req.params.id_categoria;

  const sql = "UPDATE categoria SET activo = ? WHERE id_categoria = ?";
  const values = ["No", categoriaid];

  conection.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error al cambiar el estado de la categoria:", err);
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Categoria no encontrado" });
      return;
    }

    res
      .status(200)
      .json({ message: "Estado de la categoria cambiado exitosamente" });
  });
});

// Ruta para el borrado lógico de una categoria por su ID
router.delete("/activar/:id_categoria", (req, res) => {
  const categoriaid = req.params.id_categoria;

  const sql = "UPDATE categoria SET activo = ? WHERE id_categoria = ?";
  const values = ["Si", categoriaid];

  conection.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error al cambiar el estado de la categoria:", err);
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Categoria no encontrado" });
      return;
    }

    res
      .status(200)
      .json({ message: "Estado de la categoria cambiado exitosamente" });
  });
});

// Actualizar una categoria por su ID
router.put("/update/:id_categoria", (req, res) => {
  const categoriaId = req.params.id_categoria;
  const { descripcion, activo } = req.body;

  // Query para actualizar una categoria en la base de datos
  const query = `UPDATE categoria SET descripcion = ?, activo = ? WHERE id_categoria = ?`;
  conection.query(query, [descripcion, activo, categoriaId], (error, results) => {
    if (error) {
      console.error("Error al actualizar categoria:", error);
      res.status(500).json({ mensaje: "Error al actualizar categoria" });
      return;
    }
    console.log("Categoria actualizado correctamente");
    res.json({ mensaje: "Categoria actualizado correctamente" });
  });
});

module.exports = router;
