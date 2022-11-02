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
      username: 'ooagwhzggqsscx',
      password: '1bc377b7d6e1dcff349982c81b1e681e59351503dbc0a5ff27c9aeac2fdbab45',
      database: 'd1hif7lgg4ur1o',
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
