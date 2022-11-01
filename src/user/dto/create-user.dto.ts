import { IsString } from "class-validator";
import { BeforeInsert } from "typeorm";

export class CreateUserDto {
@IsString()
name: string

@IsString()
username: string;

@IsString()
email: string;

@IsString()
password: string;

@BeforeInsert()
emailToLowerCase(){
    this.email = this.email.toLowerCase();
}
}
