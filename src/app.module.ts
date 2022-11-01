import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './coffees/entities/coffee.entity';
import { Flavor } from './coffees/entities/flavor.entity';
import { UserModule } from './user/user.module';
import { UserEntity } from './user/user.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [CoffeesModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3307,
      username: 'root',
      password: '',
      database: 'scratch',
      entities: [Coffee, Flavor, UserEntity],
      synchronize: true,
    }),

    ConfigModule.forRoot(),
   
    TypeOrmModule.forFeature([Coffee, Flavor, UserEntity]),
  
    UserModule,
  
    AuthModule,
  
    ],
    
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  
}
