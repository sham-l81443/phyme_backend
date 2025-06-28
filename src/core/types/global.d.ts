import { UserRole } from "@/core/constants/ENUMS/user";
import { Request } from "express";

export interface IRequestUser{
    id:string;
    email:string;
    role:UserRole;
    class?:{
        id:number;
    }
}
