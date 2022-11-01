import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable, of } from 'rxjs';
import { User } from 'src/user/user.interface';

const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService
    ){}

    //To generate jwt token
    generateJWT(user: User): Observable<string>{
return from (this.jwtService.signAsync({user}));
    }


    //hash password
    hashedPassword(password: string): Observable<string>{
return from<string>(bcrypt.hash(password, 12));
    }


    //comparepassword with hashed password
    comparePasswords(newPassword: string,  passwordHash: string): Observable<any | boolean>{
        return of<any |  boolean >(bcrypt.compare(newPassword, passwordHash))
    }
}
