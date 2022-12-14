const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        
        // this.usuariosPath = '/api/usuarios';
        // this.authPath = '/api/auth'; Abajo la update.
        this.paths = {
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            usuarios:   '/api/usuarios',
        }


        // Conectar a la base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();
        
        // Rutas de mi aplicación
        this.routes();
        this.listen();
    }

    async conectarDB() {
        await dbConnection();
    }
    
    middlewares() {
        // CORS
         this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio Público
        this.app.use( express.static('public') );
    }

    routes() {

        // this.app.use( this.authPath, require('../routes/auth'));
        // this.app.use( this.usuariosPath, require('../routes/usuarios')); Abajo la update.
        this.app.use( this.paths.auth, require('../routes/auth')); 
        this.app.use( this.paths.buscar, require('../routes/buscar')); 
        this.app.use( this.paths.categorias, require('../routes/categorias')); 
        this.app.use( this.paths.productos, require('../routes/productos')); 
        this.app.use( this.paths.usuarios, require('../routes/usuarios')); 

    }   

    listen() {
        this.app.listen( this.port, () => {
            console.log(`Ejemplo de aplicación escuchando en el puerto: ${this.port}`)
        })
    }
      
}

module.exports = Server;