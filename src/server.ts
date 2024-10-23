import express from 'express' 
import colors from 'colors'
import cors, { CorsOptions } from 'cors'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec, { swaggerUiOptions } from './config/swagger'
import router  from './router'
import db from './config/db'

// Conectar a base de datos
export async function connectDB() {
    try {
        await db.authenticate()
        db.sync()
        // console.log( colors.blue( 'Conexión exitosa a la BD'))
    } catch (error) {
        console.log(error)
        console.log( colors.red.bold( 'Hubo un error al conectar a la BD') )
    }
}
connectDB()

// Instancia de express
const server = express()

// Permitir conexiones
// origen quien solicita la petición - callback función que permite o niega la conexión
const corsOptions : CorsOptions = {
    origin: function(origin, callback) {
        if(origin === process.env.FRONTEND_URL) {
            callback(null, true) // null es un error(si hay error no permite la conexión) y true si permite la conexión
        } else {
            callback(new Error('Error de CORS')) 
        }
    }
}
server.use(cors(corsOptions)) // ejecuta la función cors y le paso las opciones definidas

// Leer datos de formularios
server.use(express.json())

server.use(morgan('dev'))

server.use('/productos', router)

// Docs
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions) )

export default server