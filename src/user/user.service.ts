import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from,throwError, Observable,} from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
// import { User } from './entities/user.entity';
import { UserEntity } from './user.entity';
import { User } from './user.interface';
import { switchMap, map, catchError } from 'rxjs/operators';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  private readonly authService: AuthService){}


  //Create/register user
 create(user: User): Observable<User>{
   return this.authService.hashedPassword(user.password).pipe(
    switchMap((passwordHash: string) => {
      const newUser = new UserEntity();
      newUser.name = user.name;
      newUser.username = user.username;
      newUser.email = user.email;
      newUser.password = passwordHash;

      return from(this.userRepository.save(newUser)).pipe(
        map((user: User) =>{
        
          return user;
        }),
        catchError(err => throwError(err))
      )
    })
   )
  }


  //find a single user
  findOne(id: number):Observable<User>{
    return from(this.userRepository.findOneBy({id})).pipe(
map((user: User) => {
  const{password, ...result} = user;
  return result;
})
    )
  }


  //find all users
  findAll(): Observable<User[]> {
    return from(this.userRepository.find()).pipe(
      map((users: User[]) => {
        users.forEach(function (v) {delete v.password});
        return users;
      })
    );
  }



  updateOne(id: number, user: User): Observable<any>{
    delete user.email;
    delete user.password;

    return from (this.userRepository.update(id, user));
  }

  //delete user
  deleteOne(id: number): Observable<any>{
    return from(this.userRepository.delete(id));
      }

//log user in
      login(user: User):Observable<string>{
        return this.validateUser(user.email, user.password).pipe(
          switchMap((user :User) =>{
            if(user){
              return this.authService.generateJWT(user).pipe(map((jwt:string) => jwt))
            }else{
              return 'wrong credentials'
            }
          })
        )
      }


      //validate user with email and password
      validateUser(email: string, password: string):Observable<User>{
return this.findByMail(email).pipe(
  switchMap((user: User) => this.authService.comparePasswords(password, user.password).pipe(
    map((match: boolean) =>{
      if(match){
        const {password, ...result} = user;
        return result
      }else{
        throw Error;
      }
    })
  ))
)
      }


      //validate with email
      findByMail(email: string):Observable<User>{
        return from (this.userRepository.findOneBy({email}));
      }


      
  //CREATE USER
  // create(user: User): Observable<User>{
  //   return from(this.userRepository.save(user));
  // }


//FIND USER BY ID
  // findOne(id: number):Observable<User>{
  //   return from (this.userRepository.findOneBy({id}))
  // }

  // findAll(): Observable<User[]>{
  //   return from (this.userRepository.find())
  // }

  

  // updateOne(id: number, user: User): Observable<any>{
  //   return from (this.userRepository.update(id, user))
  // }
}
