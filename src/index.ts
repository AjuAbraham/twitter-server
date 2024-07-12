import {serverInit} from './app'
import * as dotenv from 'dotenv'

dotenv.config();
async function init() {
   const app =  await  serverInit();
   app.listen(8000,()=>console.log("server started at port:8000"));
}

init();