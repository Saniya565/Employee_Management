import "dotenv/config";
import { connectDB } from "./config/db.js";
import Department from "./models/Department.js";
import Designation from "./models/Designation.js";
async function run(){
 await connectDB();
 for(const name of ["Technology","HR","Finance","Marketing","Sales"]) await Department.updateOne({name},{name},{upsert:true});
 for(const name of ["Intern","Junior Developer","Software Developer","Senior Developer","Team Lead","HR Executive"]) await Designation.updateOne({name},{name},{upsert:true});
 console.log("Master data seeded"); process.exit(0);
}
run();
