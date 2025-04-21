import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-quill/dist/quill.snow.css'
import Router from './routes'


createRoot(document.getElementById('root')).render(

    <Router />

)
