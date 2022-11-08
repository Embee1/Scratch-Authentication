import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserRole } from './user.interface';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {v4 as uuidv4 } from 'uuid'
import path, { extname } from 'path';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //create user
  @Post()
  create(@Body() user: User):Observable<User | object>{
    return this.userService.create(user).pipe(
      map((user: User, ) => user),
        catchError(err => of({error: err.message}))
      )
  }

  //log user in
  @Post('login')
  login(@Body()user: User): Observable<Object>{
    return this.userService.login(user).pipe(
      map((jwt: string) => {
        return {access_token: jwt};
      })
    )}
    

  @Get(':id')
  findOne(@Param('id') params): Observable<User>{
    return this.userService.findOne(params.id)
  } 

// @hasRoles(U  serRole.ADMIN)
// @UseGuards(JwtAuthGuard, RolesGuard)
//   @Get()
//   index(
//     @Query('page') page: number =1,
//     @Query('limit') limit: number = 10,
//     @Query('username') username: string
//   ):Observable<Pagination<User>>{
// limit = limit > 100 ? 100 : limit;
// console.log(username);

// if(username === null || username === undefined){
//   return this.userService.paginate({page: Number(page), limit:Number(limit), route: 'http://localhost:3000/users'}); 
// }else{
//   return this.userService.paginateFilterByUsername({page: Number(page), limit:Number(limit), route: 'http://localhost:3000/users'},
//   {username}
//   )
// }
// }


@Delete(':id')
  deleteOne(@Param('id') id: number):Observable<User>{
    return this.userService.deleteOne(Number(id))
  }

  @Put(':id')
  updateOne(@Param('id') id: number, @Body()user: User ):Observable<User>{
  return this.userService.updateOne(Number(id), user)
}

@hasRoles(UserRole.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
@Put(':id/role')
updateRoleOfUser(@Param('id') id: string, @Body() user: User): Observable<User>{
  return this.userService.updateRoleOfUser(Number(id), user);
}
  
// @Post('upload')
// @UseInterceptors(FileInterceptor('file', {
//   storage: diskStorage({
//     destination:'./uploads/profileimages',
//     filename: (req, file, cb) => {
//       const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
//       const extension: string = path.parse(file.originalname).ext;

//       cb(null, `${filename}${extension}`)
//     }
//   })
// } ))
// uploadFile(@UploadedFile() file):Observable<Object>{
//   console.log(file);
//   return of({ imagePath: file.path});
// }

  // @Post()
  // create(@Body() user: User):Observable<User>{
  //   return this.userService.create(user)
  // }


  @Post('file')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './files',
      filename: (req, file, callback) => {
        const uniqueSuffix = 
        Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filename = `${uniqueSuffix}${ext}`;
        callback(null, filename);
      },
    }),  
  }))
  handleUpload(@UploadedFile() file:Express.Multer.File){

    console.log('file', file);
    return "File upload API"
  }
}
