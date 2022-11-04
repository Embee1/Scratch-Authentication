import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserRole } from './user.interface';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/roles.guard';
import { Pagination } from 'nestjs-typeorm-paginate';

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
  findOne(@Param() params): Observable<User>{
    return this.userService.findOne(params.id)
  } 

@hasRoles(UserRole.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  index(
    @Query('page') page: number =1,
    @Query('limit') limit: number = 10,
  ):Observable<Pagination<User>>{
limit = limit > 100 ? 100 : limit
return this.userService.paginate({page, limit:limit, route: 'http://localhost:3000/users'}); 
  }

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
  


  // @Post()
  // create(@Body() user: User):Observable<User>{
  //   return this.userService.create(user)
  // }
}
