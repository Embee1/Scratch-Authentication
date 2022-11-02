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
      type: 'postgres',
      host: 'ec2-44-199-22-207.compute-1.amazonaws.com',
      port: 5432,
      username:  "ziqsjefxsakxsc",
      password: "f107c840c8126df8540459d80eb9a2fc212224bda3a06be42cfbf403656e6503",
      database: "d49sjm30ojmjj5",
      entities: [Coffee, Flavor, UserEntity],
      synchronize: true,
      ssl: true
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
